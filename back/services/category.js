const Category = require('../models/category');
const Product = require('../models/product');
const mongoose = require("mongoose");
// Create category or subcategory (if parent is provided)
const createCategory = async (name, parent = null) => {
  const category = new Category({ name, parent });
  return await category.save();
};
const getCategoryById = async (id) => {
  return await Category.find({ id }).populate("parent");
};
// Update category by id
const updateCategory = async (id, updates) => {
  return await Category.findByIdAndUpdate(id, updates, { new: true });
};

// Recursive function to find all descendant categories
const findDescendants = async (categoryId) => {
  const children = await Category.find({ parent: categoryId });
  let descendants = [...children];
  for (const child of children) {
    const childDescendants = await findDescendants(child._id);
    descendants = descendants.concat(childDescendants);
  }
  return descendants;
};

// Delete category and all its descendants, and related products
const deleteCategory = async (id) => {
  // Find all descendant categories
  const descendants = await findDescendants(id);

  // Collect all IDs to delete (including this one)
  const allCategoryIds = descendants.map(c => c._id);
  allCategoryIds.push(id);

  // Delete all products under these categories
  await Product.deleteMany({ category: { $in: allCategoryIds } });

  // Delete all descendant categories
  await Category.deleteMany({ _id: { $in: descendants.map(c => c._id) } });

  // Delete the category itself
  return await Category.findByIdAndDelete(id);
};

// Get categories optionally filtered by parent (null for root categories)
const getCategories = async (parent = null) => {
  return await Category.find({ parent }).populate("parent");
};
const getFlatCategories = async () => {
  return await Category.find();
};

const getAllCategories = async () => {
  // Find top-level categories (parent === null), populate their parent (null in this case)
  const topCategories = await Category.find({ parent: null }).populate('parent');

  // Recursive helper to fetch children for a given category
  const fetchChildren = async (categoryId) => {
    const children = await Category.find({ parent: categoryId }).populate('parent');
    const childrenWithDescendants = await Promise.all(
      children.map(async (child) => ({
        ...child.toObject(),
        children: await fetchChildren(child._id),
      }))
    );
    return childrenWithDescendants;
  };

  // For each top-level category, fetch its descendants recursively
  const categoriesWithDescendants = await Promise.all(
    topCategories.map(async (cat) => ({
      ...cat.toObject(),
      children: await fetchChildren(cat._id),
    }))
  );

  return categoriesWithDescendants;
};
const getProductsByCategory = async (categoryId, page = 1, limit = 10, sortOrder = '') => {
    if (!categoryId) {
        return {
            products: [],
            currentPage: 1,
            totalPages: 0,
            totalProducts: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
            limit: limit,
        };
    }

    try {
        const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
        const descendants = await findDescendants(categoryObjectId);
        const categoryIds = descendants.map(cat => cat._id.toString());
        categoryIds.push(categoryId.toString());

        const queryCategoryIds = categoryIds.map(id => new mongoose.Types.ObjectId(id));

        const query = {
            category: { $in: queryCategoryIds },
        };

        let sort = {};
        if (sortOrder === 'priceAsc') {
            sort = { discountPrice: 1, price: 1 };
        } else if (sortOrder === 'priceDesc') {
            sort = { discountPrice: -1, price: -1 };
        } else {
            sort = { createdAt: -1 };
        }

        // --- MOVE skipIndex DEFINITION HERE ---
        const skipIndex = (page - 1) * limit; // Correct placement

        // Calculate total count for pagination metadata
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        // Find products with category in the categoryIds list, applying pagination and sorting
        const products = await Product.find(query)
            
            .sort(sort)
            .skip(skipIndex) // Now skipIndex is defined
            .limit(limit)
            .lean();

        return {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            limit: limit,
        };
    } catch (error) {
        console.error("Error in backend service getProductsByCategory:", error);
        throw new Error(`Error fetching products by category: ${error.message}`);
    }
};
const moveCategoryAndReorder = async (id, newParentId, newOrder) => {
    const targetParentId = newParentId === '' ? null : newParentId;

    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const categoryToMove = await Category.findById(id).session(session);
        if (!categoryToMove) {
            await session.abortTransaction();
            throw new Error('Category not found.');
        }

        const oldParentId = categoryToMove.parent ? categoryToMove.parent.toString() : null;

        // Basic check: prevent a category from becoming its own parent
        if (id === targetParentId) {
             await session.abortTransaction();
             throw new Error('Cannot move a category under itself.');
        }
        // More complex check: prevent moving a category under one of its own descendants
        // This would require a recursive check or a materialized path/nested set model.
        // For simplicity, we're omitting it here, but it's important for robustness.


        // --- Step 1: Remove from old position and re-index old siblings ---
        if (oldParentId !== targetParentId) {
            // Only re-index old siblings if parent has actually changed
            const oldSiblings = await Category.find({ parent: oldParentId }).session(session).sort('order');
            const bulkOpsOldSiblings = [];
            let orderCounter = 1;
            for (const sibling of oldSiblings) {
                if (sibling._id.toString() !== id) { // Exclude the category being moved
                    bulkOpsOldSiblings.push({
                        updateOne: {
                            filter: { _id: sibling._id, parent: oldParentId },
                            update: { $set: { order: orderCounter++ } }
                        }
                    });
                }
            }
            if (bulkOpsOldSiblings.length > 0) {
                await Category.bulkWrite(bulkOpsOldSiblings, { session });
            }
        }

        // --- Step 2: Update category's parent and re-index new siblings ---
        categoryToMove.parent = targetParentId;
        await categoryToMove.save({ session }); // Save parent change first

        const newSiblings = await Category.find({ parent: targetParentId }).session(session).sort('order');
        const bulkOpsNewSiblings = [];
        let newOrderCounter = 1;

        // Create a temporary array to hold the new order of siblings
        // This is easier for calculating the final sequential order
        let orderedSiblings = [];
        let inserted = false;

        for (const sibling of newSiblings) {
            if (sibling._id.toString() === id) continue; // Skip the moved category for now

            if (newOrderCounter === newOrder && !inserted) {
                orderedSiblings.push(categoryToMove); // Insert the moved category
                inserted = true;
                newOrderCounter++; // Account for the moved category's position
            }
            orderedSiblings.push(sibling);
            newOrderCounter++;
        }

        // If the newOrder was past the end of the existing siblings, add it now
        if (!inserted) {
            orderedSiblings.push(categoryToMove);
        }

        // Now, assign final orders based on the `orderedSiblings` array
        orderedSiblings.forEach((cat, index) => {
            bulkOpsNewSiblings.push({
                updateOne: {
                    filter: { _id: cat._id },
                    update: { $set: { order: index + 1 } }
                }
            });
        });

        if (bulkOpsNewSiblings.length > 0) {
            await Category.bulkWrite(bulkOpsNewSiblings, { session });
        }

        await session.commitTransaction();

        // Return the old parent ID and the new category object for cache invalidation
        return { oldParentId, newCategory: categoryToMove };

    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error('Error in moveCategoryAndReorder service:', error);
        throw error;
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

module.exports = {
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getAllCategories,getFlatCategories,
  getProductsByCategory,
  moveCategoryAndReorder
};

const productModel = require("../models/product");
const ReviewModel = require("../models/Review");
const mongoose = require("mongoose");
const providerModel = require("../models/provider");
const Category = require("../models/category"); // Ensure this is imported

// Helper function to populate category and its parent chain
async function populateCategoryWithParents(category) {
    if (!category) return null;

    // Convert to plain JS object if needed
    category = category.toObject ? category.toObject() : category;

    let currentParentId = category.parent;
    const parents = [];

    while (currentParentId) {
        const parentCategory = await Category.findById(currentParentId).lean();
        if (!parentCategory) break; // Stop if parent not found
        parents.unshift(parentCategory); // Add to the beginning to maintain hierarchy order
        currentParentId = parentCategory.parent;
    }

    category.parents = parents; // Add a new "parents" array with full chain
    return category;
}

exports.getAllProducts = async () => {
  try {
    // Find products with only _id and name, and populate category (_id and name only)
    const products = await productModel
      .find({}, { name: 1 }) // only include name and _id

   

    return products;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};


exports.getProductById = async (productId) => {
    try {
        // Use lean() for performance and then populate category parents
        const product = await productModel.findById(productId).populate("category").lean();

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.category) {
            product.category = await populateCategoryWithParents(product.category);
        }

        return product;
    } catch (error) {
        throw new Error(`Error fetching product: ${error.message}`);
    }
};

exports.getProductByprovider = async (providerId) => {
    try {
        const products = await productModel.find({
            provider: providerId, // Make sure this matches your schema field name
            
        }).populate("category").lean(); // Use lean()

        // Populate full parent chain for each product's category
        const uniqueCategoryIds = [...new Set(products.map(p => p.category ? p.category._id : null).filter(Boolean))];
        const populatedCategoriesMap = new Map();
        for (const catId of uniqueCategoryIds) {
            const immediateCategory = await Category.findById(catId).lean();
            if (immediateCategory) {
                populatedCategoriesMap.set(catId.toString(), await populateCategoryWithParents(immediateCategory));
            }
        }
        for (const product of products) {
            if (product.category) {
                product.category = populatedCategoriesMap.get(product.category._id.toString());
            }
        }

        return products;
    } catch (error) {
        throw new Error(`Error fetching products by provider: ${error.message}`);
    }
};

exports.getProductsCategories = async () => {
    try {
        // Fetch all products to get their categories (more efficient than distinct if populating)
        const products = await productModel.find({}, "category").populate("category").lean();

        // Get unique categories and populate their parents
        const uniqueCategories = new Map();
        for (const product of products) {
            if (product.category && !uniqueCategories.has(product.category._id.toString())) {
                const populatedCategory = await populateCategoryWithParents(product.category);
                uniqueCategories.set(product.category._id.toString(), populatedCategory);
            }
        }
        return Array.from(uniqueCategories.values());
    } catch (error) {
        throw new Error(`Error fetching product categories: ${error.message}`);
    }
};


exports.getNewProducts = async ({ page = 1, limit = 10, sortOrder = '' }) => { // Added sortOrder here
    try {
        const query = { new: true };

        let sort = {};
        if (sortOrder === 'priceAsc') {
            sort = { discountPrice: 1, price: 1 }; // Sort by price ascending
        } else if (sortOrder === 'priceDesc') {
            sort = { discountPrice: -1, price: -1 }; // Sort by price descending
        } else {
            sort = { createdAt: -1 }; // Default for new products: newest first
        }

        const skipIndex = (page - 1) * limit;

        const totalProducts = await productModel.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await productModel.find(query)
           
            .populate("category")
            .sort(sort) // Use the dynamic sort object
            .skip(skipIndex)
            .limit(limit)
            .lean()
            .exec();

        // Populate full parent chain for each product's category
        const uniqueCategoryIds = [...new Set(products.map(p => p.category ? p.category._id : null).filter(Boolean))];
        const populatedCategoriesMap = new Map();
        for (const catId of uniqueCategoryIds) {
            const immediateCategory = await Category.findById(catId).lean(); // Assuming 'Category' is defined elsewhere
            if (immediateCategory) {
                populatedCategoriesMap.set(catId.toString(), await populateCategoryWithParents(immediateCategory)); // Assuming 'populateCategoryWithParents' is defined elsewhere
            }
        }
        for (const product of products) {
            if (product.category) {
                product.category = populatedCategoriesMap.get(product.category._id.toString());
            }
        }

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
        throw new Error(`Error fetching new products: ${error.message}`);
    }
};

exports.getDiscountedProducts = async ({ page = 1, limit = 10, sortOrder = '' }) => { // Added sortOrder here
    try {
        const query = {
            discountPrice: { $exists: true, $ne: null },
            $expr: { $lt: ["$discountPrice", "$price"] } // Ensure discountPrice is actually less than price
        };

        let sort = {};
        if (sortOrder === 'priceAsc') {
            sort = { discountPrice: 1, price: 1 }; // Sort by price ascending
        } else if (sortOrder === 'priceDesc') {
            sort = { discountPrice: -1, price: -1 }; // Sort by price descending
        } 
        const skipIndex = (page - 1) * limit;

        const totalProducts = await productModel.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await productModel.find(query)
           
            .populate("category")
            .sort(sort) // Use the dynamic sort object
            .skip(skipIndex)
            .limit(limit)
            .lean()
            .exec();

        // Populate full parent chain for each product's category
        const uniqueCategoryIds = [...new Set(products.map(p => p.category ? p.category._id : null).filter(Boolean))];
        const populatedCategoriesMap = new Map();
        for (const catId of uniqueCategoryIds) {
            const immediateCategory = await Category.findById(catId).lean(); // Assuming 'Category' is defined elsewhere
            if (immediateCategory) {
                populatedCategoriesMap.set(catId.toString(), await populateCategoryWithParents(immediateCategory)); // Assuming 'populateCategoryWithParents' is defined elsewhere
            }
        }
        for (const product of products) {
            if (product.category) {
                product.category = populatedCategoriesMap.get(product.category._id.toString());
            }
        }

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
        throw new Error(`Error fetching discounted products: ${error.message}`);
    }
};


exports.addProduct = async (productData) => {
    try {
        const processProduct = async (data) => {
            if (!data.image_url) {
                throw new Error("Image is required for each product.");
            }

            // Set createdAt only if not already set, or you want to ensure it's always set on add
            // data.createdAt = data.createdAt || new Date(); // Example: if you want to explicitly set

            const newProduct = new productModel(data);
            await newProduct.save();

            // Get the associated provider
            const provider = await providerModel.findById(newProduct.provider);
            if (!provider) {
                throw new Error("Associated provider not found.");
            }

            const existingSpecialities = provider.specialities || [];
            // Ensure category is an ObjectId before checking includes
            const newSpeciality = newProduct.category ? newProduct.category.toString() : null;

            if (newSpeciality && !existingSpecialities.some(s => s.toString() === newSpeciality)) {
                provider.specialities.push(newProduct.category); // Push ObjectId
                await provider.save();
            }

            return newProduct; // Return the saved product
        };

        if (Array.isArray(productData)) {
            const newProducts = await Promise.all(productData.map(processProduct));
            return newProducts;
        } else {
            return await processProduct(productData);
        }
    } catch (error) {
        throw new Error(`Error adding product(s): ${error.message}`);
    }
};

exports.addProductReview = async (
    productId,
    reviewData,
    userId
) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("Invalid productId format");
        }

        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        const newReview = new ReviewModel({
            product: productId,
            rating: reviewData.rating,
            feedback: reviewData.feedback,
            user: userId,
        });

        await newReview.save();

        return newReview;
    } catch (error) {
        throw new Error(`Error adding product review: ${error.message}`);
    }
};

exports.getProductReviews = async (productId) => {
    try {
        const reviews = await ReviewModel.find({ product: productId }).populate(
            "user",
            "name"
        ).lean(); // Use lean() for reviews too
        return reviews;
    } catch (error) {
        throw new Error(`Error fetching product reviews: ${error.message}`);
    }
};

exports.updateProduct = async (productId, updateData) => {
    try {
        // Fetch the existing product
        const existingProduct = await productModel.findById(productId).lean();
        if (!existingProduct) {
            throw new Error("Product not found");
        }

        // If no new image URL provided, keep the old one
        if (!updateData.imageUrl) {
            updateData.image_url = existingProduct.image_url; // Corrected to image_url
        } else {
            updateData.image_url = updateData.imageUrl; // Use the new imageUrl if provided
            delete updateData.imageUrl; // Remove the incorrect key
        }

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        ).lean(); // Use lean() for updated product

        if (!updatedProduct) {
            throw new Error("Product not found after update attempt"); // Should not happen if existingProduct was found
        }

        // Always update the provider's specialities with the product category
        const provider = await providerModel.findById(
            updatedProduct.provider
        );
        if (!provider) {
            throw new Error("Associated provider not found");
        }

        const existingSpecialities = provider.specialities || [];
        const newCategory = updatedProduct.category ? updatedProduct.category.toString() : null;

        if (newCategory && !existingSpecialities.some(s => s.toString() === newCategory)) {
            provider.specialities.push(updatedProduct.category);
            await provider.save();
        }

        return updatedProduct;
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
};

exports.deleteProduct = async (productId) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(productId).lean(); // Use lean()
        if (!deletedProduct) {
            throw new Error("Product not found");
        }
        return deletedProduct;
    } catch (error) {
        throw new Error(`Error deleting product: ${error.message}`);
    }
};
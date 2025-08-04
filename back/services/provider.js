const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ReportModel = require("../models/Report");
const providerModel = require("../models/provider");
const productModel = require("../models/product");
const orderModel = require("../models/order");
const Category = require("../models/category"); // Ensure this is imported
const SliderModel = require("../models/Slider");
const userModel = require("../models/user");
const resetpasswordtokenModel = require("../models/resetpasswordtoken");
const ReviewModel = require("../models/Review");
const crypto = require("crypto");
// --- Helper function to populate category with its parents ---
async function populateCategoryWithParents(category) {
    if (!category) return null;

    // Convert to plain JS object if needed (safe check)
    // If category is already a plain object from .lean(), .toObject() won't exist or won't change anything
    const categoryObj = category.toObject ? category.toObject() : category;

    let currentParentId = categoryObj.parent; // Assuming 'parent' field on Category model
    const parents = [];

    while (currentParentId) {
        const parentCategory = await Category.findById(currentParentId).lean();
        if (!parentCategory) break; // Stop if parent not found or reached root
        parents.unshift(parentCategory); // Add to the beginning to maintain hierarchy order (root to direct parent)
        currentParentId = parentCategory.parent;
    }

    categoryObj.parents = parents; // Add a new "parents" array with full chain
    return categoryObj;
}

// --- Helper function to get all descendant category IDs (including the provided ID) ---
async function getDescendantCategoryIds(categoryId) {
    let descendantIds = [categoryId]; // Start with the category itself
    let children = await Category.find({ parent: categoryId }).select('_id').lean();

    for (const child of children) {
        // Recursively find descendants for each child
        descendantIds = descendantIds.concat(await getDescendantCategoryIds(child._id));
    }
    return descendantIds;
}


exports.login = async (email, password) => {
    const provider = await providerModel.findOne({ email });
    if (!provider) throw new Error("Email invalid");

    const validPass = bcrypt.compareSync(password, provider.password);
    if (!validPass) throw new Error("Password invalid");

    const token = jwt.sign(
        {
            _id: provider._id,
            email: provider.email,
            role: provider.role,
            name: provider.name,
            rating: provider.rating,
        },
        process.env.JWT_SECRET
    );

    return { mytoken: token };
};

// Get all users
exports.getall = async () => {
    try {
        return await userModel.find({ role: "user" });
    } catch (error) {
        throw new Error("Error fetching users: " + error.message);
    }
};

exports.getRevenues = async (startDate, endDate) => {
    try {
        const query = {
            status: { $in: ["Confirmée", "Livrée"] }
        };

        // Helper function to parse YYYYMMDD to YYYY-MM-DD
        const parseYYYYMMDD = (dateString) => {
            if (!dateString || dateString.length !== 8 || isNaN(dateString)) {
                return null; // Invalid format
            }
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${year}-${month}-${day}`;
        };

        let parsedStartDate = null;
        let parsedEndDate = null;

        if (startDate) {
            parsedStartDate = parseYYYYMMDD(startDate);
            if (!parsedStartDate) {
                throw new Error("Invalid startDate format. Expected YYYYMMDD.");
            }
        }
        if (endDate) {
            parsedEndDate = parseYYYYMMDD(endDate);
            if (!parsedEndDate) {
                throw new Error("Invalid endDate format. Expected YYYYMMDD.");
            }
        }

        if (parsedStartDate && parsedEndDate) {
            const startOfDay = new Date(parsedStartDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(parsedEndDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        } else if (parsedStartDate) {
            const startOfDay = new Date(parsedStartDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            query.createdAt = { $gte: startOfDay };
        } else if (parsedEndDate) {
            const endOfDay = new Date(parsedEndDate);
            endOfDay.setUTCHours(23, 59, 59, 999);
            query.createdAt = { $lte: endOfDay };
        }

        const orders = await orderModel.find(query);

        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (typeof order.totalPrice === 'number' ? order.totalPrice : 0);
        }, 0);

        return totalRevenue;
    } catch (error) {
        throw new Error("Error calculating revenues: " + error.message);
    }
};

exports.addProduct = async (providerId, productData) => {
    try {
        // Ensure image_url is an array and not empty
        if (!productData.image_url || productData.image_url.length === 0) {
            throw new Error("At least one image is required for the product.");
        }

        const newProduct = new productModel({
            ...productData,
            provider: providerId,
        });
        await newProduct.save();

        return {
            product: newProduct,
        };
    } catch (error) {
        throw new Error("Error adding product: " + error.message);
    }
};

exports.getProductById = async (providerId, id) => {
    try {
        return await productModel.findOne({ provider: providerId, _id: id }).populate("category");
    } catch (error) {
        throw new Error("Error fetching product by ID " + id);
    }
};

exports.getOrderById = async (id) => {
    try {
        return await orderModel.findById(id)
            .populate({
                path: "items.product",
                select: "name price provider image_url",
            })
            .populate("user", "email phonenumber address");
    } catch (error) {
        throw new Error("Error fetching order by ID");
    }
};

// --- MODIFIED getAllProductsByProvider ---
exports.getAllProductsByProvider = async (providerId, { page = 1, limit = 10, searchTerm = '', selectedCategory = 'all' } = {}) => {
    try {
        const skip = (page - 1) * limit;

        // 1. Build the Mongoose query object based on filters
        let query = { provider: providerId }; // Always filter by providerId

        // Apply search filter if searchTerm is provided
        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' }; // Case-insensitive search on product name
        }

        // Apply category filter if selectedCategory is provided and not 'all'
        if (selectedCategory && selectedCategory !== 'all') {
            const targetCategory = await Category.findOne({ name: selectedCategory }).lean();

            if (targetCategory) {
                // Get all descendant category IDs (including the target category itself)
                const categoryIdsToFilterBy = await getDescendantCategoryIds(targetCategory._id);

                // Add the category filter to the query
                query.category = { $in: categoryIdsToFilterBy };
            } else {
                // If the selected category name doesn't exist, no products will match this filter.
                // Return an empty result immediately to avoid unnecessary DB queries.
                return { products: [], currentPage: page, totalPages: 0, totalProducts: 0 };
            }
        }

        // 2. Count total documents matching ALL applied filters BEFORE applying limit/skip
        const totalProducts = await productModel.countDocuments(query);

        // 3. Fetch products with filters and pagination
        const products = await productModel.find(query)
            .populate("category") // Populate the initial category reference
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() here to get plain JavaScript objects for modification

        // 4. Populate categories with their parents after the initial query
        // This loop applies the recursive parent population for each product's category
        for (const product of products) {
            if (product.category) {
                // Pass the partially populated category object from .populate()
                // The populateCategoryWithParents function will then fully populate its parents.
                product.category = await populateCategoryWithParents(product.category);
            }
        }

        // 5. Calculate totalPages
        const totalPages = Math.ceil(totalProducts / limit);

        // Return the full object including pagination and filtered product details
        return {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
        };

    } catch (error) {
        console.error("Error in getAllProductsByProvider service:", error);
        throw new Error("Error fetching products: " + error.message);
    }
};
// --- END MODIFIED getAllProductsByProvider ---


exports.updateOrderById = async (id, newData) => {
    try {
        const updatedOrder = await orderModel.findOneAndUpdate(
            {
                _id: id,
            },
            newData,
            { new: true }
        );
        return updatedOrder;
    } catch (error) {
        throw new Error("Error updating order: " + error.message);
    }
};

exports.getAllOrdersByProvider = async (providerId) => {
    try {
        console.log("Provider ID received:", providerId);

        const orders = await orderModel
            .find({})
            .populate({
                path: "items.product",
                select: "name price provider image_url",
            })
            .populate("user", "email phonenumber address");

        const filteredOrders = orders.filter((order) =>
            order.items.some(
                (item) =>
                    item.product &&
                    item.product.provider.toString() === providerId.toString()
            )
        );

        return filteredOrders;
    } catch (error) {
        throw new Error("Error fetching orders: " + error.message);
    }
};


exports.deleteOrderByIdAndProvider = async (id, providerId) => {
    try {
        // This query for deleting an order by 'items.provider' might be problematic
        // if an order contains items from multiple providers or if the provider field
        // in 'items' is not structured directly.
        // It's more common to associate the whole order with a single provider or
        // handle line-item deletion differently.
        const deletedOrder = await orderModel.findOneAndDelete({
            _id: id,
            "items.provider": providerId, // Confirm this path is correct for your schema
        });
        return deletedOrder;
    } catch (error) {
        throw new Error("Error deleting order: " + error.message);
    }
};

exports.deleteProductByIdAndProvider = async (id, providerId) => {
    try {
        const deletedProduct = await productModel.findOneAndDelete({
            _id: id,
            provider: providerId,
        });
        return deletedProduct;
    } catch (error) {
        throw new Error("Error deleting product: " + error.message);
    }
};

exports.updateProductByIdAndProvider = async (id, providerId, newData) => {
    try {
        const update = { $set: {}, $unset: {} };

        // Build $set with all valid fields
        for (const key in newData) {
            if (key === "discountPrice") {
                const val = newData.discountPrice;
                // If discountPrice is explicitly null/undefined/empty string/NaN, unset it
                if (val === null || val === undefined || val === "" || isNaN(val)) {
                    update.$unset.discountPrice = ""; // This will remove it from DB
                } else {
                    update.$set.discountPrice = val;
                }
            } else if (key !== "_id" && key !== "provider" && key !== "createdAt" && key !== "updatedAt") {
                // Exclude _id, provider, and timestamps from direct $set
                update.$set[key] = newData[key];
            }
        }

        // Remove empty $unset or $set if not needed
        if (Object.keys(update.$unset).length === 0) delete update.$unset;
        if (Object.keys(update.$set).length === 0) delete update.$set;

        // Ensure update object is not empty before proceeding
        if (Object.keys(update).length === 0) {
            console.warn("No valid fields to update for product:", id);
            // Optionally, fetch and return the existing product if nothing was to be updated
            return await productModel.findOne({ _id: id, provider: providerId });
        }


        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: id, provider: providerId },
            update,
            { new: true, runValidators: true } // Add runValidators for schema validation
        );

        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw new Error("Error updating product: " + error.message);
    }
};


exports.getProviderById = async (id) => {
    try {
        return await providerModel.findById(id);
    } catch (error) {
        throw new Error("Error fetching provider infos: " + error.message);
    }
};

exports.getAllReviews = async () => {
    try {
        return await ReviewModel.find().populate("user");
    } catch (error) {
        throw new Error("Error fetching reviews: " + error.message);
    }
};


exports.deleteReviewById = async (id) => {
    try {
        const deletedReview = await ReviewModel.findByIdAndDelete(id);
        if (!deletedReview) throw new Error("Review not found");
        return deletedReview;
    } catch (error) {
        throw new Error("Error deleting review: " + error.message);
    }
};

exports.getallReports = async () => {
    try {
        const reports = await ReportModel.find({});

        return reports;
    } catch (error) {
        throw new Error("Error fetching reports: " + error.message);
    }
};

exports.getReportById = async (id) => {
    return await ReportModel.findById(id);
};

exports.updateReportById = async (id, newData) => {
    try {
        const updatedReport = await ReportModel.findOneAndUpdate(
            {
                _id: id,
            },
            newData,
            { new: true }
        );
        return updatedReport;
    } catch (error) {
        throw new Error("Error updating report: " + error.message);
    }
};

exports.deleteReportById = async (id) => {
    try {
        const deletedReport = await ReportModel.findOneAndDelete({
            _id: id,
        });
        return deletedReport;
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.addToSlider = async (image_name, image_url) => {
    try {
        const newImage = new SliderModel({ image_name, image_url });

        await newImage.save();

        return newImage;
    } catch (error) {
        throw new Error(`Failed to add image: ${error.message}`);
    }
};

exports.getFromSlider = async () => {
    try {
        const images = await SliderModel.find();
        return images;
    } catch (error) {
        throw new Error("Error fetching images: " + error.message);
    }
};

exports.deleteFromSlider = async (id) => {
    try {
        const deletedimage = await SliderModel.findOneAndDelete({
            _id: id,
        });
        return deletedimage;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.updateImagebyid = async (id, newData) => {
    try {
        const updatedImage = await SliderModel.findOneAndUpdate(
            { _id: id },
            newData,
            {
                new: true,
            }
        );
        return updatedImage;
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.resetPassword = async (newPassword, token) => {
  try {
    const passToken = await resetpasswordtokenModel.findOne({ token });
    if (!passToken) {
      throw new Error("Invalid Token");
    }
    if (passToken.expired || passToken.expiresAt < Date.now())
      throw new Error("Token Expired");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await providerModel.findByIdAndUpdate(passToken.userId, {
      password: hashedPassword,
    });
    passToken.expired = true;
    passToken.expiresAt = undefined;
    await passToken.save();
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.forgetPassword = async (email) => {
  try {
    const user = await providerModel.findOne({ email });

    if (!user) {
      return { error: true, message: "User with this email not found" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const resetPasswordToken = await resetpasswordtokenModel.create({
      userId: user._id,
      token,
      expiresAt,
    });

    return { error: false, resetPasswordToken };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

exports.postPromo = async (promo) => {
  try {
   
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};


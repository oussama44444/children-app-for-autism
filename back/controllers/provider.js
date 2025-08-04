const providerService = require("../services/provider");
const getRedisClient = require('../redis-client');
const { invalidateCache } = require('../utils/cache');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await providerService.login(email, password);
        res.status(200).json(token);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.getall = async (req, res) => {
    try {
        const users = await providerService.getall();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getRevenues = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; 

    const revenues = await providerService.getRevenues(startDate, endDate); 
    res.status(200).json({"revenues":revenues});
  } catch (error) {
    console.error("Error fetching revenues:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};;
exports.getProductById = async (req, res) => {
    try {
        const { _id } = req.params;
        const providerId = req.provider._id;
        let product;

        const cacheKey = `product:${_id}`;
        const expirationSeconds = 3600;

        const redisClient = await getRedisClient();
        if (redisClient) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log(`Cache HIT for key: ${cacheKey}`);
                product = JSON.parse(cachedData);
            }
        }

        if (!product) {
            product = await providerService.getProductById(providerId, _id);
            if (redisClient && product) {
                await redisClient.setEx(cacheKey, expirationSeconds, JSON.stringify(product));
                console.log(`Controller: Data for ${cacheKey} cached in Redis.`);
            }
        }

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { _id } = req.params;
        const booking = await providerService.getBookingById(_id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const providerId = req.provider._id;
        const productData = req.body;
        //console.log(productData);

        const imageUrls = req.files ? req.files.map((file) => file.path) : [];

        if (imageUrls.length === 0) {
            return res.status(400).json({ error: "At least one image is required" });
        }

        productData.image_url = imageUrls;

        if (typeof productData.supplements === "string") {
            try {
                productData.supplements = JSON.parse(productData.supplements);
            } catch (error) {
                console.error("Error parsing supplements:", error.message);
                return res.status(400).json({ error: "Invalid supplements format" });
            }
        }

        const savedProduct = await providerService.addProduct(
            providerId,
            productData
        );
        console.log(savedProduct);

        await invalidateCache(`provider_products:${providerId}:*`);
        await invalidateCache('all_products:*');
        
        if (savedProduct.new || savedProduct.isNew) {
            await invalidateCache('new_products:*');
        }
        
        if (savedProduct.discountPrice > 0 || savedProduct.isDiscounted) {
            await invalidateCache('discounted_products:*');
        }
        
        
            console.log(savedProduct.product.category)
            await invalidateCache(`products_by_category:${savedProduct.product.category}:page:*:limit:*`);
        

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error adding product:", error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || "Internal Server Error" });
    }
};

exports.getproviders = async (req, res) => {
    try {
        const providers = await providerService.getproviders();
        res.status(200).json(providers);
    } catch (error) {
        console.error("Error fetching providers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getproviderInfo = async (req, res) => {
    try {
        const providerId = req.provider._id;
        const provider = await providerService.getProviderById(providerId);
        res.status(200).json(provider);
    } catch (error) {
        console.error("Error fetching provider infos:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getAllProductsByprovider = async (req, res) => {
    try {
        const providerId = req.provider._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || ''; // Extract search term
        const selectedCategory = req.query.category || 'all'; // Extract selected category

        let productsData;

        // Check if data is already in cache (handled by cacheMiddleware which populates req.cachedData)
        if (req.cachedData) {
            console.log("Serving products from cache.");
            productsData = JSON.parse(req.cachedData);
        } else {
            console.log("Fetching products from DB and caching.");
            // Pass the new filters (searchTerm, selectedCategory) to the service layer
            productsData = await providerService.getAllProductsByProvider(
                providerId,
                { page, limit, searchTerm, selectedCategory } // Pass all relevant parameters
            );

            // If caching is enabled and data was fetched (not from cache), store in Redis
            if (req.shouldCache && req.cacheKey && req.cacheExpiration && productsData) {
                const redisClient = await getRedisClient();
                if (redisClient) {
                    await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(productsData));
                }
            }
        }

        // It's generally good practice to always return a structure that includes
        // products, currentPage, totalPages, totalProducts, even if no products are found.
        // The frontend expects this structure.
        if (!productsData || !productsData.products) {
             productsData = { products: [], currentPage: page, totalPages: 0, totalProducts: 0 };
        }

        res.status(200).json(productsData);

    } catch (error) {
        console.error("Error fetching products by provider in controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const updatedOrder = await providerService.updateOrderById(id, newData);
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteProductByIdAndprovider = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.provider._id;

        const productToDelete = await providerService.getProductById(providerId, id);

        const deletedProduct = await providerService.deleteProductByIdAndProvider(id, providerId);
            console.log(deletedProduct)
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found or not authorized to delete." });
        }

        await invalidateCache(`product:${id}`);
        await invalidateCache(`provider_products:${providerId}:*`);
        
        await invalidateCache('all_products:*');
        await invalidateCache('new_products:*');
        await invalidateCache('discounted_products:*');

       
            await invalidateCache(`products_by_category:${productToDelete.category._id}:page:*:limit:*`);
        

        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateProductByIdAndProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.provider._id;

        const newData = { ...req.body };

        const oldProduct = await providerService.getProductById(providerId, id);

        if (typeof newData.supplements === "string") {
            try {
                newData.supplements = JSON.parse(newData.supplements);
            } catch (error) {
                console.error("Error parsing supplements:", error.message);
                return res.status(400).json({ error: "Invalid supplements format" });
            }
        }

        if (req.files && req.files.length > 0) {
            newData.image_url = req.files.map((file) => file.path);
        }

        const updatedProduct = await providerService.updateProductByIdAndProvider(
            id,
            providerId,
            newData
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found or not authorized to update." });
        }
        await invalidateCache('all_products:*');
        await invalidateCache('new_products:*');
        await invalidateCache('discounted_products:*');
        await invalidateCache(`product:${id}`);
        await invalidateCache(`provider_products:${providerId}:*`);

        await invalidateCache('all_products:*');
        
        const oldIsNew = oldProduct && (oldProduct.new || oldProduct.isNew);
        const newIsNew = updatedProduct.new || updatedProduct.isNew;
        if (oldIsNew !== newIsNew) {
            await invalidateCache('new_products:*');
        }

        const oldIsDiscounted = oldProduct && (oldProduct.discountPrice > 0 || oldProduct.isDiscounted);
        const newIsDiscounted = updatedProduct.discountPrice > 0 || updatedProduct.isDiscounted;
        if (oldIsDiscounted !== newIsDiscounted) {
            await invalidateCache('discounted_products:*');
        }

        if (oldProduct && oldProduct.category && updatedProduct.category && oldProduct.category.toString() !== updatedProduct.category.toString()) {
            await invalidateCache(`products_by_category:${oldProduct.category}:*`);
            await invalidateCache(`products_by_category:${updatedProduct.category}:*`);
        } else if (updatedProduct.category) {
            await invalidateCache(`products_by_category:${updatedProduct.category}:*`);
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { providerId } = req.params;
        const reviewData = req.body;
        const userId = req.user._id;

        let newReview;

        if (providerId) {
            newReview = await providerService.addproviderReview(
                providerId,
                reviewData,
                userId
            );
        } else {
            return res.status(400).json({ error: "providerId must be provided." });
        }

        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        let reviews;

        if (req.provider && req.provider._id) {
            reviews = await providerService.getAllReviews();
        } else {
            return res.status(400).json({ error: "Provider ID not provided." });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const providerId = req.provider && req.provider._id;

        if (!providerId) {
            return res.status(400).json({ error: "Provider ID not provided." });
        }

        const deletedReview = await providerService.deleteReviewById(id);

        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found or unauthorized." });
        }

        res.status(200).json(deletedReview);
    } catch (error) {
        console.error("Error deleting review:", error.message);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

exports.sendNotification = async (req, res) => {
    const { notifications } = req.body;

    try {
        if (!notifications || notifications.length === 0) {
            return res.status(400).json({ error: "No notifications provided." });
        }

        const notificationResponse = await providerService.sendPushNotification(
            notifications
        );

        res.status(200).json({
            message: "Notifications sent successfully",
            data: notificationResponse,
        });
    } catch (error) {
        console.error("Error sending notification:", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.updateproviderStatus = async (req, res) => {
    try {
        const providerId = req.provider._id;
        const { isOpen } = req.body;
        console.log(isOpen);
        if (typeof isOpen !== "boolean") {
            return res.status(400).json({ error: "Status must be a boolean value" });
        }

        const updatedprovider = await providerService.updateproviderStatus(
            providerId,
            isOpen
        );

        if (!updatedprovider) {
            return res.status(404).json({ error: "provider not found" });
        }

        res.status(200).json(updatedprovider);
    } catch (error) {
        console.error("Error updating provider status:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const order = await providerService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllOrdersByProvider = async (req, res) => {
    try {
        const providerId = req.provider._id;
        const orders = await providerService.getAllOrdersByProvider(providerId);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteOrderByIdAndProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const providerName = req.user.name;
        const deletedOrder = await providerService.deleteOrderByIdAndProvider(
            id,
            providerName
        );
        res.status(200).json(deletedOrder);
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getallReports = async (req, res) => {
    try {
        const reports = await providerService.getallReports();
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await providerService.getReportById(id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }
        res.status(200).json({
            report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the report.",
        });
    }
};

exports.modifyReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const providerData = req.body;
        const updatedReport = await providerService.updateReportById(
            reportId,
            providerData
        );
        res.status(200).json(updatedReport);
    } catch (error) {
        console.error("Error updating report:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteReportById = async (req, res) => {
    try {
        const reportId = req.params.id;
        const deletedReport = await providerService.deleteReportById(reportId);
        res.status(200).json(deletedReport);
    } catch (error) {
        console.error("Error deleting report by ID:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addToSlider = async (req, res) => {
  try {
    const { image_name } = req.body; 

    
    if (!req.file) {
      return res.status(400).json({ error: "An image is required for the slider." });
    }

    const imageUrl = req.file.path; 

   
    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).json({
        error: "Image URL is invalid after upload.",
      });
    }

   
    const savedImage = await providerService.addToSlider(image_name, imageUrl);

    res.status(201).json({
      message: "Image successfully added to slider",
      image: savedImage,
    });
  } catch (error) {
    console.error("Error adding image to slider:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSlider = async (req, res) => {
  try {
    const images = await providerService.getFromSlider();
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSliderImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_name ,} = req.body;

    // Start with an empty object for newData
    const newData = {};

    // Only add image_name if it's present in the request body
    if (image_name !== undefined) {
      newData.image_name = image_name;
    }
  
    // Check if a file is provided. If so, add imageUrl to newData.
    if (req.file) {
      const imageUrl = req.file.path;

      if (!imageUrl || typeof imageUrl !== "string") {
        return res.status(400).json({
          error: "Image URL is invalid after upload.",
        });
      }
      newData.image_url = imageUrl;
    }

    // If neither image_name nor a file is provided, there's nothing to update.
    if (Object.keys(newData).length === 0) {
      return res.status(400).json({ error: "No update data provided. Please provide an image file or an image name." });
    }

    const updatedImage = await providerService.updateImagebyid(id, newData);

    if (!updatedImage) {
      return res.status(404).json({ error: "Slider image not found." });
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteSliderImagebyid = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteImage = await providerService.deleteFromSlider(id);
    res.status(200).json(deleteImage);
  } catch (error) {
    console.error("Error deleting image by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await providerService.forgetPassword(email);

    if (result.error) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({
      message: "Reset password email sent",
      resetPasswordToken: result.resetPasswordToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const message = await providerService.resetPassword(newPassword, token);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.postPromo = async (req, res) => {
  try {
    const {promo} = req.body;
    const message = await providerService.postPromo(promo);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
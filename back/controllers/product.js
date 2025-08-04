const productService = require("../services/product");
const getRedisClient = require('../redis-client');
const { invalidateCache } = require('../utils/cache');

exports.getProducts = async (req, res) => {
    try {
        let products;

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            products = await productService.getAllProducts();
            const redisClient = await getRedisClient();
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(products));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            products = await productService.getAllProducts();
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProducts controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        let product;

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            const redisClient = await getRedisClient();
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(product));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            product = await productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProduct controller:", error);
        res.status(404).json({ error: `Product not found: ${error.message}` });
    }
};

exports.getProductByproviderId = async (req, res) => {
    try {
        const { provider } = req.params;
        let products;

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            products = await productService.getProductByprovider(provider);
            if (!products || products.length === 0) {
                return res.status(404).json({ error: "No products found for this provider" });
            }

            const redisClient = await getRedisClient();
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(products));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            products = await productService.getProductByprovider(provider);
            if (!products || products.length === 0) {
                return res.status(404).json({ error: "No products found for this provider" });
            }
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getProductByproviderId controller:", error);
        res.status(404).json({ error: `Error fetching products by provider: ${error.message}` });
    }
};



exports.getProductsCategories = async (req, res) => {
    try {
        let categories;

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            categories = await productService.getProductsCategories();

            const redisClient = await getRedisClient();
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(categories));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            categories = await productService.getProductsCategories();
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error fetching products categories: ${error.message}` });
    }
};
exports.getDiscountedProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const sortOrder = req.query.sort || ''; // Extract sortOrder from query, default to empty string
        let productsData;

        // Construct the options object to pass to the service
        const serviceOptions = { page, limit, sortOrder }; 

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            productsData = await productService.getDiscountedProducts(serviceOptions); // Pass options object

            const redisClient = await getRedisClient(); // Assuming getRedisClient() is defined elsewhere
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(productsData));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            productsData = await productService.getDiscountedProducts(serviceOptions); // Pass options object
        }

        res.status(200).json(productsData);
    } catch (error) {
        console.error("Error in getDiscountedProducts controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getNewProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const sortOrder = req.query.sort || ''; // Extract sortOrder from query, default to empty string
        let productsData;

        // Construct the options object to pass to the service
        const serviceOptions = { page, limit, sortOrder };

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            productsData = await productService.getNewProducts(serviceOptions); // Pass options object

            const redisClient = await getRedisClient(); // Assuming getRedisClient() is defined elsewhere
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(productsData));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            productsData = await productService.getNewProducts(serviceOptions); // Pass options object
        }

        res.status(200).json(productsData);
    } catch (error) {
        console.error("Error in getNewProducts controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        let reviews;

        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            reviews = await productService.getProductReviews(productId);

            const redisClient = await getRedisClient();
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(reviews));
                console.log(`Controller: Data for ${req.cacheKey} cached in Redis for ${req.cacheExpiration} seconds.`);
            } else {
                console.warn(`Controller: Redis client not available to set cache for ${req.cacheKey}`);
            }
        } else {
            reviews = await productService.getProductReviews(productId);
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error in getReviews controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const productData = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!imagePath) {
            return res.status(400).json({ error: "Image is required" });
        }

        const newProduct = await productService.addProduct({
            ...productData,
            image_url: imagePath,
        });

        await invalidateCache('all_products');
        await invalidateCache('new_products:*');
        if (newProduct.category) {
            await invalidateCache(`products_by_category:${newProduct.category}:*`);
        }
        if (newProduct.provider) {
            await invalidateCache(`products_by_provider:${newProduct.provider}:*`);
        }
        if (newProduct.isDiscounted) {
            await invalidateCache('discounted_products:*');
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error in addProduct controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviewData = req.body;
        const userId = req.user._id;

        let newReview;

        if (productId) {
            newReview = await productService.addProductReview(
                productId,
                reviewData,
                userId
            );
        } else {
            return res.status(400).json({ error: "Product ID must be provided." });
        }

        await invalidateCache(`product_reviews:${productId}`);
        await invalidateCache(`product:${productId}`);

        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error in addReview controller:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const oldProduct = await productService.getProductById(productId);

        if (imagePath) {
            updateData.imageUrl = imagePath;
        }

        const updatedProduct = await productService.updateProduct(
            productId,
            updateData
        );

        await invalidateCache(`product:${productId}`);
        await invalidateCache('all_products:*');
        await invalidateCache('new_products:*');

        if (oldProduct && oldProduct.category && updateData.category && oldProduct.category.toString() !== updateData.category.toString()) {
            await invalidateCache(`products_by_category:${oldProduct.category}:*`);
            await invalidateCache(`products_by_category:${updateData.category}:*`);
        } else if (updateData.category) {
            await invalidateCache(`products_by_category:${updateData.category}:*`);
        }

        if (oldProduct && oldProduct.provider && updateData.provider && oldProduct.provider.toString() !== updateData.provider.toString()) {
            await invalidateCache(`products_by_provider:${oldProduct.provider}:*`);
            await invalidateCache(`products_by_provider:${updateData.provider}:*`);
        } else if (updateData.provider) {
            await invalidateCache(`products_by_provider:${updateData.provider}:*`);
        }

        if (typeof updateData.isDiscounted !== 'undefined') {
            await invalidateCache('discounted_products:*');
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error in updateProduct controller:", error);
        res.status(404).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const productToDelete = await productService.getProductById(productId);

        const deletedProduct = await productService.deleteProduct(productId);

        await invalidateCache(`product:${productId}`);
        await invalidateCache('all_products:*');
        await invalidateCache('new_products:*');
        await invalidateCache('discounted_products:*');

        if (productToDelete && productToDelete.category) {
            await invalidateCache(`products_by_category:${productToDelete.category}:*`);
        }
        if (productToDelete && productToDelete.provider) {
            await invalidateCache(`products_by_provider:${productToDelete.provider}:*`);
        }

        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(404).json({ error: error.message });
    }
};
const express = require('express');
const categoryController = require('../controllers/category');
const isProvider = require("../middlewares/providerAuth"); // Assuming this middleware exists

const router = express.Router();

const getRedisClient = require('../redis-client'); // Assuming this path is correct

// Re-defining cacheMiddleware here for clarity, but it's fine if it's external
const cacheMiddleware = (cacheKey, expirationSeconds) => async (req, res, next) => {
    let redisClient;
    try {
        redisClient = await getRedisClient();
        if (!redisClient) {
            console.warn(`Redis client not available for ${cacheKey}, skipping cache.`);
            return next();
        }

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log(`Cache HIT for key: ${cacheKey}`);
            return res.json(JSON.parse(cachedData));
        }

        console.log(`Cache MISS for key: ${cacheKey}`);

        req.shouldCache = true;
        req.cacheKey = cacheKey;
        req.cacheExpiration = expirationSeconds;
        next();
    } catch (err) {
        console.error(`Redis cache middleware error for ${cacheKey}:`, err);
        next();
    }
};

// POST /api/categories - Create a new category
router.post('/', isProvider, categoryController.createCategory);

// GET /api/categories - Get categories by parent (or top-level)
router.get('/', categoryController.getCategories);

// GET /api/categories/flat - Get all categories in a flat list
router.get('/flat', cacheMiddleware('flat_categories', 86400), categoryController.getFlatCategories);

// GET /api/categories/:id/products - Get products for a specific category
router.get('/:id/products', async (req, res, next) => {
    const categoryId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort || 'default'; // <--- Get the sortOrder, default to 'default' if not present

    // IMPORTANT: Include sortOrder in your cache key
    // This ensures that different sort orders (priceAsc, priceDesc, default)
    // generate unique cache entries.
    const cacheKey = `products_by_category:${categoryId}:page:${page}:limit:${limit}:sort:${sortOrder}`;

    await cacheMiddleware(cacheKey, 30)(req, res, next);
}, categoryController.getProductsByCategory);

// GET /api/categories/all - Get all categories (might be similar to flat depending on definition)
router.get('/all',  categoryController.getAllCategories);


// PUT /api/categories/:id/move - Move a category to a new parent and/or reorder it
router.put('/:id/move', isProvider, categoryController.moveCategoryAndReorder);



// PUT /api/categories/:id - Update category details (e.g., name, description), NOT structure
router.put('/:id', isProvider, categoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', isProvider, categoryController.deleteCategory);

module.exports = router;
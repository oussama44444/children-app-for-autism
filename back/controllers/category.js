const categoryService = require('../services/category');
const getRedisClient = require('../redis-client');
const { invalidateCache } = require('../utils/cache'); // Assuming this utility exists

exports.createCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const category = await categoryService.createCategory(name, parent);

        // Invalidate all caches that might be affected by a new category
        //await invalidateCache('all_categories');
        //await invalidateCache('flat_categories');
        //await invalidateCache('top_level_categories');
        if (parent) {
            //await invalidateCache(`categories_by_parent:${parent}`);
        } else {
            // If new category is top-level, explicitly invalidate top_level_categories
            //await invalidateCache('top_level_categories');
        }

        res.status(201).json(category);
    } catch (err) {
        console.error('Error in createCategory controller:', err); // Log the error
        res.status(400).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const parent = req.query.parent || null;
        let categories;

        // The cacheMiddleware should ideally handle the `if (req.shouldCache)` part
        // and set `res.json(JSON.parse(cachedData))` if cache hit.
        // If it's a cache miss, it should call `next()` and then this controller fetches.
        // So, this block should primarily deal with the cache miss scenario.
        categories = await categoryService.getCategories(parent);

        // If caching is enabled and it was a cache miss (req.shouldCache is true)
        
        res.json(categories);
    } catch (err) {
        console.error('Error in getCategories controller:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getFlatCategories = async (req, res) => {
    try {
        let categories;

        categories = await categoryService.getFlatCategories();

       
        res.json(categories);
    } catch (err) {
        console.error('Error in getFlatCategories controller:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        let categories;

        categories = await categoryService.getAllCategories();

       
        res.json(categories);
    } catch (err) {
        console.error('Error in getAllCategories controller:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const sortOrder = req.query.sort || ''; // <--- NEW: Extract sortOrder from query parameters

        let productsData;

        // Pass the sortOrder to the backend service function
        productsData = await categoryService.getProductsByCategory(id, page, limit, sortOrder); // <--- Pass sortOrder here

        // Your existing caching logic
        if (req.shouldCache && req.cacheKey && req.cacheExpiration) {
            const redisClient = await getRedisClient(); // Assuming getRedisClient is defined
            if (redisClient) {
                await redisClient.setEx(req.cacheKey, req.cacheExpiration, JSON.stringify(productsData));
            }
        }

        if (!productsData.products || productsData.products.length === 0) {
            return res.status(200).json({
                message: "No products found for this category.",
                ...productsData
            });
        }

        res.status(200).json(productsData);
    } catch (err) {
        console.error('Error in getProductsByCategory controller:', err);
        res.status(500).json({ error: `Failed to fetch products for category: ${err.message}` });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch the category's current state to get its old parent
        const oldCategory = await categoryService.getCategoryById(id); // Assuming you have this service method
        if (!oldCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const oldParentId = oldCategory.parent ? oldCategory.parent.toString() : null; // Ensure it's a string or null

        // 2. Perform the update
        const updated = await categoryService.updateCategory(id, req.body);
        if (!updated) return res.status(404).json({ error: 'Category not found after update' });

        // 3. Invalidate caches

        // Invalidate general caches that depend on the full list
       // await invalidateCache('all_categories');
        //await invalidateCache('flat_categories');

        // Invalidate the cache for the *old* parent, if it existed
       

        // Invalidate the cache for the *new* parent, if it now exists
        
        
        res.json(updated);
    } catch (err) {
        console.error('Error in updateCategory controller:', err);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch category first to get its parent for cache invalidation
        const categoryToDelete = await categoryService.getCategoryById(id);
        if (!categoryToDelete) {
             return res.status(404).json({ error: 'Category not found' });
        }

        const oldParentId = categoryToDelete.parent; // Get parent BEFORE deletion

        const deleted = await categoryService.deleteCategory(id);
        if (!deleted) { // This check might be redundant if service throws error
            return res.status(404).json({ error: 'Category not found' });
        }

        // Invalidate caches
        await invalidateCache('all_categories');
        await invalidateCache('flat_categories');
        await invalidateCache('top_level_categories'); // A deletion might affect top level counts/lists
        if (oldParentId) {
            await invalidateCache(`categories_by_parent:${oldParentId}`);
        } else {
            await invalidateCache('top_level_categories');
        }
        await invalidateCache(`category:${id}`); // Invalidate cache for the deleted item itself

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error in deleteCategory controller:', err);
        res.status(400).json({ error: err.message });
    }
};


// Add this to your categoryController.js
exports.moveCategoryAndReorder = async (req, res) => {
    const { id } = req.params; // ID of the category being moved
    const { newParentId, newOrder } = req.body; // newParentId can be null, newOrder is the target position

    try {
        // The service layer handles all the complex logic (transactions, re-indexing)
        const { oldParentId, newCategory } = await categoryService.moveCategoryAndReorder(id, newParentId, newOrder);

        // Invalidate caches for affected categories and their parents
        await invalidateCache('all_categories');
        await invalidateCache('flat_categories');
        await invalidateCache('top_level_categories'); // Moving could affect top-level categories

        if (oldParentId) {
            await invalidateCache(`categories_by_parent:${oldParentId}`);
        } else {
            // If moved from top-level, invalidate top_level_categories specifically
            await invalidateCache('top_level_categories');
        }

        if (newCategory.parent) { // newCategory.parent will already be updated by the service
            await invalidateCache(`categories_by_parent:${newCategory.parent}`);
        } else {
            // If moved to top-level, invalidate top_level_categories specifically
            await invalidateCache('top_level_categories');
        }

        await invalidateCache(`category:${id}`); // If you cache individual categories

        res.status(200).json({ message: 'Category moved and reordered successfully.', category: newCategory });
    } catch (error) {
        console.error('Error in moveCategoryAndReorder controller:', error);
        res.status(500).json({ message: 'Failed to move category.', error: error.message });
    }
};
const express = require("express");
require("dotenv").config();
const upload = require("../middlewares/imgUpload");
const router = express.Router();
const isUser = require("../middlewares/auth");
const providerController = require("../controllers/provider");
const isProvider = require("../middlewares/providerAuth");
const { updateproviderRatings } = require("../services/provider");

const getRedisClient = require('../redis-client');


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
            console.log(`Fetching data from Redis cache for key: ${cacheKey}`);
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
router.get("/getrevenues", isProvider, providerController.getRevenues);
router.get("/getallusers", isProvider, providerController.getall);
router.get("/reports", isProvider, providerController.getallReports);
router.get("/reports/:id", isProvider, providerController.getReportById);
router.put("/reports/:id", isProvider, providerController.modifyReport);
router.delete("/reports/:id", isProvider, providerController.deleteReportById);
router.post(
    "/product",
    isProvider,
    upload.array("image", 10),
    providerController.addProduct
);
router.get("/reviews", isProvider, providerController.getReviews);
router.get("/:providerId/reviews", isUser, providerController.getReviews);
router.get("/products/:_id", isProvider, providerController.getProductById);

router.get("/infos", isProvider, providerController.getproviderInfo);

// routes/yourProductRoutes.js (or wherever this route is defined)

router.get(
    "/products",
    isProvider, // Authentication/Authorization middleware
    async (req, res, next) => {
        // Extract all relevant query parameters
        const providerId = req.provider._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchTerm = req.query.search || ''; // Get the search term
        const selectedCategory = req.query.category || 'all'; // Get the category name

        // Generate a dynamic cache key that includes all filter parameters
        // This ensures different combinations of filters/pagination have separate cache entries
        const dynamicCacheKey = `provider_products:${providerId}:page:${page}:limit:${limit}:search:${searchTerm}:category:${selectedCategory}`;
        const expirationSeconds = 300; // 5 minutes

        // Pass the request to the cache middleware
        await cacheMiddleware(dynamicCacheKey, expirationSeconds)(req, res, next);
    },
    // The actual controller function that handles the logic
    // This function will now receive req.query which contains page, limit, search, category
    providerController.getAllProductsByprovider
);
router.delete(
    "/products/:id",
    isProvider,
    providerController.deleteProductByIdAndprovider
);
router.put("/orders/:id", isProvider, providerController.updateOrderById);

router.delete(
    "/orders/:id",
    isProvider,
    providerController.deleteOrderByIdAndProvider
);
router.get("/orders", isProvider, providerController.getAllOrdersByProvider);
router.get("/orders/:id", isProvider, providerController.getOrderById);

router.put(
    "/products/:id",
    isProvider,
    upload.array("image", 10),
    providerController.updateProductByIdAndProvider
);
router.delete(
    "/reviews/:id",
    isProvider,
    providerController.deleteReviewById
);
router.post("/login", providerController.login);
router.post("/:providerId/reviews", isUser, providerController.addReview);
router.post("/send-notification", providerController.sendNotification);

router.post("/update-rating", async (req, res) => {
    try {
        await updateproviderRatings();
        res.json({ message: "providers ratings updated." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put(
    "/status",
    isProvider,
    providerController.updateproviderStatus
);


router.post("/slider", isProvider, upload.single("image"), providerController.addToSlider);
router.get("/slider", providerController.getSlider);
router.delete("/slider/:id", isProvider, providerController.deleteSliderImagebyid);
router.put("/slider/:id", isProvider, upload.single("image"), providerController.updateSliderImageById);
router.post("/forget-password", providerController.forgetPassword);
router.post("/promo", providerController.postPromo);
router.post("/reset-password", providerController.resetPassword);
module.exports = router;
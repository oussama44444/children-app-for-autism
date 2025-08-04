const express = require("express");
const productController = require("../controllers/product");
const upload = require("../middlewares/imgUpload");

const router = express.Router();
const isUser = require("../middlewares/auth");
const isProvider = require("../middlewares/providerAuth");

const getRedisClient = require('../redis-client');

// router.js
const cacheMiddleware = (keyPrefix, expirationSeconds) => async (req, res, next) => {
    let redisClient;
    try {
        redisClient = await getRedisClient();
        if (!redisClient) {
            console.warn(`Redis client not available for ${keyPrefix}, skipping cache.`);
            return next();
        }

        req.shouldCache = true;
        req.cacheKeyPrefix = keyPrefix; 
        req.cacheExpiration = expirationSeconds;

        next();
    } catch (err) {
        console.error(`Redis cache middleware error for ${keyPrefix}:`, err);
        next(); 
    }
};


router.get("/", cacheMiddleware('all_products', 3600), productController.getProducts);



router.get("/discounted", cacheMiddleware('discounted_products', 600), productController.getDiscountedProducts);

router.get(
  "/by-provider/:provider",
  async (req, res, next) => {
    const providerId = req.params.provider;
    if (providerId) {
      await cacheMiddleware(`products_by_provider:${providerId}`, 1800)(req, res, next);
    } else {
      next();
    }
  },
  productController.getProductByproviderId
);

router.get("/new", cacheMiddleware('new_products', 300), productController.getNewProducts);

router.get("/by-id/:productId", async (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    await cacheMiddleware(`product:${productId}`, 3600)(req, res, next);
  } else {
    next();
  }
}, productController.getProduct);

router.get("/:productId/reviews", async (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    await cacheMiddleware(`product_reviews:${productId}`, 300)(req, res, next);
  } else {
    next();
  }
}, productController.getReviews);

router.post("/:productId/reviews", isUser, productController.addReview);

module.exports = router;
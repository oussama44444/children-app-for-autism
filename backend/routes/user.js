const express = require("express");
require("dotenv").config();

const router = express.Router();

const userController = require("../controllers/user");
const authenticateToken = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");

router.get("/",adminAuth,userController.getAll)
router.post("/login", userController.login);

router.post("/register", userController.register);

router.get("/verify/:id/:token", userController.verifyEmail); //server version
router.get("/:userId/reviews", userController.getReviews);

router.post("/forget-password", userController.forgetPassword);

router.post("/reset-password", userController.resetPassword);

// Push notification token routes
router.post("/push-token", authenticateToken, userController.registerPushToken);
router.delete("/push-token", authenticateToken, userController.removePushToken);

module.exports = router;

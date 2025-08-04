const express = require("express");
const OrderController = require("../controllers/order");
const authenticate = require("../middlewares/auth");
const router = express.Router();

router.post("/", authenticate, OrderController.createOrder);
router.get("/user", authenticate, OrderController.getOrdersByUserId); 
router.get("/", OrderController.getAllOrders);
router.get("/:id", authenticate, OrderController.getOrderById);

router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.cancelOrder);

module.exports = router;

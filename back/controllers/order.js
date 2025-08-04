const orderService = require("../services/order");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {  items, paymentMethod, deliveryMethod, totalPrice } =
      req.body;

    if (!userId || !items || !paymentMethod || !deliveryMethod || !totalPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await orderService.createOrder({
      userId,
      items,
      paymentMethod,
      deliveryMethod,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to create order: ${error.message}` });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;  
    const userId = req.user._id;
    const order = await orderService.getOrderById(id,userId);  // service should get order by its id

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to retrieve order: ${error.message}` });
  }
};

exports.getOrdersByUserId = async (req, res) => {
  try {
  const userId = req.user._id;
    const orders = await orderService.getOrdersByUserId(userId);  // service should get all orders for this user

    res.status(200).json(orders || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to retrieve orders: ${error.message}` });
  }
}

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();

    res.status(200).json(orders || []);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to retrieve orders: ${error.message}` });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `Failed to update order status: ${error.message}` });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const canceledOrder = await orderService.cancelOrder(orderId);

    if (!canceledOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order canceled successfully", canceledOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to cancel order: ${error.message}` });
  }
};

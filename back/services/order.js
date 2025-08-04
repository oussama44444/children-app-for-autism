const mongoose = require("mongoose");
const orderModel = require("../models/order");
const productModel = require("../models/product");
const userModel = require("../models/user");
const { trackOrderConfirmed } = require('../utils/amplitude'); // Adjust the path as needed
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
exports.createOrder = async (orderData) => {
  try {
    const { userId, items, paymentMethod, deliveryMethod, totalPrice } = orderData;
const emailItems=[]
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let deliveryAddress = null;
    if (deliveryMethod === "Livraison à domicile") {
      if (!user.address || !user.address.street) {
        throw new Error("User must have a valid address for home delivery");
      }
      deliveryAddress = user.address;
    }

    let calculatedTotal = 0;

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        throw new Error(`Invalid product ID: ${item.product}`);
      }

      const product = await productModel.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      // Parse selectedOptions object to array for price calculation
      const optionsArray = Object.entries(item.selectedOptions || {}).map(
        ([key, value]) => ({
          type: key,
          name: value.name,
          
        })
      );
       // console.log("this is the options",optionsArray);

      // Base price for product quantity
      let itemTotalPrice = product.price * item.quantity;

      // Add prices for each selected option multiplied by quantity
      for (const option of optionsArray) {
        if (typeof option.price === "number") {
          itemTotalPrice += option.price * item.quantity;
        }
      }

      calculatedTotal += itemTotalPrice;

      
   
        emailItems.push({
            productName: product.name,
            quantity: item.quantity,
            selectedOptions: optionsArray,
          });

          console.log(JSON.stringify(emailItems, null, 2));
    }

    if (deliveryMethod === "Livraison à domicile") {
      calculatedTotal += 8;
    }

    if (calculatedTotal !== totalPrice) {
      throw new Error(
        `Total price mismatch. Calculated: ${calculatedTotal}, Provided: ${totalPrice}`
      );
    }

    // Convert selectedOptions from object to array for saving
    const simplifiedItems = items.map((item) => {
      const selectedOptionsArray = Object.entries(item.selectedOptions || {}).map(
        ([type, option]) => ({
          type,
          name: option.name,
          price: option.price,
        })
      );

      return {
        product: item._id || item.product,
        quantity: item.quantity,
        selectedOptions: selectedOptionsArray,
      };
    });

    console.log(JSON.stringify(simplifiedItems, null, 2));

    const newOrder = new orderModel({
      user: userId,
      items: simplifiedItems,
      paymentMethod,
      deliveryMethod,
      totalPrice: calculatedTotal,
      deliveryAddress,
      status: "En attente",
    });
    await trackOrderConfirmed({
        userId: userId.toString(), // Adjust if stored differently
      });
//console.log('Order data before save:', JSON.stringify(newOrder.toObject(), null, 2));
    await newOrder.save();
const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App password recommended
      },
    });

   const orderItemsHtml = emailItems.map((item, i) => {
  const options = item.selectedOptions.map(opt =>
    `<li>${opt.type}: ${opt.name} </li>`).join('');
  return `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ccc;">
        <strong>Article ${i + 1}</strong><br>
        Produit : <strong>${item.productName}</strong><br>
        Quantité : ${item.quantity}<br>
        <ul style="padding-left: 20px; margin: 5px 0;">${options}</ul>
      </td>
    </tr>
  `;
}).join('');

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: user.email,
  subject: '🧾 Reçu de commande - Merci pour votre achat !',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;">
      <h2 style="text-align: center; color: #2c3e50;">Reçu de Commande</h2>
      <p>Bonjour <strong>${user.name || 'Client(e)'}</strong>,</p>
      <p>Merci pour votre commande sur <strong>Promo-net</strong> ! Voici votre reçu :</p>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px;"><strong>Méthode de livraison:</strong></td>
          <td style="padding: 5px;">${deliveryMethod}</td>
        </tr>
        <tr>
          <td style="padding: 5px;"><strong>Méthode de paiement:</strong></td>
          <td style="padding: 5px;">${paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 5px;"><strong>Total:</strong></td>
          <td style="padding: 5px;">${calculatedTotal} DT</td>
        </tr>
      </table>

      <h3 style="margin-top: 20px;">🛍️ Détails de la commande</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${orderItemsHtml}
      </table>

      ${deliveryMethod === "Livraison à domicile" ? `
        <h3 style="margin-top: 20px;">📦 Adresse de livraison</h3>
        <p>${deliveryAddress.street}<br>${deliveryAddress.city}, ${deliveryAddress.zipCode}</p>
      ` : ''}

      <p style="margin-top: 20px;">📩 Nous vous informerons dès que votre commande sera en cours de traitement.</p>
      <p>Cordialement,<br><strong>L’équipe Promo-net</strong></p>

      <hr style="margin-top: 30px;">
      <p style="font-size: 12px; color: #888;">Ce reçu vous est envoyé automatiquement. Veuillez ne pas répondre à cet e-mail.</p>
    </div>
  `
};


    await transporter.sendMail(mailOptions);
    console.log("Receipt email sent to:", user.email);
    return newOrder;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};


exports.getAllOrders = async () => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "email")
      .populate("items.product", "name price provider image_url ");
    return orders;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

exports.getOrdersByUserId = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const orders = await orderModel
      .find({ user: userId })
      .populate("user", "name email address")
      .populate("items.product", "image_url provider name price ");

    if (!orders || orders.length === 0) {
      return [];
    }

    return orders;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

exports.getOrderById = async (orderId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const order = await orderModel
    .findOne({ _id: orderId, user: userId })  // match both order ID and user ID
    .populate("user", "name email")
    .populate("items.product", "name price image_url provider");

  return order; // null if not found or not owned by user
};

exports.updateOrderStatus = async (orderId, status) => {
  try {
      const validStatuses = [
    "En attente",
    "En cours de traitement",
    "Expédié",
    "Livré",
    "Annulé",
  ];


    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }
};

exports.cancelOrder = async (orderId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order ID format");
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "Pending") {
      throw new Error("Only pending orders can be cancelled");
    }


    order.status = "Cancelled";
    await order.save();

    return order;
  } catch (error) {
    throw new Error(`Error cancelling order: ${error.message}`);
  }
};

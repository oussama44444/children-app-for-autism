const mongoose = require("mongoose");
let nanoid;
(async () => {
  const { customAlphabet } = await import("nanoid");
  nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 8);
})();


const orderSchema = new mongoose.Schema({
  shortId: {
    type: String,
    default: () => nanoid(),
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      
      selectedOptions: [
        {
          name: { type: String },
          type: { type: String },
        },
      ],
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
 paymentMethod: {
  type: String,
  enum: ["Cheque", "Transfert bancaire", "Paiement à la livraison"],
  required: true,
},
deliveryMethod: {
  type: String,
  enum: ["Livraison à domicile"],
  required: true,
},

  deliveryAddress: {
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    required: function () {
      return this.deliveryMethod === "Paiement à la livraison";
    },
  },
status: {
  type: String,
  enum: ["En attente", "Confirmée", "Expédiée", "Livrée", "Annulée"],
  default: "En attente",
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Reference to the Subcategory model
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  new: {
    type: Boolean,
    required: true,
    default: false,
  },
  // Changed image_url to an array of Strings
  image_url: {
    type: [String], // This makes it an array of strings
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  supplements: {
    type: Map,
    of: [Schema.Types.Mixed],
    default: {},
  },
});

const Product = model("Product", productSchema);

module.exports = Product;
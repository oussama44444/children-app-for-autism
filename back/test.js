const mongoose = require("mongoose");
const Category = require('../models/category');
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/your_database_name";




async function updateCategoryOrder() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    // Find categories with parent == null, sort by _id (default order), and missing order field
    const categories = await Category.find({ parent: null }).sort({ _id: 1 });

    let order = 0;

    for (const category of categories) {
      if (category.order === undefined) {
        category.order = order;
        await category.save();
        console.log(`Updated category ${category._id} with order: ${order}`);
      }
      order++;
    }

    console.log("Category order update complete.");
  } catch (err) {
    console.error("Error updating categories:", err);
  } finally {
    await mongoose.disconnect();
  }
}

updateCategoryOrder();

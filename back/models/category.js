const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null, // root categories have no parent
  },
  order: { // <-- THIS FIELD IS CRITICAL FOR SORTING
        type: Number,
        default: 0, // A default value is good if categories are created without explicit position
    },
});

module.exports = mongoose.model('Category', categorySchema);

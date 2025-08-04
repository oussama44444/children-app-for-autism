const { Schema, mongoose } = require("mongoose");

const providerSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
  },
 image_url: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true },
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  },

  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 100,
  },
  phonenumber: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const Provider =
  mongoose.models.Provider || mongoose.model("Provider", providerSchema);

module.exports = Provider;

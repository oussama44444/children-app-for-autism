const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema({
  googleId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    maxlength: 32,
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

  phonenumber: {
    type: Number,
  },

  role: {
    type: String,
    enum: ["user", "admin", "provider"],
    default: "user",
  },

  image: {
    type: String,
    default:
      "https://i.pinimg.com/474x/51/f6/fb/51f6fb256629fc755b8870c801092942.jpg",
  },

  verified: {
    type: Boolean,
    default: true,
  },

  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
    country: { type: String, required: false },
  },
  notif_token: {
    type: String,
  },

});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

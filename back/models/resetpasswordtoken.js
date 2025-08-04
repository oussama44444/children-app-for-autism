const mongoose = require("mongoose");

const resetPasswordTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  expired: { type: Boolean, default: false },
  expiresAt: Date,
});

const ResetPasswordToken = mongoose.model(
  "ResetPasswordToken",
  resetPasswordTokenSchema
);

module.exports = ResetPasswordToken;

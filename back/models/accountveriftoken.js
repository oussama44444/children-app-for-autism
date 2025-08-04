const mongoose = require("mongoose");

const accountVerifTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  expired: { type: Boolean, default: false },
  expiresAt: Date,
});

const AccountVerifToken = mongoose.model(
  "AccountVerifToken",
  accountVerifTokenSchema
);

module.exports = AccountVerifToken;

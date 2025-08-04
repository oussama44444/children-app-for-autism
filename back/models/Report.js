const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  reportIssue: { type: String, required: true },
  content: { type: String, required: true },
  orderID: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Report", reportSchema);

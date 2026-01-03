const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TND' },
  provider: { type: String, default: 'unknown' },
  providerId: { type: String, default: '' },
  status: { type: String, enum: ['pending','success','failed'], default: 'pending' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

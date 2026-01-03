const Transaction = require('../models/transaction');
const User = require('../models/user');

async function createTransaction({ userId, amount, currency = 'TND', provider = 'unknown', providerId = '', status = 'success', metadata = {} }) {
  // create transaction record
  const tx = new Transaction({ user: userId, amount, currency, provider, providerId, status, metadata });
  await tx.save();

  // If transaction succeeded, upgrade user to premium
  if (status === 'success') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.premium = true;
    user.subscriptionDate = new Date();
    // default to 1 year subscription if not provided
    const oneYear = 1000 * 60 * 60 * 24 * 365;
    user.subscriptionEndDate = metadata.subscriptionEndDate ? new Date(metadata.subscriptionEndDate) : new Date(Date.now() + oneYear);
    await user.save();
  }

  return tx;
}

async function getTransactions({ page = 1, limit = 20, filters = {} } = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 20);
  const filter = {};
  if (filters.userId) filter.user = filters.userId;
  if (filters.status) filter.status = filters.status;
  if (filters.provider) filter.provider = filters.provider;

  const total = await Transaction.countDocuments(filter);
  const data = await Transaction.find(filter)
    .populate('user', 'firstName lastName email premium')
    .sort({ createdAt: -1 })
    .skip((p - 1) * l)
    .limit(l);

  return {
    count: data.length,
    data,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.max(1, Math.ceil(total / l)),
    }
  };
}
module.exports = {
  createTransaction,
  getTransactions,
};


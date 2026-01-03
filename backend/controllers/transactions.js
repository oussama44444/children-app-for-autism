const transactionsService = require('../services/transactions');

const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const filters = {};
    if (req.query.userId) filters.userId = req.query.userId;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.provider) filters.provider = req.query.provider;

    const result = await transactionsService.getTransactions({ page, limit, filters });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { amount, currency, provider, providerId, status, metadata } = req.body;

    const tx = await transactionsService.createTransaction({
      userId,
      amount: Number(amount) || 0,
      currency,
      provider,
      providerId,
      status: status || 'success',
      metadata: metadata || {}
    });

    res.json({ success: true, data: tx });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createTransaction, getTransactions };

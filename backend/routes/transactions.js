const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions');
const auth = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

// Create a transaction and upgrade user on success (authenticated user)
router.post('/', auth, transactionsController.createTransaction);

// Admin: list transactions (paginated, filterable)
router.get('/', adminAuth, transactionsController.getTransactions);

module.exports = router;

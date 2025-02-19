const express = require('express');
const router = express.Router();

// In-memory storage for transactions
let transactions = [];

// Get All Transactions
router.get('/', (req, res) => {
  res.status(200).json(transactions);
});

// Add New Transaction
router.post('/', (req, res) => {
  const { category, amount, description, date, status } = req.body;

  // Validate required fields
  if (!category || !amount || !description || !date || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create new transaction object
  const newTransaction = {
    id: transactions.length + 1,
    category,
    amount,
    description,
    date,
    status
  };

  // Add to the in-memory transactions array
  transactions.push(newTransaction);

  res.status(201).json(newTransaction);
});

// Get Total of Successful Transactions
router.get('/total', (req, res) => {
  // Filter transactions to only include those with 'status' as 'Completed' (or 'Successful')
  const successfulTransactions = transactions.filter(transaction => transaction.status === 'Successfull');

  // Calculate the total sum of the 'amount' for successful transactions
  const totalAmount = successfulTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  res.status(200).json({ totalAmount });  // Return the total amount of successful transactions as JSON
});

module.exports = router;

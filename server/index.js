const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // Using mysql2 for better MySQL support in Node.js
const app = express();
// const mysql =require('mysql')

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'react',  // Update with your MySQL username
  password: 'react1234',  // Update with your MySQL password
  database: 'quantra'
});

const transactionRoutes = require('./routes/Transactions');
app.use('/api/transactions', transactionRoutes);


let goals = [];

// Route to Add a New Goal
app.post('/api/goals', (req, res) => {
  const { name, completionDate, goalType, amount } = req.body;
  const dateFilled = new Date().toISOString().split('T')[0];
  const status = new Date(completionDate) >= new Date() ? 'Ongoing' : 'Completed';

  const query = 'INSERT INTO goals (name, goalType, amount, savedAmount, completionDate, status) VALUES (?, ?, ?, ?, ?, ?)';
  pool.query(query, [name, goalType, amount, 0, completionDate, status], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding goal', error: err });
    }
    res.status(201).json({ id: result.insertId, name, goalType, amount, savedAmount: 0, completionDate, status });
  });
});

// Route to Get All Goals
app.get('/api/goals', (req, res) => {
  pool.query('SELECT * FROM goals', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving goals', error: err });
    }
    res.json(results);
  });
});

app.get('/api/balance', (req, res) => {
  res.json({ balance: 100000 }); // You can replace 10000 with dynamic value or database call
});

// app.post('/api/transactions', (req, res) => {
//   const { amount } = req.body;

//   // Check for sufficient balance (Assuming initial balance is 10000)
//   const currentBalance = 100000;
//   const updatedBalance = currentBalance - amount;

//   if (updatedBalance >= 0) {
//     req.body.status = 'Successfull';
//     res.json({ ...req.body, status: 'Successfull' });
//   } else {
//     req.body.status = 'Failed';
//     res.json({ ...req.body, status: 'Failed' });
//   }
// });

app.get('/api/total-goals-amount', (req, res) => {
  const totalAmount = goals.reduce((acc, goal) => acc + Number(goal.amount), 0); // Ensure amount is treated as a number
  res.json({ totalAmount });
});

app.get('/api/goals/count', (req, res) => {
  // Return the count of goals stored in memory
  res.json({ count: goals.length });
});









// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

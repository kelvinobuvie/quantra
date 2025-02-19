const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// const mysql =require('mysql')

app.use(cors());
app.use(bodyParser.json());

const transactionRoutes = require('./routes/Transactions');
app.use('/api/transactions', transactionRoutes);


let goals = [];

// Route to Add a New Goal
app.post('/api/goals', (req, res) => {
    const { name, completionDate, goalType, amount } = req.body;
    const dateFilled = new Date().toISOString().split('T')[0];
    const status = new Date(completionDate) >= new Date() ? 'Ongoing' : 'Completed';
    const newGoal = { name, goalType, amount, dateFilled, completionDate, status };
    goals.push(newGoal);
    res.status(201).json(newGoal);  
  });

// Route to Get All Goals
app.get('/api/goals', (req, res) => {
  res.json(goals);
});

app.get('/api/balance', (req, res) => {
  res.json({ balance: 100000 }); // You can replace 10000 with dynamic value or database call
});

app.post('/api/transactions', (req, res) => {
  const { amount } = req.body;

  // Check for sufficient balance (Assuming initial balance is 10000)
  const currentBalance = 100000;
  const updatedBalance = currentBalance - amount;

  if (updatedBalance >= 0) {
    req.body.status = 'Successfull';
    res.json({ ...req.body, status: 'Successfull' });
  } else {
    req.body.status = 'Failed';
    res.json({ ...req.body, status: 'Failed' });
  }
});

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

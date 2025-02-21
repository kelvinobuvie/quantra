const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'react',  // Update with your MySQL username
  password: 'react1234',  // Update with your MySQL password
  database: 'quantra'
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
  pool.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
      console.error('Error retrieving transactions:', err);
      return res.status(500).json({ status: 'Failed', message: 'Error retrieving transactions', error: err });
    }

    res.status(200).json({ status: 'Successful', transactions: results });
  });
});

// Handle transactions
app.post('/api/transactions', (req, res) => {
  const { category, amount, description, status, date } = req.body;

  if (!category || !amount || !description) {
    return res.status(400).json({ status: 'Failed', message: "Missing required fields" });
  }

  const query = 'INSERT INTO transactions (category, amount, description, status, date) VALUES (?, ?, ?, ?, ?)';

  pool.query(query, [category, amount, description, status, date], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).json({ status: 'Failed', message: 'Error adding transaction', error: err });
    }

    res.status(201).json({ status: 'Successful', message: 'Transaction added successfully' });
  });
});

// Get transactions where category is 'Savings' or 'Safe Lock'
app.get('/api/transactions/savings-safelock', (req, res) => {
  // SQL query to fetch transactions with category 'Savings' or 'Safe Lock'
  const query = "SELECT * FROM transactions WHERE category IN ('Saving', 'Safe Lock')";

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', message: 'Error fetching transactions', error: err });
    }

    // Return the transactions as a JSON response
    res.status(200).json({ status: 'Successful', transactions: results });
  });
});

// Get count of transactions where category is 'Savings' or 'Safe Lock'
app.get('/api/transactions/count/savings-safelock', (req, res) => {
  // SQL query to count transactions with category 'Savings' or 'Safe Lock'
  const query = "SELECT COUNT(*) AS count FROM transactions WHERE category IN ('Saving', 'Safe Lock')";

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', message: 'Error fetching transaction count', error: err });
    }

    // Send the count as part of the response
    const count = results[0]?.count || 0;
    res.status(200).json({ status: 'Successful', count });
  });
});

// Assuming you have an Express app setup
// app.get('/api/transactions/total/savings-safelock', (req, res) => {
//   const query = `
//     SELECT SUM(amount) AS total
//     FROM transactions
//     WHERE category IN ('Saving', 'Safe Lock');
//   `;
  
//   pool.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching total amount:', err);
//       return res.status(500).json({ message: 'Error fetching total amount', error: err });
//     }

//     const totalAmount = results[0]?.total || 0; // If no transactions, default to 0
//     res.json({ total: totalAmount });
//   });
// });

// API route to get total amount for Savings and Safe Lock categories
app.get('/api/total-goals-amount', (req, res) => {
  const query = `
    SELECT SUM(amount) AS totalAmount
    FROM transactions
    WHERE category IN ('Saving', 'Safe Lock');
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total amount:', err);
      return res.status(500).json({ message: 'Error fetching total amount', error: err });
    }

    // Return the total amount of the Savings and Safe Lock categories
    const totalAmount = results[0]?.totalAmount || 0;
    res.json({ totalAmount });
  });
});


// API route to get total amount excluding Savings and Safe Lock categories
app.get('/api/transactions/total', (req, res) => {
  const query = `
    SELECT SUM(amount) AS totalAmount
    FROM transactions
    WHERE category NOT IN ('Saving', 'Safe Lock');
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching total amount:', err);
      return res.status(500).json({ message: 'Error fetching total amount', error: err });
    }

    // Return the total amount of transactions excluding Savings and Safe Lock
    const totalAmount = results[0]?.totalAmount || 0;
    res.json({ totalAmount });
  });
});

// Get sum of each individual category (savings, safe lock, etc.)
app.get('/api/transactions/category-sums', (req, res) => {
  const query = `
    SELECT category, SUM(amount) AS total_amount
    FROM transactions
    GROUP BY category;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching category sums', error: err });
    }

    res.json(results);  // Returns an array of categories and their total amounts
  });
});





// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

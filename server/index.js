const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
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

// Handle transactions (updated to accept new fields)
app.post('/api/transactions', (req, res) => {
  const { category, amount, description, status, date, accountNumber, bank, randomName, phoneNumber, biller } = req.body;

  // Ensure all required fields are provided
  if (!category || !amount || !description || !status || !date) {
    return res.status(400).json({ status: 'Failed', message: "Missing required fields" });
  }

  const query = `
    INSERT INTO transactions (category, amount, description, status, date, accountNumber, bank, randomName, phoneNumber, biller)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query(query, [category, amount, description, status, date, accountNumber, bank, randomName, phoneNumber, biller], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).json({ status: 'Failed', message: 'Error adding transaction', error: err });
    }

    res.status(201).json({ status: 'Successful', message: 'Transaction added successfully' });
  });
});

// Get all transactions (no change here)
app.get('/api/transactions', (req, res) => {
  pool.query('SELECT * FROM transactions', (err, results) => {
    if (err) {
      console.error('Error retrieving transactions:', err);
      return res.status(500).json({ status: 'Failed', message: 'Error retrieving transactions', error: err });
    }

    res.status(200).json({ status: 'Successful', transactions: results });
  });
});

// Example: Get transactions with specific category (e.g., 'Savings' or 'Safe Lock')
app.get('/api/transactions/savings-safelock', (req, res) => {
  const query = "SELECT * FROM transactions WHERE category IN ('Saving', 'Safe Lock')";

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', message: 'Error fetching transactions', error: err });
    }

    res.status(200).json({ status: 'Successful', transactions: results });
  });
});

// Get total amount for Savings and Safe Lock categories
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

    const totalAmount = results[0]?.totalAmount || 0;
    res.json({ totalAmount });
  });
});

// Get total amount excluding Savings and Safe Lock categories
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

    res.json(results);
  });
});


app.get('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM transactions WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', message: 'Error fetching transaction', error: err });
    }
    res.status(200).json({ status: 'Successful', transaction: results[0] });
  });
});

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


// Start a cron job that runs every minute (you can adjust the interval as needed)
cron.schedule('* * * * *', () => {
  console.log('Running cron job to check safelocks status update...');
  
  // Check for any safelocks where the releaseDate has passed and status is still 'Locked'
  const query = `UPDATE safelocks
                 SET status = 'Unlocked'
                 WHERE status = 'Locked' AND releaseDate <= NOW()`;

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error updating safelocks status:', err);
    } else {
      console.log(`Safelocks status updated for ${result.affectedRows} record(s).`);
    }
  });
});

// Create a route to handle Safe Lock creation (existing API)
app.post('/api/safelocks', (req, res) => {
  const { description, amount, releaseDate, status } = req.body;

  const query = `
    INSERT INTO safelocks (description, amount, releaseDate, status)
    VALUES (?, ?, ?, ?)
  `;

  pool.query(query, [description, amount, releaseDate, status], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    res.status(200).json({ status: 'Successful', message: 'Safe Lock Created' });
  });
});



app.get('/api/safelock2', (req, res) => {
  pool.query('SELECT * FROM safelocks', (err, results) => {
    if (err) {
      console.error('Error retrieving transactions:', err);
      return res.status(500).json({ status: 'Failed', message: 'Error retrieving transactions', error: err });
    }

    res.status(200).json({ status: 'Successful', transactions: results });
  });
});

app.get('/api/safelocks2/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM safelocks WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'Failed', message: 'Error fetching transaction', error: err });
    }
    if (results.length > 0) {
      res.status(200).json({ status: 'Successful', safelock: results[0] }); // Change "transaction" to "safelock"
    } else {
      res.status(404).json({ status: 'Failed', message: 'Safelock not found' });
    }
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

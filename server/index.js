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

// Sign Up API
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Validate the input
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert user into the database
  const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  pool.query(query, [firstName, lastName, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Email is already in Use' });
    }

    res.status(200).json({ message: 'User created successfully' });
  });
});



// Sign In API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  pool.query(query, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send the user's first name and last name in the response
    res.status(200).json({
      message: 'Login successful',
      firstName: result[0].first_name,
      lastName: result[0].last_name,
    });
  });
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
// app.get('/api/transactions/category-sums', (req, res) => {
//   const query = `
//     SELECT category, SUM(amount) AS total_amount
//     FROM transactions
//     GROUP BY category;
//   `;

//   pool.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching category sums', error: err });
//     }

//     res.json(results);
//   });
// });

// Endpoint to fetch category sums, including Safe Lock
app.get('/api/transactions/category-sums', (req, res) => {
  // Query to get sums of all categories, including Safe Lock
  const query = `
    SELECT category, SUM(amount) as total_amount
    FROM (
      SELECT 'Food' as category, amount FROM transactions WHERE category = 'Food'
      UNION ALL
      SELECT 'Transport', amount FROM transactions WHERE category = 'Transport'
      UNION ALL
      SELECT 'Data', amount FROM transactions WHERE category = 'Data'
      UNION ALL
      SELECT 'Saving', amount FROM transactions WHERE category = 'Saving'
      UNION ALL
      SELECT 'Safe Lock', amount FROM safelocks
    ) as categories
    GROUP BY category;
  `;
  
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Send the result as a response
    res.json(result);
  });
});


app.get('/api/transactions/category-counts', (req, res) => {
  // Query to get counts of all categories, including Safe Lock
  const query = `
    SELECT category, COUNT(*) as total_count
    FROM (
      SELECT 'Food' as category FROM transactions WHERE category = 'Food'
      UNION ALL
      SELECT 'Transport' FROM transactions WHERE category = 'Transport'
      UNION ALL
      SELECT 'Data' FROM transactions WHERE category = 'Data'
      UNION ALL
      SELECT 'Saving' FROM transactions WHERE category = 'Saving'
      UNION ALL
      SELECT 'Clothing' FROM transactions WHERE category = 'Clothing'
      UNION ALL
      SELECT 'Safe Lock' FROM safelocks
    ) as categories
    GROUP BY category;
  `;
  
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Send the result as a response
    res.json(result);
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

// Endpoint to get the count of locked safelocks
app.get('/api/safelocks/locked-count', (req, res) => {
  // Query to count the number of locked safelocks
  const query = `
    SELECT COUNT(*) as locked_count
    FROM safelocks
    WHERE status = 'Locked';
  `;
  
  pool.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Return the count of locked safelocks
    res.json({
      locked_count: result[0].locked_count
    });
  });
});

// Middleware to parse JSON requests
app.use(express.json());


// Get transactions by date range and category summaries (count and total amount)
app.get('/api/transactions/date-range', (req, res) => {
  const { startDate, endDate } = req.query;

  // Validate input dates
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Both startDate and endDate are required' });
  }

  // Query to get transactions within the selected date range
  const transactionsQuery = `
    SELECT * 
    FROM transactions
    WHERE date BETWEEN ? AND ?
  `;

  // Query to get the count and total amount for each category in the date range
  const categorySumsQuery = `
    SELECT category, COUNT(*) AS total_count, SUM(amount) AS total_amount
    FROM transactions
    WHERE date BETWEEN ? AND ?
    GROUP BY category
  `;

  // Execute both queries in parallel
  pool.query(transactionsQuery, [startDate, endDate], (err, transactions) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ message: 'Error fetching transactions', error: err });
    }

    pool.query(categorySumsQuery, [startDate, endDate], (err, categorySums) => {
      if (err) {
        console.error('Error fetching category sums:', err);
        return res.status(500).json({ message: 'Error fetching category sums', error: err });
      }

      // Return both the transaction list and the category sums
      res.status(200).json({
        status: 'Successful',
        transactions,
        categorySums
      });
    });
  });
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

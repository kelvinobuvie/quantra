import React, { useState } from 'react';
import axios from 'axios';

const SafeLockForm = ({ balance, deductBalance }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [alert, setAlert] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure amount, description, and releaseDate are provided
    if (!amount || !description || parseInt(amount) <= 0 || !releaseDate) {
      setAlert({ type: 'error', message: 'Please enter valid amount, description, and release date.' });
      return;
    }

    // Check if the entered amount is greater than the available balance
    if (parseInt(amount) > balance) {
      setAlert({ type: 'error', message: 'Transaction Failed: Insufficient Balance' });
      return;
    }

    // Create the new Safe Lock transaction object
    const newSafeLock = {
      description,
      amount: parseInt(amount),
      releaseDate,
      status: 'Locked',  // Set initial status to Locked
    };

    // Send the POST request to the Safe Lock API
    axios.post('http://localhost:5000/api/safelocks', newSafeLock)
      .then((res) => {
        if (res.data.status === 'Successful') {
          setAlert({ type: 'success', message: 'Safe Lock Created Successfully!' });

          // Update the balance by calling the updateBalance function
          deductBalance(parseInt(amount)); // Subtract the amount from the balance

          // Optionally, you can redirect the user or perform further actions
        } else {
          setAlert({ type: 'error', message: 'Failed to create Safe Lock' });
        }

        // Reset form fields
        setAmount('');
        setDescription('');
        setReleaseDate('');
      })
      .catch((err) => {
        console.error('Error:', err);
        setAlert({ type: 'error', message: 'Internal Server Error' });
      });
  };

  return (
    <div className="lg:ml-56 px-4">
      <h2 className="text-md font-bold mb-4 text-green-700" >Safe Lock</h2>

      {/* Displaying Alerts */}
      {alert && (
        <div className={`mb-4 p-4 rounded border ${alert.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      {/* Display Balance */}
      <div  className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
        <h3 className="text-xl font-bold">Available Balance: {balance}</h3>
      </div>

      {/* Safe Lock Form */}
      <form onSubmit={handleSubmit}  className="mb-5 grid gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            required
             className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            required
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Release Date</label>
          <input
            type="datetime-local"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
             className="border rounded p-2"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 font-semibold">
          Lock Funds
        </button>
      </form>
    </div>
  );
};

export default SafeLockForm;

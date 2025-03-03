import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Balance from './Balance';

// Function to generate a random name
const generateRandomName = () => {
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Chris Lee', 'Sarah Brown', 'David Wilson', 'Jessica Harris', 'James Clark', 'Laura Lewis'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const TransactionForm = ({ balance, updateBalance }) => {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState(null); // For showing success or error alerts
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('Opay');
  const [randomName, setRandomName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [biller, setBiller] = useState('Airtel');
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle bank change and generate random name
  const handleBankChange = (e) => {
    setBank(e.target.value);
    // Generate a random name when a bank is selected
    const generatedName = generateRandomName();
    setRandomName(generatedName);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the amount is less than or equal to the available balance
    if (parseInt(amount) > balance) {
      setAlert({ type: 'error', message: 'Transaction Failed: Insufficient Balance' });
      return;  // Exit if balance is insufficient
    }

    // Get current date in 'YYYY-MM-DD HH:MM' format
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 16).replace('T', ' '); // Removing seconds

    // Create the new transaction object
    const newTransaction = {
      category,
      amount: parseInt(amount),
      description,
      status: 'Successful',
      date: formattedDate, // Correct date format for MySQL
      accountNumber,
      bank,
      randomName,
      phoneNumber,
      biller,
    };

    // Send the POST request to the backend
    axios.post('http://localhost:5000/api/transactions', newTransaction)
      .then((res) => {
        // Log the response to see what the backend returns
        console.log('Backend Response:', res);

        // If the response status is successful
        if (res.data.status === 'Successful') {
          // Update the balance by calling the updateBalance function passed from App.js
          updateBalance(parseInt(amount));

          setAlert({ type: 'success', message: 'Transaction Successful!' });

          // Redirect to the wallet page after successful transaction
          setTimeout(() => {
            navigate('/wallet');  // Redirect to the wallet page
          }, 1500); // Delay to give the user time to see the success alert
        } else {
          setAlert({ type: 'error', message: 'Transaction Failed' });
        }

        // Reset form fields
        setCategory('Food');
        setAmount('');
        setDescription('');
        setAccountNumber('');
        setBank('Opay');
        setRandomName('');
        setPhoneNumber('');
        setBiller('Airtel');
      })
      .catch((err) => {
        // Log the error
        console.error('Error:', err);

        // Display error alert
        setAlert({ type: 'error', message: 'Transaction Failed: Internal Server Error' });
      });
  };

  return (
    <div className="lg:ml-56 px-4">
      <h1 className="text-md font-bold mb-4 text-green-700">New Transaction</h1>

      {/* Displaying Alerts */}
      {alert && (
        <div className={`mb-4 p-4 rounded border ${alert.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      {/* Balance Component */}
      <div className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
        <h2 className="text-xl font-bold">Balance</h2>
        <Balance balance={balance} />
      </div>

      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-5 grid gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Transaction Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Food">Food</option>
            <option value="Data">Data</option>
            <option value="Transport">Transport</option>
            <option value="Saving">Savings</option>
            <option value="Safe Lock">Safe Lock</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Description</label>
          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded p-2"
          />
        </div>

        {/* Conditional Fields */}
        {category === 'Food' || category === 'Transport' || category === 'Saving' || category === 'Safe Lock' ? (
          <>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Account Number</label>
              <input
                type="text"
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Select Bank</label>
              <select
                value={bank}
                onChange={handleBankChange}  /* Update on bank change */
                className="border rounded p-2"
              >
                <option value="Opay">Opay</option>
                <option value="FirstBank">FirstBank</option>
                <option value="GTBank">GTBank</option>
                <option value="Zenith">Zenith</option>
                <option value="AccessBank">AccessBank</option>
                <option value="UnionBank">UnionBank</option>
                <option value="UBA">UBA</option>
                <option value="SterlingBank">SterlingBank</option>
                <option value="Fidelity">Fidelity</option>
                <option value="EcoBank">EcoBank</option>
              </select>
            </div>

            {randomName && (
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Account Name</label>
                <input
                  type="text"
                  value={randomName}
                  readOnly
                  className="border rounded p-2 bg-gray-100"
                />
              </div>
            )}
          </>
        ) : category === 'Data' ? (
          <>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Select Biller</label>
              <select
                value={biller}
                onChange={(e) => setBiller(e.target.value)}
                className="border rounded p-2"
              >
                <option value="Airtel">Airtel</option>
                <option value="MTN">MTN</option>
                <option value="Glo">Glo</option>
              </select>
            </div>
          </>
        ) : null}

        <div className="grid md:grid-cols-2 gap-5">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 font-semibold"
          >
            Submit Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

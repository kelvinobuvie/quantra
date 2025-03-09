import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Balance from './Balance';

// Function to generate a random name
const generateRandomName = () => {
  const names = ['Chijioke Okafor', 'Ngozi Adebayo', 'Oluwaseun Adedeji', 'Chinonso Eze', 'Ifeanyi Nwosu', 'Mojisola Adeyemi', 'Kelechi Obinna', 'Ngozi Uche', 'Chuka Nwachukwu', 'Tosin Olamide'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const TransactionForm = ({ balance, deductBalance }) => {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('Opay');
  const [randomName, setRandomName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [biller, setBiller] = useState('Airtel');
  const [loading, setLoading] = useState(false);  // Loader state
  const navigate = useNavigate();

  // Handle bank change and generate random name
  const handleBankChange = (e) => {
    setBank(e.target.value);
    const generatedName = generateRandomName();
    setRandomName(generatedName);
  };

  // Handle category change and redirect to SafeLockForm if "Safe Lock" is selected
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (selectedCategory === 'Safe Lock') {
      navigate('/safe-lock-form');
    }
  };

  // Handle form submission for other categories (non-Safe Lock)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the amount is less than or equal to the available balance
    if (parseInt(amount) > balance) {
      setAlert({ type: 'error', message: 'Transaction Failed: Insufficient Balance' });
      return;
    }

    setLoading(true); // Set loading to true when submitting

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');

    const newTransaction = {
      category,
      amount: parseInt(amount),
      description,
      status: 'Successful',
      date: formattedDate,
      accountNumber,
      bank,
      randomName,
      phoneNumber,
      biller,
    };

    // Send the POST request to the backend
    axios.post('http://localhost:5000/api/transactions', newTransaction)
      .then((res) => {
        setTimeout(() => {
          if (res.data.status === 'Successful') {
            deductBalance(parseInt(amount));  // Deduct from balance after successful transaction

            setAlert({ type: 'success', message: 'Transaction Successful!' });

            setTimeout(() => {
              navigate('/wallet');
            }, 1500);
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
          setLoading(false);  // Set loading to false after 3 seconds
        }, 3000);  // Delay the alert for 3 seconds
      })
      .catch((err) => {
        console.error('Error:', err);
        setAlert({ type: 'error', message: 'Transaction Failed: Internal Server Error' });
        setLoading(false);  // Set loading to false in case of an error
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
            onChange={handleCategoryChange}
            className="border rounded p-2"
          >
            <option value="Food">Food</option>
            <option value="Data">Data</option>
            <option value="Transport">Transport</option>
            <option value="Clothing">Clothing</option>
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
        {category !== 'Data' && category !== 'Safe Lock' && (
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
                onChange={handleBankChange}
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
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 font-semibold"
            disabled={loading}  // Disable the button when loading
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>  // Spinner for the button
            ) : (
              'Submit Transaction'
            )}
          </button>
        </div>
      </form>

      {/* Display loader when loading is true */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-950 rounded-full animate-spin"></div> 
        </div>
      )}
    </div>
  );
};

export default TransactionForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoalTable = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState({
    date: 'desc',
    amount: 'desc',
  });
  const [receipt, setReceipt] = useState(null);  // To store the selected receipt details
  const [showReceiptModal, setShowReceiptModal] = useState(false);  // To control visibility of the modal

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions/savings-safelock')
      .then((response) => {
        setTransactions(response.data.transactions);
        setFilteredTransactions(response.data.transactions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((tx) => tx.category === category);
      setFilteredTransactions(filtered);
    }
  };

  const handleDateSort = () => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder.date === 'desc' ? dateB - dateA : dateA - dateB;
    });
    setFilteredTransactions(sorted);
    setSortOrder((prevState) => ({
      ...prevState,
      date: prevState.date === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleAmountSort = () => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      return sortOrder.amount === 'desc'
        ? b.amount - a.amount
        : a.amount - b.amount;
    });
    setFilteredTransactions(sorted);
    setSortOrder((prevState) => ({
      ...prevState,
      amount: prevState.amount === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleViewReceipt = (transactionId) => {
    axios
      .get(`http://localhost:5000/api/transactions/${transactionId}`)
      .then((response) => {
        setReceipt(response.data.transaction); // Store the selected transaction details
        setShowReceiptModal(true); // Open the receipt modal
      })
      .catch((error) => {
        console.error('Error fetching transaction details:', error);
      });
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false); // Close the receipt modal
    setReceipt(null); // Clear the receipt details
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const categories = ['Saving', 'Safe Lock'];

  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
      <div className="flex justify-between py-4 px-4">
        <span className="text-sm font-semibold text-blue-950">Transactions</span>
        <a
          onClick={() => navigate('/transaction-history')}
          className="text-xs text-orange-500 font-medium inline-block hover:underline viewall"
        >
          View all
        </a>
      </div>

      {/* Category filter dropdown */}
      <div className="mb-4">
        <label
          htmlFor="category-select"
          className="block text-sm font-semibold text-blue-950 mb-2"
        >
          Filter by Category
        </label>
        <select
          id="category-select"
          className="p-2 border border-gray-300 rounded-lg w-full text-xs font-light text-blue-950"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category, index) => (
            <option className="font-medium text-xs text-blue-950" key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white border-collapse">
        <thead className="text-gray-500 text-xs">
          <tr>
            <th className="border-b py-4 px-1 text-left">Id</th>
            <th
              className="border-b py-4 px-1 text-left cursor-pointer"
              onClick={handleDateSort}
            >
              Date {sortOrder.date === 'desc' ? '↓' : '↑'}
            </th>
            <th className="border-b py-4 px-1 text-left">Category</th>
            <th className="border-b py-4 px-1 text-left">Description</th>
            <th
              className="border-b py-4 px-1 text-left cursor-pointer"
              onClick={handleAmountSort}
            >
              Amount {sortOrder.amount === 'desc' ? '↓' : '↑'}
            </th>
            <th className="border-b py-4 px-1 text-left">Status</th>
            <th className="border-b py-4 px-1 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredTransactions.map((tx, index) => (
            <tr key={index} className="text-left bg-blue-100">
              <td className="border-b py-4 px-1 text-blue-950">QUANTRA0{tx.id}</td>
              <td className="border-b py-4 px-1 text-blue-950">{tx.date}</td>
              <td className="border-b py-4 px-1 text-blue-950">{tx.category}</td>
              <td className="border-b py-4 px-1 text-blue-950">{tx.description}</td>
              <td className="border-b py-4 px-1 text-blue-950">
                ₦{tx.amount.toLocaleString()}
              </td>
              <td
                className={`border-b py-4 px-1 text-blue-950 ${
                  tx.status === 'Successful' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {tx.status}
              </td>
              <td className="border-b  text-blue-950">
                <button
                  className="text-xs font-bold text-white py-2 px-2 rounded-lg bg-orange-500 hover:bg-orange-900"
                  onClick={() => handleViewReceipt(tx.id)}
                >
                  View Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Receipt Modal */}
      {showReceiptModal && receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold text-blue-950 mb-4">Transaction Receipt</h3>
            <div className="mb-2">
              <strong>Transaction ID:</strong> QUANTRA0{receipt.id}
            </div>
            <div className="mb-2">
              <strong>Date:</strong> {receipt.date}
            </div>
            <div className="mb-2">
              <strong>Category:</strong> {receipt.category}
            </div>
            <div className="mb-2">
              <strong>Description:</strong> {receipt.description}
            </div>
            <div className="mb-2">
              <strong>Amount:</strong> ₦{receipt.amount.toLocaleString()}
            </div>
            <div className="mb-2">
              <strong>Status:</strong>{' '}
              <span className={receipt.status === 'Successful' ? 'text-green-500' : 'text-red-500'}>
                {receipt.status}
              </span>
            </div>
            <div className="mb-2">
              <strong>Account Number:</strong> {receipt.accountNumber}
            </div>
            <div className="mb-2">
              <strong>Bank:</strong> {receipt.bank}
            </div>
            <div className="mb-2">
              <strong>Account Name:</strong> {receipt.randomName}
            </div>
            <div className="mb-2">
              <strong>Phone Number:</strong> {receipt.phoneNumber}
            </div>
            <div className="mb-2">
              <strong>Biller:</strong> {receipt.biller}
            </div>
            <button
              onClick={closeReceiptModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTable;

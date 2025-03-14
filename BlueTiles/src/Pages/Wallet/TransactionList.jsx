import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const TransactionList = () => {
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
  
  // Date range filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions')
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

  // Handle category change
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    applyFilters(category, startDate, endDate);
  };

  // Apply filters based on selected category, startDate, and endDate
  const applyFilters = (category, start, end) => {
    let filtered = [...transactions];

    // Filter by category
    if (category && category !== 'All') {
      filtered = filtered.filter((tx) => tx.category === category);
    }

    // Filter by date range
    if (start && end) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return txDate >= startDate && txDate <= endDate;
      });
    }

    setFilteredTransactions(filtered);
  };

  // Handle date sorting
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

  // Handle amount sorting
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

  // Handle viewing the receipt
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

  // Close the receipt modal
  const closeReceiptModal = () => {
    setShowReceiptModal(false); // Close the receipt modal
    setReceipt(null); // Clear the receipt details
  };

  // Handle date range change
  const handleDateRangeChange = () => {
    applyFilters(selectedCategory, startDate, endDate);
  };

  // Function to generate PDF for the filtered transactions
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.setFontSize(18);
    doc.text('Transaction History', 20, 20);

    // Column headers
    doc.setFontSize(8);
    doc.text('Transaction ID', 20, 40);
    doc.text('Date', 60, 40);
    doc.text('Category', 100, 40);
    doc.text('Description', 140, 40);
    doc.text('Amount', 180, 40);
    doc.text('Status', 220, 40);

    // Set line height
    let lineHeight = 50;

    // Add transaction rows to the PDF
    filteredTransactions.forEach((tx, index) => {
      doc.text(`QUANTRA0${tx.id}`, 20, lineHeight);
      doc.text(new Date(tx.date).toLocaleDateString(), 60, lineHeight);
      doc.text(tx.category, 100, lineHeight);
      doc.text(tx.description, 140, lineHeight);
      doc.text(`₦${tx.amount.toLocaleString()}`, 180, lineHeight);
      doc.text(tx.status, 220, lineHeight);
      lineHeight += 10;
    });

    // Save the PDF
    doc.save('transaction-history.pdf');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const categories = ['All', 'Food', 'Transport', 'Data', 'Saving', 'Safe Lock'];

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

      {/* Date range filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-blue-950 mb-2">
          Filter by Date Range
        </label>
        <div className="flex space-x-4">
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-lg text-xs font-light text-blue-950"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-lg text-xs font-light text-blue-950"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleDateRangeChange}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Apply Range
          </button>
        </div>
      </div>

      {/* PDF Download Button */}
      <div className="mb-4">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Download PDF
        </button>
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
              <td className="border-b py-4 px-1 text-blue-950">{new Date(tx.date).toLocaleDateString()}</td>
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

export default TransactionList;

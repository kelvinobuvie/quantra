import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { useNavigate } from 'react-router-dom';


const TransactionList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle error state
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to show all categories
  const [sortOrder, setSortOrder] = useState({
    date: 'desc',  // 'desc' for descending, 'asc' for ascending
    amount: 'desc'  // 'desc' for descending, 'asc' for ascending
  });

  useEffect(() => {
    // Fetch transactions from the backend
    axios.get('http://localhost:5000/api/transactions')
      .then(response => {
        setTransactions(response.data.transactions);  // Set the data from the API response
        setFilteredTransactions(response.data.transactions);  // Initially show all transactions
        setLoading(false);  // Stop the loading spinner
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
        setLoading(false);  // Stop the loading spinner
      });
  }, []); // Empty dependency array to run only once when the component is mounted

  // Handle category selection
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    // Filter transactions based on the selected category
    if (category === 'All') {
      setFilteredTransactions(transactions);  // Show all transactions if "All" is selected
    } else {
      const filtered = transactions.filter(tx => tx.category === category);  // Filter by category
      setFilteredTransactions(filtered);
    }
  };

  // Handle sorting by date
  const handleDateSort = () => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder.date === 'desc' ? dateB - dateA : dateA - dateB;
    });
    setFilteredTransactions(sorted);
    setSortOrder(prevState => ({
      ...prevState,
      date: prevState.date === 'desc' ? 'asc' : 'desc',  // Toggle sorting order
    }));
  };

  // Handle sorting by amount
  const handleAmountSort = () => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      return sortOrder.amount === 'desc'
        ? b.amount - a.amount  // Sort from largest to smallest
        : a.amount - b.amount; // Sort from smallest to largest
    });
    setFilteredTransactions(sorted);
    setSortOrder(prevState => ({
      ...prevState,
      amount: prevState.amount === 'desc' ? 'asc' : 'desc',  // Toggle sorting order
    }));
  };

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message while the data is being fetched
  }

  if (error) {
    return <div>{error}</div>;  // Display the error message if something went wrong
  }

  const categories = ['All', 'Food', 'Transport', 'Data', 'Saving', 'Safe Lock'];  // Define your categories here

  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
      <div className='flex justify-between py-4 px-4'>
        <span className='text-sm font-semibold text-blue-950'>Transactions</span>
        <a onClick={() => navigate('/transaction-history')}className="text-xs text-orange-500 font-medium inline-block hover:underline">View all</a>
      </div>

      {/* Category filter dropdown */}
      <div className="mb-4">
        <label htmlFor="category-select" className="block text-sm font-semibold text-blue-950 mb-2">Filter by Category</label>
        <select
          id="category-select"
          className="p-2 border border-gray-300 rounded-lg w-full"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white border-collapse">
        <thead className='text-gray-500 text-xs'>
          <tr>
            <th className="border-b p-4 text-left">Id</th>
            <th
              className="border-b p-4 text-left cursor-pointer"
              onClick={handleDateSort}
            >
              Date {sortOrder.date === 'desc' ? '↓' : '↑'}
            </th>
            <th className="border-b p-4 text-left">Category</th>
            <th className="border-b p-4 text-left">Description</th>
            <th
              className="border-b p-4 text-left cursor-pointer"
              onClick={handleAmountSort}
            >
              Amount {sortOrder.amount === 'desc' ? '↓' : '↑'}
            </th>
            <th className="border-b p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {filteredTransactions.map((tx, index) => (
            <tr key={index} className="text-left bg-blue-100">
              <td className="border-b p-4 m-8 text-blue-950">{tx.id}</td>
              <td className="border-b p-4 text-blue-950">{tx.date}</td>
              <td className="border-b p-4 text-blue-950">{tx.category}</td>
              <td className="border-b p-4 text-blue-950">{tx.description}</td>
              <td className="border-b p-4 text-blue-950">₦{tx.amount.toLocaleString()}</td>
              <td className={`border-b p-4 text-blue-950 ${tx.status === 'Successful' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

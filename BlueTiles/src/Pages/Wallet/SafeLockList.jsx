import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../../component/Nav';
import Balance from '../../Pages/Wallet/Balance';

const SafeLockList = ({ balance, addBalance }) => {
  const navigate = useNavigate();
  const [safelocks, setSafelocks] = useState([]);
  const [filteredSafelocks, setFilteredSafelocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // New state to filter by status

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/safelock2')
      .then((response) => {
        const safelocksData = response.data.transactions;
        // Sort the safelocks by createdAt (latest to least)
        const sortedSafelocks = safelocksData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSafelocks(sortedSafelocks);
        setFilteredSafelocks(sortedSafelocks);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching safelocks:', error);
        setError('Failed to load safelocks');
        setLoading(false);
      });
  }, []);

  // Handle filtering by status
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === '') {
      setFilteredSafelocks(safelocks); // Show all if no status filter is applied
    } else {
      setFilteredSafelocks(safelocks.filter((safelock) => safelock.status === status));
    }
  };

  const handleShowReceipt = (safelock) => {
    setReceipt(safelock);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setReceipt(null);
  };

  const handleAddToBalance = () => {
    if (receipt && receipt.amount) {
      addBalance(receipt.amount); // Add the Safe Lock amount to the balance
      closeReceiptModal();
    }
  };

  return (
    <div className="lg:ml-56 px-4">
      <Nav title={"Safe Lock"} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Display Balance */}
          <div className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
            <h2 className="text-xl font-bold">Balance</h2>
            <Balance balance={balance} />
          </div>

          {/* New Safe Lock Button */}
          <div className="flex gap-5">
            <button
              className="bg-orange-500 text-white font-bold px-4 py-2 hover:bg-orange-700 mb-4"
              onClick={() => navigate('/safe-lock-form')}
            >
              New Safe Lock
            </button>
          </div>

          {/* Filter by Status */}
          <div className="mb-4">
            <label htmlFor="statusFilter" className="block text-sm font-semibold text-blue-950 mb-2">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full text-xs font-light text-blue-950"
            >
              <option value="" className="font-medium text-xs text-blue-950">All</option>
              <option value="Locked" className="font-medium text-xs text-blue-950">Locked</option>
              <option value="Unlocked" className="font-medium text-xs text-blue-950">Unlocked</option>
            </select>
          </div>

          <p className="text-sm font-semibold text-blue-950">Safe Lock Transactions</p>
          <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead className="text-gray-500 text-xs">
                <tr>
                  <th className="border-b py-4 px-1 text-left">ID</th>
                  <th className="border-b py-4 px-1 text-left">Date</th>
                  <th className="border-b py-4 px-1 text-left">Amount</th>
                  <th className="border-b py-4 px-1 text-left">Status</th>
                  <th className="border-b py-4 px-1 text-left">Release Date</th>
                  <th className="border-b py-4 px-1 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredSafelocks.map((safelock) => (
                  <tr key={safelock.id}>
                    <td className="border-b py-4 px-1 text-blue-950">{`QUANTRA0${safelock.id}`}</td>
                    <td className="border-b py-4 px-1 text-blue-950">{new Date(safelock.date).toLocaleDateString()}</td>
                    <td className="border-b py-4 px-1 text-blue-950">₦{safelock.amount}</td>
                    <td
                      className={`border-b py-4 px-1 text-blue-950 ${
                        safelock.status === 'Unlocked' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {safelock.status}
                    </td>
                    <td className="border-b py-4 px-1 text-blue-950">
                      {new Date(safelock.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="border-b py-4 px-1 text-blue-950">
                      <button
                        onClick={() => handleShowReceipt(safelock)}
                        className="text-xs font-bold text-white py-2 px-2 rounded-lg bg-orange-500 hover:bg-orange-900"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safe Lock Receipt Modal */}
          {showReceiptModal && receipt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="text-lg font-bold text-blue-950 mb-4">Safe Lock Receipt</h3>
                <div className="mb-2">
                  <strong>Safe Lock ID:</strong> QUANTRA0{receipt.id}
                </div>
                <div className="mb-2">
                  <strong>Release Date:</strong> {new Date(receipt.releaseDate).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <strong>Description:</strong> {receipt.description}
                </div>
                <div className="mb-2">
                  <strong>Amount:</strong> ₦{receipt.amount.toLocaleString()}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{' '}
                  <span className={receipt.status === 'Unlocked' ? 'text-green-500' : 'text-red-500'}>
                    {receipt.status}
                  </span>
                </div>
                <button
                  onClick={closeReceiptModal}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>

                {/* Add to balance button */}
                {receipt.status === 'Unlocked' && (
                  <button
                    onClick={handleAddToBalance}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Amount to Balance
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SafeLockList;

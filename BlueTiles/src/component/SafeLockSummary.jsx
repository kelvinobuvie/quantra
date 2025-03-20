import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const SafeLockSummary = ({ balance, addBalance }) => {
  const navigate = useNavigate();
  const [safelocks, setSafelocks] = useState([]);
  const [filteredSafelocks, setFilteredSafelocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/safelock2')
      .then((response) => {
        const safelocksData = response.data.transactions;
        const sortedSafelocks = safelocksData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
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

  // Handle filtering by status and date range
  const applyFilters = (status, start, end) => {
    let filtered = [...safelocks];

    // Filter by status
    if (status) {
      filtered = filtered.filter((safelock) => safelock.status === status);
    }

    // Filter by date range
    if (start && end) {
      filtered = filtered.filter((safelock) => {
        const safelockDate = new Date(safelock.date);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return safelockDate >= startDate && safelockDate <= endDate;
      });
    }

    setFilteredSafelocks(filtered);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    applyFilters(status, startDate, endDate);
  };

  const handleDateRangeChange = () => {
    applyFilters(statusFilter, startDate, endDate);
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

  // Function to generate PDF for the filtered safelocks
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.setFontSize(18);
    doc.text('Safe Lock History', 20, 20);

    // Column headers
    doc.setFontSize(8);
    doc.text('Safe Lock ID', 20, 40);
    doc.text('Date', 60, 40);
    doc.text('Amount', 100, 40);
    doc.text('Status', 140, 40);
    doc.text('Release Date', 180, 40);

    // Set line height
    let lineHeight = 50;

    // Add safelock rows to the PDF
    filteredSafelocks.forEach((safelock) => {
      doc.text(`QUANTRA0${safelock.id}`, 20, lineHeight);
      doc.text(new Date(safelock.date).toLocaleDateString(), 60, lineHeight);
      doc.text(`₦${safelock.amount.toLocaleString()}`, 100, lineHeight);
      doc.text(safelock.status, 140, lineHeight);
      doc.text(new Date(safelock.releaseDate).toLocaleDateString(), 180, lineHeight);
      lineHeight += 10;
    });

    // Save the PDF
    doc.save('safe-lock-history.pdf');
  };

  return (
    <div className="">

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>

          {/* Filter by Status */}
          <div className="mb-4">
            <label htmlFor="statusFilter" className="block text-sm font-semibold text-blue-950 mb-2">
              Filter by Status:
            </label>
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

          {/* Date Range Picker */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-blue-950 mb-2">Filter by Date Range</label>
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
              Download Statement
            </button>
          </div>

          <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead className="text-gray-500 text-xs">
                <tr>
                  <th className="border-b py-4 px-1 text-left">ID</th>
                  <th className="border-b py-4 px-1 text-left">Date</th>
                  <th className="border-b py-4 px-1 text-left">Amount</th>
                  <th className="border-b py-4 px-1 text-left">Status</th>
                  <th className="border-b py-4 px-1 text-left">Release Date</th>
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

export default SafeLockSummary;

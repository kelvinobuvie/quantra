import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatementPage = () => {
  const { state } = useLocation();
  const { statementData } = state || {}; // initial data for the statement
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Fetch data based on selected date range
  const fetchData = async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(`/api/transactions/date-range?startDate=${startDate}&endDate=${endDate}`);
        const data = response.data;
        
        // Update transactions and chart data
        setTransactions(data.transactions);

        // Prepare Bar Chart data
        const categoryCounts = {};
        data.transactions.forEach((tx) => {
          categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1;
        });
        
        setBarChartData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              label: 'Transactions by Category',
              data: Object.values(categoryCounts),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        });

        // Prepare Pie Chart data
        setPieChartData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              data: Object.values(categoryCounts),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#C70039', '#900C3F'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    }
  };

  // Effect hook to fetch data when startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-blue-950 mb-4">Transaction Statement</h2>
      
      {/* Date Range Filter */}
      <div className="mb-4">
        <label htmlFor="startDate" className="mr-2">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <label htmlFor="endDate" className="mr-2 ml-4">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Filter Data
        </button>
      </div>

      {/* Charts */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <h3 className="text-md font-medium text-blue-950 mb-2">Transactions by Category (Bar Chart)</h3>
          <Bar data={barChartData} />
        </div>
        <div className="w-1/2">
          <h3 className="text-md font-medium text-blue-950 mb-2">Transactions by Category (Pie Chart)</h3>
          <Pie data={pieChartData} />
        </div>
      </div>

      {/* List of Transactions */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-blue-950 mb-2">Transaction List</h3>
        <table className="min-w-full bg-white border-collapse">
          <thead className="text-gray-500 text-xs">
            <tr>
              <th className="border-b py-4 px-1 text-left">Id</th>
              <th className="border-b py-4 px-1 text-left">Date</th>
              <th className="border-b py-4 px-1 text-left">Category</th>
              <th className="border-b py-4 px-1 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.map((tx, index) => (
              <tr key={index} className="text-left bg-blue-100">
                <td className="border-b py-4 px-1 text-blue-950">QUANTRA0{tx.id}</td>
                <td className="border-b py-4 px-1 text-blue-950">{tx.date}</td>
                <td className="border-b py-4 px-1 text-blue-950">{tx.category}</td>
                <td className="border-b py-4 px-1 text-blue-950">
                  ₦{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatementPage;

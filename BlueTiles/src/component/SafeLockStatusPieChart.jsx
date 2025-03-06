import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2'; // Import Pie and Bar chart components
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for ChartJS
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const SafeLockStatusChart = () => {
  const [safeLockCounts, setSafeLockCounts] = useState({ locked: 0, unlocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie'); // Default to Pie chart

  // Fetch the data for Safe Lock transactions
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/safelock2')  // Modify with your API URL
      .then((response) => {
        const safelocks = response.data.transactions;
        // Count the number of locked and unlocked safelocks
        const lockedCount = safelocks.filter((safelock) => safelock.status === 'Locked').length;
        const unlockedCount = safelocks.filter((safelock) => safelock.status === 'Unlocked').length;

        setSafeLockCounts({ locked: lockedCount, unlocked: unlockedCount });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching safelocks:', error);
        setError('Failed to load safelocks');
        setLoading(false);
      });
  }, []);

  // Data for Pie chart
  const pieChartData = {
    labels: ['Locked', 'Unlocked'],
    datasets: [
      {
        data: [safeLockCounts.locked, safeLockCounts.unlocked],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderColor: ['#FF6384', '#36A2EB'],
        borderWidth: 1,
      },
    ],
  };

  // Data for Bar chart
  const barChartData = {
    labels: ['Locked', 'Unlocked'],
    datasets: [
      {
        label: 'Safe Lock Count',
        data: [safeLockCounts.locked, safeLockCounts.unlocked],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderColor: ['#FF6384', '#36A2EB'],
        borderWidth: 1,
      },
    ],
  };

  // Options for Pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + ' Safe Locks';
          },
        },
      },
    },
  };

  // Options for Bar chart
  const barChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + ' Safe Locks'; // Format the y-axis label
          },
        },
      },
    },
  };

  // Handle chart type change
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);  // Set the selected chart type
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold mb-1 pt-1 text-gray-400 text-center">Safe Lock Status Distribution</h2>

      {/* Chart Type Switcher */}
      <div className="mb-1 text-center">
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="bg-blue-500 text-sm font-light text-white px-2 py-1 rounded"
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="w-full">
          {/* Conditionally render Pie or Bar chart based on selected chart type */}
          {chartType === 'pie' ? (
            <Pie data={pieChartData} options={pieChartOptions} />
          ) : (
            <Bar data={barChartData} options={barChartOptions} />
          )}
        </div>
      )}
    </div>
  );
};

export default SafeLockStatusChart;

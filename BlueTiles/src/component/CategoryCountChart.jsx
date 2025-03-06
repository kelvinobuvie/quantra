import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import Bar and Pie chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const CategoryCountChart = () => {
  const [categoryCounts, setCategoryCounts] = useState([]);  // State to hold the fetched category counts
  const [loading, setLoading] = useState(true);  // Loading state
  const [chartType, setChartType] = useState('pie');  // State to toggle between bar and pie chart
  const [error, setError] = useState(null);  // Error handling state

  // Fetch category counts data from the API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions/category-counts')  // Replace with your actual API URL
      .then((response) => {
        setCategoryCounts(response.data);  // Store the data in state
        setLoading(false);  // Stop loading when data is fetched
      })
      .catch((error) => {
        setError('Failed to load category counts');  // Set error message if API call fails
        setLoading(false);  // Stop loading even if there’s an error
      });
  }, []);

  // Prepare chart data based on fetched category counts
  const chartData = {
    labels: categoryCounts.map(item => item.category),  // Categories as chart labels
    datasets: [
      {
        label: 'Transaction Count by Category',
        data: categoryCounts.map(item => item.total_count),  // Transaction counts
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],  // Colors for the Pie chart segments
        borderColor: '#fff',  // Border color for each segment
        borderWidth: 1,  // Border width
      }
    ]
  };

  // Chart options for the Bar chart
  const barChartOptions = {
    responsive: true,
    indexAxis: 'y',  // Set the index axis to 'y' for horizontal bars
    scales: {
      x: {
        beginAtZero: true,  // Ensure the x-axis starts from 0 (for horizontal bars this is the length of each bar)
        ticks: {
          callback: function(value) {
            return value.toLocaleString();  // Format the number with commas
          }
        }
      },
      y: {
        beginAtZero: true,  // Ensure the y-axis starts from 0
      }
    },
  };

  // Chart options for the Pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',  // Legend position at the top
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} Transactions`;  // Custom tooltip message
          }
        }
      }
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);  // Set the selected chart type
  };

  // Render loading message, error message, or chart based on the state
  return (
    <div className="p-4 justify-center items-center">
      <h2 className="text-sm pt-1 mb-1 font-semibold text-gray-400 text-center">Transaction Count by Category</h2>

      {/* Select input to choose chart type */}
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
        <p>Loading...</p>  // Show loading message while fetching data
      ) : error ? (
        <p>{error}</p>  // Show error message if the API call fails
      ) : (
        // Conditionally render Bar or Pie chart based on the selected chart type
        chartType === 'bar' ? (
          <div style={{ maxWidth: '100%', maxHeight: '400px' }}>
            <Bar data={chartData} options={barChartOptions} />
          </div>
        ) : (
          <div style={{ maxWidth: '100%', maxHeight: '400px' }}>
            <Pie data={chartData} options={pieChartOptions} />
          </div>
        )
      )}
    </div>
  );
};

export default CategoryCountChart;

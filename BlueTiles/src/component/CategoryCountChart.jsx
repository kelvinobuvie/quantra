import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import Bar and Pie chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const CategoryCountChart = () => {
  const [categoryCounts2, setCategoryCounts2] = useState([]);  // State to hold the fetched category counts
  const [loading3, setLoading3] = useState(true);  // Loading state
  const [chartType3, setChartType3] = useState('pie');  // State to toggle between bar and pie chart
  const [error3, setError3] = useState(null);  // Error handling state

  // Fetch category counts data from the API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions/category-counts')  // Replace with your actual API URL
      .then((response) => {
        setCategoryCounts2(response.data);  // Store the data in state
        setLoading3(false);  // Stop loading when data is fetched
      })
      .catch((error) => {
        setError3('Failed to load category counts');  // Set error message if API call fails
        setLoading3(false);  // Stop loading even if there’s an error
      });
  }, []);

  // Prepare chart data based on fetched category counts
  const chartData3 = {
    labels: categoryCounts2.map(item => item.category),  // Categories as chart labels
    datasets: [
      {
        label: 'Transaction Count by Category',
        data: categoryCounts2.map(item => item.total_count),  // Transaction counts
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],  // Colors for the Pie chart segments
        borderColor: '#fff',  // Border color for each segment
        borderWidth: 1,  // Border width
      }
    ]
  };

  // Chart options for the Bar chart
  const barChartOptions3 = {
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
  const pieChartOptions3 = {
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
  const handleChartTypeChange3 = (event) => {
    setChartType3(event.target.value);  // Set the selected chart type
  };

  // Render loading message, error message, or chart based on the state
  return (
    <div className="p-4 justify-center items-center">
      <h2 className="text-sm pt-1 mb-1 font-semibold text-gray-400 text-center">Transaction Count by Category</h2>

      {/* Select input to choose chart type */}
      <div className="mb-1 text-center">
        <select
          value={chartType3}
          onChange={handleChartTypeChange3}
          className="bg-blue-500 text-sm font-light text-white px-2 py-1 rounded"
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {loading3 ? (
        <p>Loading...</p>  // Show loading message while fetching data
      ) : error3 ? (
        <p>{error3}</p>  // Show error message if the API call fails
      ) : (
        // Conditionally render Bar or Pie chart based on the selected chart type
        chartType3 === 'bar' ? (
          <div style={{ maxWidth: '100%', maxHeight: '400px' }}>
            <Bar data={chartData3} options={barChartOptions3} />
          </div>
        ) : (
          <div style={{ maxWidth: '100%', maxHeight: '400px' }}>
            <Pie data={chartData3} options={pieChartOptions3} />
          </div>
        )
      )}
    </div>
  );
};

export default CategoryCountChart;

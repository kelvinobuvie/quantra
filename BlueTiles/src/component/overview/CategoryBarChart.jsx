import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CategoryBarChart = () => {
  const [categorySums, setCategorySums] = useState([]);  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // Loading state

  // Custom color mapping for each category
  const categoryColors = {
    Food: 'rgba(239,68,68)', // Redish
    Transport: 'rgba(30,64,175)', // Blueish
    Data: 'rgba(234,179,8)', // Yellowish
    Saving: 'rgba(22,163,74)', // Greenish
    'Safe Lock': 'rgba(168,85,247)' // Purpleish
  };

  // Fetch category sums from backend
  useEffect(() => {
    const fetchCategorySums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions/category-sums');
        setCategorySums(response.data);  // Set data from backend
        setLoading(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching category sums:', error);
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchCategorySums();
  }, []);

  // Data for the horizontal bar chart
  const chartData = {
    labels: categorySums.map(item => item.category),  // Categories as labels
    datasets: [
      {
        label: 'Total Amount per Category',
        data: categorySums.map(item => item.total_amount),  // Total amounts for each category
        backgroundColor: categorySums.map(item => categoryColors[item.category] || 'rgba(255, 159, 64, 0.6)'),  // Apply custom colors
        borderColor: categorySums.map(item => categoryColors[item.category] || 'rgba(255, 159, 64, 1)'),  // Border colors
        borderWidth: 1,
      }
    ]
  };

  // Chart options for horizontal bars
  const chartOptions = {
    responsive: true,
    indexAxis: 'y',  // Set the index axis to 'y' for horizontal bars
    scales: {
      x: {
        beginAtZero: true,  // Ensure the x-axis starts from 0 (for horizontal bars this is the length of each bar)
        ticks: {
          callback: function(value) {
            return '₦' + value.toLocaleString();  // Format the amount in currency
          }
        }
      },
      y: {
        beginAtZero: true,  // Ensure the y-axis starts from 0
      }
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-md font-semibold mb-4 text-gray-400">Total Amount per Category</h2>

      {loading ? (
        <p>Loading...</p>  // Show loading message while fetching
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default CategoryBarChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const CategoryBarChart2 = () => {
  const [categorySums, setCategorySums] = useState([]);  // State to hold the fetched data
  const [loading2, setLoading2] = useState(true);  // Loading state
  const [chartType1, setChartType1] = useState('bar'); // State to toggle between bar and pie chart

  // Custom color mapping for each category
  const categoryColors = {
    Food: 'rgba(239,68,68)', // Redish
    Transport: 'rgba(30,64,175)', // Blueish
    Data: 'rgba(234,179,8)', // Yellowish
    Saving: 'rgba(22,163,74)', // Greenish
    'Safe Lock': 'rgba(168,85,247)', // Purpleish
    Clothing: 'rgba(56,189,248)' // Add a new color for Clothing (light blue)
  };

  // Fetch category sums from backend
  useEffect(() => {
    const fetchCategorySums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions/category-sums');
        setCategorySums(response.data);  // Set data from backend
        setLoading2(false);  // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching category sums:', error);
        setLoading2(false);  // Stop loading in case of error
      }
    };

    fetchCategorySums();
  }, []);

  // Data for the chart (both Bar and Pie)
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

  // Chart options for the bar chart
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

  // Handle chart type change
  const handleChartTypeChange1 = (event) => {
    setChartType1(event.target.value);  // Set the selected chart type
  };

  return (
    <div className="p-4 flex justify-center items-center ">
      
      <div > {/* This div will be 50% of the available width */}
        <h2 className="text-sm font-semibold mb-1 pt-1 text-gray-400 text-center">Total Amount per Category</h2>

        {/* Select input to choose chart type */}
        <div className="mb-1 text-center">
          <select 
            value={chartType1} 
            onChange={handleChartTypeChange1} 
            className="bg-blue-500 font-light text-sm text-white px-2 py-1 rounded"
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>

          </select>
        </div>

        {loading2 ? (
          <p className="text-center">Loading...</p>  // Show loading message while fetching
        ) : (
          // Conditionally render Bar or Pie chart based on the selected chart type
          chartType1 === 'pie' ? (
            <div > {/* Set a max height */}
              <Bar data={chartData} />
            </div>
          ) : (
            <div > {/* Set a max height */}
              <Pie data={chartData} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryBarChart2;

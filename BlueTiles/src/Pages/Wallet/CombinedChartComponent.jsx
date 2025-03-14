import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation

// Register necessary components for ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const CombinedChartComponent = () => {
  // States for data, loading, error handling
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [categorySums, setCategorySums] = useState([]);
  const [safeLockCounts, setSafeLockCounts] = useState({ locked: 0, unlocked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie'); // Default to Pie chart
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Date range filter handler
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') setStartDate(value);
    if (name === 'endDate') setEndDate(value);
  };

  // Fetch data for all three charts based on the selected date range
  useEffect(() => {
    if (startDate && endDate) {
      setLoading(true);
      // Fetch category counts
      axios
        .get(`http://localhost:5000/api/transactions/category-counts`, { params: { startDate, endDate } })
        .then((response) => {
          setCategoryCounts(response.data);
        })
        .catch((error) => {
          setError('Failed to load category counts');
        });
      
      // Fetch category sums
      axios
        .get(`http://localhost:5000/api/transactions/category-sums`, { params: { startDate, endDate } })
        .then((response) => {
          setCategorySums(response.data);
        })
        .catch((error) => {
          setError('Failed to load category sums');
        });

      // Fetch safe lock counts
      axios
        .get(`http://localhost:5000/api/safelock2`, { params: { startDate, endDate } })
        .then((response) => {
          const safelocks = response.data.transactions;
          const lockedCount = safelocks.filter((safelock) => safelock.status === 'Locked').length;
          const unlockedCount = safelocks.filter((safelock) => safelock.status === 'Unlocked').length;
          setSafeLockCounts({ locked: lockedCount, unlocked: unlockedCount });
        })
        .catch((error) => {
          setError('Failed to load safelocks');
        })
        .finally(() => setLoading(false));
    }
  }, [startDate, endDate]);

  // Chart Data for Transaction Category Count
  const categoryCountChartData = {
    labels: categoryCounts.map(item => item.category),
    datasets: [
      {
        label: 'Transaction Count by Category',
        data: categoryCounts.map(item => item.total_count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#F7464A'],
        borderColor: '#fff',
        borderWidth: 1,
      }
    ]
  };

  // Chart Data for Category Sums (Total Amount)
  const categorySumChartData = {
    labels: categorySums.map(item => item.category),
    datasets: [
      {
        label: 'Total Amount per Category',
        data: categorySums.map(item => item.total_amount),
        backgroundColor: categorySums.map(item => item.category === 'Food' ? '#FF6384' : '#36A2EB'),
        borderColor: '#fff',
        borderWidth: 1,
      }
    ]
  };

  // Chart Data for Safe Lock Status
  const safeLockChartData = {
    labels: ['Locked', 'Unlocked'],
    datasets: [
      {
        data: [safeLockCounts.locked, safeLockCounts.unlocked],
        backgroundColor: ['#FF6384', '#36A2EB'],
        borderColor: ['#FF6384', '#36A2EB'],
        borderWidth: 1,
      }
    ]
  };

  // Handle chart type change
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Charts for Selected Date Range', 14, 10);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 15);

    // Add Category Count Chart
    doc.addPage();
    doc.text('Transaction Count by Category', 14, 10);
    // You can use html2canvas to render chart as image and then add to PDF if needed

    // Download chart as image
    doc.addImage(categoryCountChartData, 'JPEG', 14, 30, 180, 100);

    // Add Category Sums Chart
    doc.addPage();
    doc.text('Total Amount per Category', 14, 10);
    doc.addImage(categorySumChartData, 'JPEG', 14, 30, 180, 100);

    // Add Safe Lock Status Chart
    doc.addPage();
    doc.text('Safe Lock Status Distribution', 14, 10);
    doc.addImage(safeLockChartData, 'JPEG', 14, 30, 180, 100);

    doc.save('charts.pdf');
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold mb-1 pt-1 text-gray-400 text-center">Combined Charts</h2>

      {/* Date Range Filter */}
      <div className="mb-4 text-center">
        <input 
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleDateChange}
          className="mr-2"
        />
        <input 
          type="date"
          name="endDate"
          value={endDate}
          onChange={handleDateChange}
          className="mr-2"
        />
      </div>

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

      {/* Loading or Error State */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Transaction Category Count Chart */}
          <div className="chart-container">
            <h3 className="text-center">Transaction Count by Category</h3>
            {chartType === 'pie' ? (
              <Pie data={categoryCountChartData} />
            ) : (
              <Bar data={categoryCountChartData} />
            )}
          </div>

          {/* Category Sums Chart */}
          <div className="chart-container">
            <h3 className="text-center">Total Amount per Category</h3>
            {chartType === 'pie' ? (
              <Pie data={categorySumChartData} />
            ) : (
              <Bar data={categorySumChartData} />
            )}
          </div>

          {/* Safe Lock Status Chart */}
          <div className="chart-container">
            <h3 className="text-center">Safe Lock Status Distribution</h3>
            {chartType === 'pie' ? (
              <Pie data={safeLockChartData} />
            ) : (
              <Bar data={safeLockChartData} />
            )}
          </div>
        </div>
      )}

      {/* Download PDF Button */}
      <div className="text-center mt-4">
        <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CombinedChartComponent;

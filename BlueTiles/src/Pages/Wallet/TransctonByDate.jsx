import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const TransactionsByDate = () => {
  const { date } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch transactions based on selected date (from params)
    fetch(`http://localhost:5000/api/transactions/date/:date${date}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  }, [date]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Transactions for ${date}`, 14, 20);
    doc.autoTable({
      head: [['Id', 'Date', 'Category', 'Amount']],
      body: transactions.map((tx) => [
        `QUANTRA0${tx.id}`,
        tx.date,
        tx.category,
        `₦${tx.amount.toLocaleString()}`,
      ]),
    });
    doc.save(`transactions_${date}.pdf`);
  };

  // Pie chart data
  const pieData = {
    labels: ['Food', 'Transport', 'Data', 'Saving', 'Safe Lock'],
    datasets: [
      {
        data: transactions.reduce((acc, tx) => {
          const idx = acc.findIndex((cat) => cat.name === tx.category);
          if (idx === -1) {
            acc.push({ name: tx.category, amount: tx.amount });
          } else {
            acc[idx].amount += tx.amount;
          }
          return acc;
        }, []).map((cat) => cat.amount),
        backgroundColor: ['#FF9999', '#66B3FF', '#99FF99', '#FFCC99', '#FF6666'],
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Download PDF
        </button>
      </div>

      {/* Charts */}
      <div className="flex justify-between">
        <Pie data={pieData} width={400} height={400} />
      </div>

      {/* Transactions List */}
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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="border-b py-4 px-1">{`QUANTRA0${tx.id}`}</td>
              <td className="border-b py-4 px-1">{tx.date}</td>
              <td className="border-b py-4 px-1">{tx.category}</td>
              <td className="border-b py-4 px-1">₦{tx.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsByDate;

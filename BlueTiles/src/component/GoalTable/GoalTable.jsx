import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { useNavigate } from 'react-router-dom';



const GoalTable = () => {
    const navigate = useNavigate();
   const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);  // To handle loading state
    const [error, setError] = useState(null);  // To handle error state

  useEffect(() => {
    // Fetch transactions from the backend
    axios.get('http://localhost:5000/api/transactions/savings-safelock')
      .then(response => {
        setTransactions(response.data.transactions);  // Set the data from the API response
        setLoading(false);  // Stop the loading spinner
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions');
        setLoading(false);  // Stop the loading spinner
      });
  }, []); // Empty dependency array to run only once when the component is mounted

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message while the data is being fetched
  }

  if (error) {
    return <div>{error}</div>;  // Display the error message if something went wrong
  }

  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
       <div className='flex justify-between  py-4 px-4'>
            <span className='text-sm font-semibold text-blue-950'>Targets</span>
            <a onClick={() => navigate('/transaction-history')} className="text-xs text-orange-500 font-medium inline-block hover:underline viewall">View all</a>
        </div>
        <table className="min-w-full bg-white border-collapse">
        <thead className='text-gray-500 text-xs'>
          <tr>
            <th className="border-b p-4 text-left">Id</th>
            <th className="border-b p-4 text-left">Date</th>
            <th className="border-b p-4 text-left">Category</th>
            <th className="border-b p-4 text-left">Description</th>
            <th className="border-b p-4 text-left">Amount</th>
            <th className="border-b p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {transactions.map((tx, index) => (
            <tr key={index} className="text-left bg-blue-100">
              <td className="border-b p-4 m-8 text-blue-950">QUANTRA0{tx.id}</td>
              <td className="border-b p-4 text-blue-950">{tx.date}</td>
              <td className="border-b p-4 text-blue-950">{tx.category}</td>
              <td className="border-b p-4 text-blue-950">{tx.description}</td>
              <td className="border-b p-4 text-blue-950">₦{tx.amount.toLocaleString()}</td>
              <td className={`border-b p-4 text-blue-950 ${tx.status === 'Successful' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GoalTable;

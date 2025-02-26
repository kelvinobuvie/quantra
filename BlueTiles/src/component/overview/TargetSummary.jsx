import React, { useEffect, useState } from 'react';
import { TbTargetArrow } from "react-icons/tb";
import axios from 'axios'; // Make sure axios is installed
// import { useNavigate } from 'react-router-dom';
// import useGoalNamesAndStatus from '../Hooks/useGoalNamesAndStatus';

const TargetSummary = () => {
  // const navigate = useNavigate();
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
    <div>
      <ul className="list-none pl-0 Target-List">
        {transactions.map((tx, index) => (
          <li key={index} className="flex justify-between mb-1 Target-List mx-4 py-3 border-b-2">
            <div className="w-7 h-7">
              <TbTargetArrow className="inline-block w-6 h-6 mr-3 text-red-500" />
            </div>
            <span className="flex-grow text-sm font-semibold text-gray-600">{tx.description}</span>
            <a href="/targets" className="text-sm text-blue-950 hover:underline">
              {tx.status}
            </a>
          </li>
        ))}
      </ul>   
    </div>
  );
};

export default TargetSummary;

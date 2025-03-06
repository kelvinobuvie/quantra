import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionList from './Wallet/TransactionList';
// import GoalTable from '../component/GoalTable/GoalTable';
// import CategoryBarChart from '../component/overview/CategoryBarChart';
import CategoryBarChart2 from '../component/overview/CategoryBarChart2';
import SafeLockStatusPieChart from '../component/SafeLockStatusPieChart';
import CategoryCountChart from '../component/CategorycountChart';
import SafeLockSummary from '../component/SafeLockSummary';
import Nav from '../component/Nav';
// import CategoryCountChart from '../component/CategoryCountChart';

// import TransactionList from './TransactionList';

const TransactionHistory = () => {
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch goals and transactions when the component loads
  useEffect(() => {
    // Fetching goals
    axios.get('http://localhost:5000/api/goals')
      .then(res => setGoals(res.data))
      .catch(err => console.error(err));

    // Fetching transactions
    axios.get('http://localhost:5000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="lg:ml-56 px-4">
    <Nav title={"Analysis and History"}/>
    <div className='p-4 bg-white rounded-lg shadow-md mt-4 mb-4'>
      <h2 className='font-medium text-xl text-orange-500  underline'>Analysis</h2>
      {/* Grid container with 2 equal columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First chart */}
        <div className="flex justify-center items-center">
          <SafeLockStatusPieChart />
        </div>

        {/* Second chart */}
        <div className="flex justify-center items-center">
          <CategoryBarChart2 />
        </div>

        {/* Third chart */}
        <div className="flex justify-center items-center">
          <CategoryCountChart />
        </div>
      </div>
      </div>
      <h1 className="text-xl font-semibold text-orange-500 mb-4 underline">Transaction History</h1>

      {/* GoalTable Component */}
      <SafeLockSummary/>

      {/* TransactionList Component */}
      <TransactionList transactions={transactions} />


    </div>
  );
};

export default TransactionHistory;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionList from './Wallet/TransactionList';
import GoalTable from '../component/GoalTable/GoalTable';
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
      <h1 className="text-xl font-semibold text-blue-950 mb-4">Transaction History</h1>

      {/* GoalTable Component */}
      <GoalTable goals={goals} />

      {/* TransactionList Component */}
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default TransactionHistory;

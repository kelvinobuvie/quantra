import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TransactionList from './TransactionList';
import { useNavigate } from 'react-router-dom';
import Balance from './Balance';
import Nav from '../../component/Nav';

const Wallet = ({ balance }) => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // Fetch transactions on component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="lg:ml-56 px-4">
      <Nav title={"Wallet"} />

      
      {/* Balance Component */}
      <div className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
        <h2 className="text-xl font-bold">Balance</h2>
        <Balance balance={balance} />
      </div>

      {/* New Transaction Button */}
      <div className='flex gap-5'>
        <button 
          className="bg-blue-800 text-white font-bold px-4 py-2 hover:bg-blue-950 mb-4"
          onClick={() => navigate('/new-transaction')}
        >
          New Transaction
        </button>
        <button 
          className="bg-orange-500 text-white font-bold px-4 py-2 hover:bg-orange-700 mb-4"
          onClick={() => navigate('/safe-lock-list')}
        >
          View Locks
        </button>
      </div>

      {/* Transaction List */}
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Wallet;

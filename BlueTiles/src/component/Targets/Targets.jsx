import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Balance from '../../Pages/Wallet/Balance';
// import TransactionList from '../../Pages/Wallet/TransactionList';
import Nav from '../Nav';
import GoalTable from '../GoalTable/GoalTable';


const Targets = ({ balance }) => {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  // Fetch transactions on component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/goals')
      .then(res => setGoals(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="lg:ml-56 px-4">
      <Nav title={"Targets & SafeLock"} />
 
      
      <div className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
        <h2 className="text-xl font-bold">Balance</h2>
        <Balance balance={balance} />
      </div>

      {/* New Transaction Button */}
      <div className='flex gap-5'>
        <button 
          className="bg-orange-500 text-white font-bold px-4 py-2 hover:bg-orange-700 mb-4"
          onClick={() => navigate('/new-target')}
        >
          New Traget
        </button>
      </div>

      {/* Transaction List */}
      <GoalTable goals={goals} />
    </div>
  );
};

export default Targets;

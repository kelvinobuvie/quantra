import React, { useState } from 'react';
import "./App.css";
import Login from './Pages/Login';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Overview from './Pages/Overview/Overview';
import SideBar from './component/SideBar';
import GoalForm from './component/Targets/GoalForm';
import Wallet from './Pages/Wallet/Wallet';
import TransactionForm from './Pages/Wallet/TransactionForm';
import Targets from './component/Targets/Targets';
import TransactionHistory from './Pages/TransactionHistory';

import SafeLockForm from './Pages/Wallet/SafeLockForm';
import SafeLockList from './Pages/Wallet/SafeLockList';

const App = () => {
  // Centralized Balance State
  const [balance, setBalance] = useState(200000);

  // Function to update balance by adding amount
  const addBalance = (amount) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  // Function to update balance by deducting amount
  const deductBalance = (amount) => {
    setBalance(prevBalance => prevBalance - amount);
  };

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />

        {/* Main Layout */}
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Navigate to='login' />} />
          <Route path='overview' element={<Overview balance={balance} />} />
          <Route path='new-target' element={<GoalForm />} />
          <Route path="/safe-lock-form" element={<SafeLockForm balance={balance}  deductBalance={deductBalance} />} />
          <Route path='wallet' element={<Wallet balance={balance} />} />
          <Route path='targets' element={<Targets balance={balance} />} />
          <Route path='new-transaction' element={<TransactionForm balance={balance} deductBalance={deductBalance} />} />
          <Route path='transaction-history' element={<TransactionHistory />} />
        
          <Route path='safe-lock-list' element={<SafeLockList addBalance={addBalance} balance={balance} />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Layout Component for Main App
const MainLayout = () => {
  return (
    <div className='flex'>
      <SideBar />
      <div className='flex-grow p-4'>
        <Outlet />
      </div>
    </div>
  );
};

export default App;

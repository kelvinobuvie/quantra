import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../../component/Nav'
import OverviewCards from '../../component/overview/OverviewCards'
// import SavingsExpenseChart from '../../component/overview/CategoryBarChart';
import DashboardUpdate from '../../component/overview/TargetSummary';
// import RecentTransactions from '../../component/overview/RecentTransactions';
import SetNewTargetBtn from '../../component/overview/SetNewTargetBtn';
import TransactionList from '../Wallet/TransactionList';
import TransactionHistory from '../TransactionHistory';
import CategoryBarChart from '../../component/overview/CategoryBarChart';



const data = [
  { month: 'January', savings: 50000, expenses: 30000 },
  { month: 'February', savings: 70000, expenses: 40000 },
  { month: 'March', savings: 60000, expenses: 45000 },
  { month: 'April', savings: 60000, expenses: 45000 },
  { month: 'May', savings: 60000, expenses: 45000 },


  // Add more data as needed
];

const Overview = ({ balance }) => {
    const [transactions, setTransactions] = useState([]);
    // Fetch transactions on component load
    useEffect(() => {
      axios.get('http://localhost:5000/api/transactions')
        .then(res => setTransactions(res.data))
        .catch(err => console.error(err));
    }, []);
  return (
    <div className='lg:ml-56 px-4'>
        <Nav title={"Dashboard"}/>
        <div className='container'>
          <div className="grid lg:flex justify-between">
            <div>
              <p className="font-normal text-2xl wel-t text-blue-950">Welcome to <span className="font-bold text-orange-500">quantra</span></p>
              <p className="mt-3 text-sm font-normal wel-b text-gray-700">Take a look at your and take a look a your tagrts, expenses and Transactions</p>
            </div>
            <div className="mt-6">
              <SetNewTargetBtn/>
          </div>
          </div>
            <div>
              <OverviewCards balance={balance}  />
            </div>
            <div className='lg:flex mt-6 gap-5'>
              <div className='py-2 px-8 w-full border-2 rounded-lg max-lg:hidden'>
                <h1 className='font-medium text-lg text-gray-700 '>Financial Overview</h1>
                <CategoryBarChart />
              </div>
              <div className='w-full bg-white border border-gray-300 rounded-md shadow-sm flex flex-col h-96 overflow-y-auto'>
                <div className='flex justify-between px-4 py-4 font-medium bg-white'>
                  <span className='text-gray-700 text-lg'>Targets & Goals</span>
                  <span className='text-orange-500'>See all</span>
                </div>
                <DashboardUpdate/>
              </div>
            </div>
            <div className='mt-6 h-64 overflow-hidden'>
              <TransactionList transactions={transactions} />
            </div>
        </div>
    </div>
    
  )
}

export default Overview
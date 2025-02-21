import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../component/Nav';
import Balance from './Balance';

const TransactionForm = ({ balance, updateBalance }) => {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const navigate = useNavigate();

  // Fetch goals on component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/goals')
      .then(res => setGoals(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle Form Submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Check for sufficient balance
  //   if (parseInt(amount) > balance) {
  //     // Transaction fails due to insufficient balance
  //     setAlert({ message: 'Transaction Failed: Insufficient Balance', type: 'error' });

  //     const failedTransaction = {
  //       category,
  //       amount: parseInt(amount),
  //       description,
  //       date: new Date().toLocaleDateString(),
  //       status: 'Failed', // Store as failed transaction
  //       goal: selectedGoal ? selectedGoal : null,
  //     };

  //     // Store the failed transaction
  //     axios.post('http://localhost:5000/api/transactions', failedTransaction)
  //       .catch(err => console.error(err));

  //     // Set a timer to clear alert and navigate to wallet after 3 seconds
  //     setTimeout(() => {
  //       setAlert({ message: '', type: '' }); // Clear alert
  //       navigate('/wallet'); // Navigate to wallet
  //     }, 3000);

  //     return;
  //   }

  //   const newTransaction = {
  //     category,
  //     amount: parseInt(amount),
  //     description,
  //     date: new Date().toLocaleDateString(),
  //     status: 'Successfull',
  //     goal: selectedGoal ? selectedGoal : null, // Attach goal to the transaction if selected
  //   };

  //   axios.post('http://localhost:5000/api/transactions', newTransaction)
  //     .then(res => {
  //       if (res.data.status === 'Successfull') {
  //         setAlert({ message: 'Transaction Successful', type: 'success' });
  //         updateBalance(parseInt(amount)); // Update balance on success

  //         // If transaction is on a Saving/Safe Lock goal, update the goal's savedAmount
  //         if (selectedGoal) {
  //           const updatedGoals = goals.map(goal => {
  //             if (goal.name === selectedGoal) {
  //               goal.savedAmount += parseInt(amount);
  //               // Check if goal is completed
  //               if (goal.savedAmount >= goal.amount) {
  //                 goal.status = 'Successfull';
  //               }
  //             }
  //             return goal;
  //           });
  //           setGoals(updatedGoals);
  //         }
  //       } else {
  //         setAlert({ message: 'Transaction Failed', type: 'error' });
  //       }

  //       // Set a timer to clear alert and navigate to wallet after 3 seconds
  //       setTimeout(() => {
  //         setAlert({ message: '', type: '' }); // Clear alert
  //         navigate('/wallet'); // Navigate to wallet
  //       }, 3000);
  //     })
  //     .catch(err => {
  //       setAlert({ message: 'Transaction Failed: Internal Server Error', type: 'error' });

  //       // Store the failed transaction on error
  //       const failedTransaction = {
  //         category,
  //         amount: parseInt(amount),
  //         description,
  //         date: new Date().toLocaleDateString(),
  //         status: 'Failed', // Store as failed transaction
  //         goal: selectedGoal ? selectedGoal : null,
  //       };

  //       axios.post('http://localhost:5000/api/transactions', failedTransaction)
  //         .catch(err => console.error(err));

  //       // Set a timer to clear alert and navigate to wallet after 3 seconds
  //       setTimeout(() => {
  //         setAlert({ message: '', type: '' }); // Clear alert
  //         navigate('/wallet'); // Navigate to wallet
  //       }, 3000);
  //     });

  //   // Reset Form
  //   setCategory('Food');
  //   setAmount('');
  //   setDescription('');
  //   setSelectedGoal('');
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check for sufficient balance
    if (parseInt(amount) > balance) {
      // Transaction fails due to insufficient balance
      setAlert({ message: 'Transaction Failed: Insufficient Balance', type: 'error' });
  
      const failedTransaction = {
        category,
        amount: parseInt(amount),
        description,
        date: new Date().toLocaleDateString(),
        status: 'Failed', // Store as failed transaction
        goal: selectedGoal ? selectedGoal : null,
      };
  
      // Store the failed transaction
      axios.post('http://localhost:5000/api/transactions', failedTransaction)
        .catch(err => console.error(err));
  
      // Set a timer to clear alert and navigate to wallet after 3 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' }); // Clear alert
        navigate('/wallet'); // Navigate to wallet
      }, 3000);
  
      return;
    }
  
    const newTransaction = {
      category,
      amount: parseInt(amount),
      description,
      date: new Date().toLocaleDateString(),
      status: 'Successfull',
      goal: selectedGoal ? selectedGoal : null, // Attach goal to the transaction if selected
    };
  
    axios.post('http://localhost:5000/api/transactions', newTransaction)
      .then(res => {
        if (res.data.status === 'Successfull') {
          setAlert({ message: 'Transaction Successful', type: 'success' });
          updateBalance(parseInt(amount)); // Update balance on success
        } else {
          setAlert({ message: 'Transaction Failed', type: 'error' });
        }
  
        // Set a timer to clear alert and navigate to wallet after 3 seconds
        setTimeout(() => {
          setAlert({ message: '', type: '' }); // Clear alert
          navigate('/wallet'); // Navigate to wallet
        }, 3000);
      })
      .catch(err => {
        setAlert({ message: 'Transaction Failed: Internal Server Error', type: 'error' });
  
        // Store the failed transaction on error
        const failedTransaction = {
          category,
          amount: parseInt(amount),
          description,
          date: new Date().toLocaleDateString(),
          status: 'Failed', // Store as failed transaction
          goal: selectedGoal ? selectedGoal : null,
        };
  
        axios.post('http://localhost:5000/api/transactions', failedTransaction)
          .catch(err => console.error(err));
  
        // Set a timer to clear alert and navigate to wallet after 3 seconds
        setTimeout(() => {
          setAlert({ message: '', type: '' }); // Clear alert
          navigate('/wallet'); // Navigate to wallet
        }, 3000);
      });
  
    // Reset Form
    setCategory('Food');
    setAmount('');
    setDescription('');
    setSelectedGoal('');
  };
  
  return (
    <div className="lg:ml-56 px-4">
      <Nav title={"Transactions"} />
      <h1 className="text-md font-bold mb-4 px-16 text-green-700">New Transaction</h1>

      {/* Alert Display */}
      {alert.message && (
        <div className={`mb-4 p-4 rounded border 
          ${alert.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' 
            : 'bg-red-100 border-red-400 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      <div className="mb-4 p-4 bg-gray-100 border rounded shadow-md">
        <h2 className="text-xl font-bold">Balance</h2>

        <Balance balance={balance} />
      </div>

      <form onSubmit={handleSubmit} className="mb-5 grid gap-3 px-16">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Transaction Type</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Food">Food</option>
            <option value="Data">Data</option>
            <option value="Transport">Transport</option>
            <option value="Saving">Savings</option>
            <option value="Safe Lock">Safe Lock</option>
          </select>
        </div>

        {/* Goal selection for Saving and Safe Lock */}
        {(category === 'Saving' || category === 'Safe Lock') && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Goal</label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">-- Select Goal --</option>
              {goals.filter(goal => goal.goalType === category).map(goal => (
                <option key={goal.name} value={goal.name}>{goal.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border rounded p-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Description</label>
          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded p-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <button
            type="submit"
            className="bg-blue-800 text-white rounded px-4 py-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

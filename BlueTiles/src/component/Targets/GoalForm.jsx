import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import GoalTable from '../GoalTable/GoalTable';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const GoalForm = () => {
  const [goal, setGoal] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [goalType, setGoalType] = useState('Saving');
  const [amount, setAmount] = useState('');
  const [goals, setGoals] = useState([]);
  const [balance, setBalance] = useState(10000); // Default balance
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

  // Fetch goals and balance on component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/goals')
      .then(res => setGoals(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/balance')
      .then(res => setBalance(res.data.balance))
      .catch(err => console.error(err));
  }, []);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation to ensure sufficient balance for Saving or Safe Lock goals
    if (parseInt(amount) > balance && (goalType === 'Saving' || goalType === 'Safe Lock')) {
      alert("Insufficient balance for this goal!");
      return;
    }

    const newGoal = {
      name: goal,
      completionDate,
      goalType,
      amount,
      savedAmount: 0, // New field to track saved progress
      status: 'Ongoing',
    };

    axios.post('http://localhost:5000/api/goals', newGoal)
      .then(res => {
        setGoals([...goals, res.data]);
        setGoal('');
        setCompletionDate('');
        setAmount('');
        setGoalType('Saving');

        // Update balance if Saving or Safe Lock
        if (goalType === 'Savings' || goalType === 'Safe Lock') {
          axios.post('http://localhost:5000/api/transactions', {
            category: goalType,
            amount: parseInt(amount),
            description: `Goal for ${goal}`,
            date: new Date().toLocaleDateString(),
            status: 'Completed'
          })
          .then(() => {
            setBalance(balance - parseInt(amount)); // Update the balance after transaction
          })
          .catch(err => console.error(err));
        }

        // Show success alert
        setShowAlert(true);
        
        // Hide alert after 2 seconds and navigate to /targets
        setTimeout(() => {
          setShowAlert(false); // Hide the alert
          navigate('/targets'); // Navigate to /targets page after 2 seconds
        }, 2000);
      })
      .catch(err => console.error(err));
  };

  // Dynamic Label for Amount
  const getAmountLabel = () => {
    return goalType === 'Safe Lock'
      ? 'How much do you want to safe lock?'
      : 'How much do you plan on saving towards this goal?';
  };

  return (
    <div className="lg:ml-56 px-4">
      <Nav title={"Create new target"} />

      <h1 className="text-md font-bold mb-4 px-16 text-green-700">New Target</h1>

      {showAlert && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          Goal has been successfully logged!
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-5 grid gap-3 px-16">
        <input
          type="text"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          className="border rounded p-2"
        />

        <select
          value={goalType}
          onChange={(e) => setGoalType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="Savings">Saving</option>
          <option value="Safe Lock">Safe Lock</option>
        </select>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">{getAmountLabel()}</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="border rounded p-2 "
          />
        </div>

        <input
          type="date"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
          required
          className="border rounded p-2 "
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 "
        >
          Add Goal
        </button>
      </form>


    </div>
  );
};

export default GoalForm;

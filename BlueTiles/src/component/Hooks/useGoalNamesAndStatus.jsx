// src/hooks/useGoalNamesAndStatus.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoalNamesAndStatus = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Fetch goals from the backend API
    axios.get('http://localhost:5000/api/goals')
      .then(res => {
        const fetchedGoals = res.data.map(goal => ({
          name: goal.name,
          status: goal.status,
        })); // Extract name and status
        setGoals(fetchedGoals); // Update state with goal data
      })
      .catch(err => console.error('Error fetching goals:', err));
  }, []); // Empty dependency array ensures this runs once after the first render

  return goals;
};

export default useGoalNamesAndStatus;

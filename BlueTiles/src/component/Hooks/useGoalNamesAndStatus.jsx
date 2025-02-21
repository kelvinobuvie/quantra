import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoalNamesAndStatus = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Fetch transactions with category 'Savings' or 'Safe Lock' from the backend API
    axios.get('http://localhost:5000/api/transactions/count/savings-safelock')
      .then(res => {
        const fetchedGoals = res.data.map(tx => ({
          name: tx.description,  // Assuming 'description' is the name of the goal
          status: tx.status,     // Assuming 'status' is available in the response
        }));
        setGoals(fetchedGoals); // Update state with transaction data
      })
      .catch(err => console.error('Error fetching goals:', err));
  }, []); // Empty dependency array ensures this runs once after the first render

  return goals;
};

export default useGoalNamesAndStatus;

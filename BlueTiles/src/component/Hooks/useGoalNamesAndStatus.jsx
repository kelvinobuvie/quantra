import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoalNamesAndStatus = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Handle errors

  useEffect(() => {
    // Fetch transaction data from the backend API
    axios.get('http://localhost:5000/api/transactions/savings-safelock')
      .then(res => {
        // Check if the API returns a valid response
        if (res.data && Array.isArray(res.data)) {
          // Assuming the API returns an array of goals with description and status
          const fetchedGoals = res.data.map(tx => ({
            name: tx.description || 'No Name',  // Make sure the description field exists
            status: tx.status || 'No Status',   // Ensure status exists
          }));
          setGoals(fetchedGoals);  // Update state with transaction data
        } else {
          setError('Invalid response format');
        }
      })
      .catch(err => {
        setError('Error fetching goals: ' + err.message);
      })
      .finally(() => setLoading(false));  // Stop loading when finished
  }, []);  // Empty dependency array ensures it runs once after the first render

  return { goals, loading, error };
};

export default useGoalNamesAndStatus;

import { useState, useEffect } from 'react';
import axios from 'axios';

const useGoalNamesAndStatus = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions/savings-safelock')
      .then(res => {
        console.log(res.data); // Log the response structure to debug
        if (res.data && Array.isArray(res.data)) {
          // Limiting the results to 10
          const fetchedGoals = res.data.slice(0, 10).map(tx => ({
            name: tx.description || 'No Name',
            status: tx.status || 'No Status',
          }));
          setGoals(fetchedGoals);
        } else {
          setError('Invalid response format');
        }
      })
      .catch(err => {
        setError('Error fetching goals: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, []);  // Empty dependency array ensures this runs only once on mount

  return { goals, loading, error };
};

export default useGoalNamesAndStatus;

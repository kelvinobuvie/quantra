import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoalCount = () => {
  const [goalCount, setGoalCount] = useState(0);

  // Fetch goal count from the backend
  useEffect(() => {
    const fetchGoalCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/goals/count');
        setGoalCount(response.data.count);  // Set the goal count from the response
      } catch (error) {
        console.error('Error fetching goal count:', error);
      }
    };

    fetchGoalCount();  // Fetch the goal count when the component mounts
  }, []);

  return (
    <div>
      <p>{goalCount}</p>
    </div>
  );
};

export default GoalCount;

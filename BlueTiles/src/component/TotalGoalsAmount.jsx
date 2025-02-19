import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalGoalsAmount = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    // Fetch the total amount of goals from the backend
    const fetchTotalAmount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/total-goals-amount');
        setTotalAmount(response.data.totalAmount);  // Set total amount in state
        setLoading(false);  // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching total goals amount:', error);
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchTotalAmount();  // Call the function when the component mounts
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <div>
      {loading ? (
        <p>Loading...</p>  // Show loading message while fetching
      ) : (
        <p>₦{totalAmount.toLocaleString()}</p>  // Display total amount
      )}
    </div>
  );
};

export default TotalGoalsAmount;

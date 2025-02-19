import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalAmount = () => {
  const [totalAmount, setTotalAmount] = useState(0);  // State to store the total amount
  const [loading, setLoading] = useState(true);  // Loading state to show loading indicator

  useEffect(() => {
    // Fetch the total transaction amount when the component mounts
    const fetchTotalAmount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions/total');
        setTotalAmount(response.data.totalAmount);  // Set the total amount in the state
        setLoading(false);  // Set loading to false once the data is fetched
      } catch (error) {
        console.error('Error fetching total amount:', error);
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchTotalAmount();
  }, []);  // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      {loading ? (
        <p>Loading...</p>  // Show loading message while fetching
      ) : (
        <p className=''>₦{totalAmount.toLocaleString()}</p>  // Display total amount
      )}
    </div>
  );
};

export default TotalAmount;

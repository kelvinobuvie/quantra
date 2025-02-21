import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryCount = () => {
  const [categoryCount, setCategoryCount] = useState(0);

  // Fetch count of transactions with category 'Savings' or 'Safe Lock'
  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions/count/savings-safelock');
        setCategoryCount(response.data.count);  // Set the count from the response
      } catch (error) {
        console.error('Error fetching category count:', error);
      }
    };

    fetchCategoryCount();  // Fetch the count when the component mounts
  }, []);

  return (
    <div>
      <p>{categoryCount}</p>
    </div>
  );
};

export default CategoryCount;

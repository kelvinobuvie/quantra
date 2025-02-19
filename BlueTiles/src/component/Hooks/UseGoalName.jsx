// src/hooks/useGoalNames.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useGoalNames = () => {
  const [goalNames, setGoalNames] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/goals')
      .then(res => {
        const names = res.data.map(item => item.name); // Extracting names
        setGoalNames(names);
      })
      .catch(err => console.error(err));
  }, []);

  return goalNames;
};

export default useGoalNames;

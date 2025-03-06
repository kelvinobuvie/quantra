import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LockedSafelocksCount = () => {
  const [lockedCount, setLockedCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the count of locked safelocks from the backend
    const fetchLockedCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/safelocks/locked-count');
        setLockedCount(response.data.locked_count);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locked safelocks count:', err);
        setError('Failed to fetch locked count');
        setLoading(false);
      }
    };

    fetchLockedCount();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading locked safelocks count...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* <h3 className="text-xl font-semibold">Locked SafeLocks Count</h3> */}
          <p>{lockedCount}</p>
        </div>
      )}
    </div>
  );
};

export default LockedSafelocksCount;

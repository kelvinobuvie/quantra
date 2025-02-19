import React from 'react';

const Balance = ({ balance }) => {
  return (
    <div>
      <p className="text-2xl text-green-600">₦{balance.toLocaleString()}</p>
    </div>
  );
};

export default Balance;


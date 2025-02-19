import React from 'react';

const TransactionList = ({ transactions }) => {
  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
      <div className='flex justify-between py-4 px-4'>
            <span className='text-sm font-semibold text-blue-950'>Transactions</span>
            <a href="/wallet" className="text-xs text-orange-500 font-medium inline-block hover:underline">View all</a>
          </div>
      <table className="min-w-full bg-white border-collapse ">
        <thead className='text-gray-500 text-xs'>
          <tr>
            <th className="border-b p-4 text-left">Id</th>
            <th className="border-b p-4 text-left">Date</th>
            <th className="border-b p-4 text-left">Category</th>
            <th className="border-b p-4 text-left">Description</th>
            <th className="border-b p-4 text-left">Amount</th>
            <th className="border-b p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {transactions.map((tx, index) => (
            <tr key={index} className="text-left bg-blue-100">
              <td className="border-b p-4 m-8 text-blue-950">{tx.id}</td>
              <td className="border-b p-4  text-blue-950 ">{tx.date}</td>
              <td className="border-b p-4  text-blue-950">{tx.category}</td>
              <td className="border-b p-4  text-blue-950">{tx.description}</td>
              <td className="border-b p-4  text-blue-950">₦{tx.amount.toLocaleString()}</td>
              <td className={`border-b p-4  text-blue-950 ${tx.status === 'Successfull' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

import React from 'react';

const GoalTable = ({ goals }) => {
  return (
    <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-80 overflow-y-auto">
       <div className='flex justify-between  py-4 px-4'>
            <span className='text-sm font-semibold text-blue-950'>Targets</span>
            <a href="/wallet" className="text-xs text-orange-500 font-medium inline-block hover:underline">View all</a>
        </div>
        <table className="min-w-full bg-white border-collapse ">
      <thead className='text-gray-500 text-xs'>
        <tr>
          <th className="border-b p-4 text-left">Goal</th>
          <th className="border-b p-4 text-left">Type</th>
          <th className="border-b p-4 text-left">Amount</th>
          {/* <th className="border-b p-4 text-left">Date Filled</th> */}
          <th className="border-b p-4 text-left">Completion Date</th>
          <th className="border-b p-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody className='text-sm'>
        {goals.map((item, index) => (
          <tr  key={index} className="text-left bg-blue-100">
            <td className="border-b p-4 m-8 text-blue-950">{item.name}</td>
            <td className="border-b p-4 m-8 text-blue-950">{item.goalType}</td>
            <td className="border-b p-4 m-8 text-blue-950">{item.amount}</td>
            {/* <td className="border-b p-4 m-8 text-blue-950">{item.dateFilled}</td> */}
            <td className="border-b p-4 m-8 text-blue-950">{item.completionDate}</td>
            <td className="border-b p-4 m-8 text-blue-950">
              <span className={`px-2 py-1 rounded ${item.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-600'}`}>
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default GoalTable;

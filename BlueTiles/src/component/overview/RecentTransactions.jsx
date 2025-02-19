import React from 'react'

const RecentTransactions = () => {
    const inspections = [
        {
          id: 10321,
          date: "10 Sep 23 15:44pm",
          category: "Food",
          categoryColor: "bg-blue-500",
          description: "Lunch",
          type: "Expense",
          status: "Completed",
          statusColor: "bg-green-500 text-white",
        },
        {
          id: 10321,
          date: "10 Sep 23 15:44pm",
          category: "Transport",
          categoryColor: "bg-purple-500",
          description: "Uber trip",
          type: "Expense",
          status: "Completed",
          statusColor: "bg-green-500 text-white",
        },
        {
          id: 10321,
          date: "10 Sep 23 15:44pm",
          category: "Entertainemt",
          categoryColor: "bg-orange-500",
          description: "Netflix",
          type: "Expense",
          status: "Completed",
          statusColor: "bg-green-500 text-white",
        },
        {
            id: 10321,
            date: "10 Sep 23 15:44pm",
            category: "Savings",
            categoryColor: "bg-orange-500",
            description: "Dubia Trip",
            type: "Income",
            status: "Completed",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: 10321,
            date: "10 Sep 23 15:44pm",
            category: "Savings",
            categoryColor: "bg-orange-500",
            description: "School Fees",
            type: "Income",
            status: "Completed",
            statusColor: "bg-green-500 text-white",
        }
      ];
    
      return (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-md h-64 overflow-y-auto">
          <div className='flex justify-between  py-4'>
            <span className='text-sm font-semibold'>Recent Transactions</span>
            <a href="/" className="text-xs text-orange-500 font-medium inline-block hover:underline">View all</a>
          </div>
          <table className="min-w-full bg-white border-collapse text-xs">
            <thead className='text-gray-500'>
              <tr>
                <th className="border-b p-4 text-left">ID</th>
                <th className="border-b p-4 text-left">Date</th>
                <th className="border-b p-4 text-left">Category</th>
                <th className="border-b p-4 text-left">Description</th>
                <th className="border-b p-4 text-left">Type</th>
                <th className="border-b p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className=''>
              {inspections.map((inspection, index) => (
                <tr key={index}>
                  <td className="border-b p-4">{inspection.id}</td>
                  <td className="border-b p-4">{inspection.date}</td>
                  <td className="border-b p-4">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${inspection.categoryColor}`}></span>
                    {inspection.category}
                  </td>
                  <td className="border-b p-4">{inspection.description}</td>
                  <td className="border-b p-4">{inspection.type}</td>
                  <td className="border-b p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inspection.statusColor}`}>
                      {inspection.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      );
    };


export default RecentTransactions
import React from 'react'
import { TbTargetArrow } from "react-icons/tb";
import useGoalNames from '../Hooks/UseGoalName';
import useGoalNamesAndStatus from '../Hooks/useGoalNamesAndStatus';


const TargetSummary = () => {
    const goalNames = useGoalNamesAndStatus();
  return (
    <div className=''>
        <div className=''>
            <ul className="list-none pl-0 Target-List">
  {goalNames.map((goal, index) => (
    <li key={index} className="flex justify-between mb-1 Target-List mx-4 py-3 border-b-2">
      <div className="w-7 h-7">
        <TbTargetArrow className="inline-block w-6 h-6 mr-3 text-red-500" />
      </div>
      <span className="flex-grow text-sm font-semibold text-gray-600">{goal.name}</span>
      <a href="/targets" className="text-sm text-blue-950 hover:underline">
        {goal.status}
      </a>
    </li>
  ))}
</ul>
        </div>
    
    </div>
  )
}

export default TargetSummary
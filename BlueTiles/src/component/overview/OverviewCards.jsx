import React from "react";
import { useNavigate } from "react-router";
import { IoWalletOutline } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { GrLineChart } from "react-icons/gr";
import { TbMoneybag } from "react-icons/tb";
// import GoalCount from "../GoalCount";
import TotalAmount from "../TotalAmount";
import TotalGoalsAmount from "../TotalGoalsAmount";
import LockedSafelocksCount from "../Targets/LockedSafeLocksCount";
import { IoMdLock } from "react-icons/io";





const OverviewCards = ({ balance }) => {
  

    
  const cards = [
    {
      title: "Wallet Balane",
      count:  balance ? `₦${balance.toLocaleString()}` : "Loading...",
      cardImage: <IoWalletOutline className='inline-block w-12 h-12 -mt-1 text-orange-500 bg-orange-200 py-2 x-3 border rounded-full font-extrabold'></IoWalletOutline>,
      note: "Up 15% this month",
    },
    {
      title: "Active Locks",
      count: <LockedSafelocksCount />,
      cardImage: <IoMdLock className='inline-block w-12 h-12 -mt-1 text-red-500 bg-red-200 py-2 x-3 border rounded-full font-extrabold'></IoMdLock>,
      note: "",
    },
    {
      title: "Total Savings",
      count: <TotalGoalsAmount/>,
      cardImage: <TbMoneybag className='inline-block w-12 h-12 -mt-1 text-green-500 bg-green-200 py-2 x-3 border rounded-full font-extrabold'></TbMoneybag>,
      note: "",
    },
    {
      title: "Total Expenses",
      count: <TotalAmount/>,
      cardImage: <GrLineChart className='inline-block w-12 h-12 -mt-1 text-red-700 bg-red-200 py-2 x-3 border rounded-full font-extrabold'></GrLineChart>,
      note: "",
    },
  ];
  const navigate = useNavigate();


  return (
    <a onClick={() => navigate('/wallet')} className="hover:cursor-pointer">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-2 pt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border-2 border-gray-200 rounded-xl shadow-sm px-4 py-5 flex flex-col justify-between"
        >
          <div>
            
            <h2 className="text-gray-400 font-semibold text-base">{card.title}</h2>
          </div>
          <div className="mt-4 flex justify-between">
            <p className="text-xl font-bold text-blue-950">{card.count}</p>
            <div className="">{card.cardImage}</div>
          </div>
          <div className="flex justify-between mt-4">
            <a onClick={() => navigate('/wallet')} className="text-green-600 hover:underline text-xs">
              See all ↗
            </a>
            {card.note && (
              <p className="text-gray-500 text-xs mt-1">{card.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
    </a>
  );
};

export default OverviewCards;

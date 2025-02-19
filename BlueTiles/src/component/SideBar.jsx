import React from 'react'

import { FaTableList } from "react-icons/fa6";
// import Logo from '../assets/Images';
// import { MdGroups } from 'react-icons/md';
import { BiBarChartAlt2 } from 'react-icons/bi';
// import { PiNotePencil } from 'react-icons/pi'; 
// import { CgNotes } from 'react-icons/cg';
// import { GrTransaction } from "react-icons/gr";
import { TbTargetArrow } from "react-icons/tb";
import { GrAnalytics } from "react-icons/gr";
import { AiOutlineStock } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
// import { GoDotFill } from 'react-icons/go';
// import Overview from '../pages/Overview';
// import Inspections from '../pages/Inspections';
import { NavLink } from 'react-router-dom'



const SideBar = () => {
  return (
    <>
        <div className={`sidebar active max-lg:hidden flex flex-col w-[216px] py-2 hidden:min-lg:block h-screen mt-0 bg-blue-950 fixed`}>
            <div className='mt-[30px] mb-[42px] w-41 h-14 px-4 flex justify-center items-center'>
                <h1 className='px-2 text-white text-2xl font-semibold border-4 border-orange-500 '>quantra</h1>
            </div>
            {/* <div>
                <span className='px-4 mt-10 mb-8 font-bold text-zinc-500 '>TRM</span>
            </div> */}
            <div>
            <ul className='mt-3 text-white px-4 flex flex-col gap-3'>
                <li className='text-sm gap-5 hover:bg-white py-2'>
                    <NavLink to="/overview" className={({ isActive }) => (isActive ? 'text-orange-500 px-3 py-2' : 'text-white px-3 hover:text-orange-500')}>
                        <BiBarChartAlt2 className='inline-block w-4 h-5 mr-3 -mt-1'></BiBarChartAlt2>
                        Dashboard
                    </NavLink>
                </li>
                <li className='mb- text-sm gap-5 hover:bg-white  py-2'>
                    <NavLink to="/wallet" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
                        <IoWalletOutline className='inline-block w-4 h-5 mr-3 -mt-1'></IoWalletOutline>
                        Wallet
                    </NavLink>
                </li>
                <li className='mb- text-sm hover:bg-white py-2'>
                    <NavLink to="/targets" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
                        <TbTargetArrow  className='inline-block w-4 h-5 mr-3 -mt-1'></TbTargetArrow>
                        Target and Goals
                    </NavLink>
                </li>
                <li className='mb- text-sm gap-5 hover:bg-white   py-2'>
                    <NavLink to="/transaction-history" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
                        <GrAnalytics  className='inline-block w-4 h-5 mr-3 -mt-1'></GrAnalytics>
                        Report & Analytics
                    </NavLink>
                </li>
                <li className='mb- text-sm gap-5 hover:bg-white  py-2'>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
                        <AiOutlineStock className='inline-block w-4 h-5 mr-3 -mt-1'></AiOutlineStock>
                        Investments
                    </NavLink>
                </li>
            </ul>
            </div>
        
        </div>
    </>

    
  )
}

export default SideBar
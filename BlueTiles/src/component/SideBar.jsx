import React from 'react'
import { FaUser, FaCog } from "react-icons/fa";
import { BiBarChartAlt2 } from 'react-icons/bi';
import { TbTargetArrow } from "react-icons/tb";
import { GrAnalytics } from "react-icons/gr";
import { AiOutlineStock } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom'
import { GiDialPadlock } from "react-icons/gi";

const SideBar = ({ user }) => {
  return (
    <>
      <div className={`sidebar active max-lg:hidden flex flex-col w-[216px] py-2 hidden:min-lg:block h-screen mt-0 bg-blue-950 fixed`}>

        {/* Brand Logo */}
        <div className='mt-[10px] mb-[32px] w-41 h-14 px-4 flex justify-center items-center'>
          <h1 className='px-2 text-white text-2xl font-semibold border-4 border-orange-500 '>quantra</h1>
        </div>

        {/* Profile Section */}
        <div className='mt-3 mb-7 w-full px-4 flex items-right gap-3'>
          <div className='text-white mt-2 px-4'>
            {/* <p className='font-semibold name '>Oluwaseun Adedeji</p> */}
            <p className='text-xs'>Account ID: 123-456-7890</p>
          </div>
        </div>

        {/* Menu Links */}
        <ul className='mt-3 text-white px-4 flex flex-col gap-3'>
          <li className='text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/overview" className={({ isActive }) => (isActive ? 'text-orange-500 px-3 py-2' : 'text-white px-3 hover:text-orange-500')}>
              <BiBarChartAlt2 className='inline-block w-4 h-5 mr-3 -mt-1'></BiBarChartAlt2>
              Dashboard
            </NavLink>
          </li>
          <li className='mb- text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/wallet" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
              <IoWalletOutline className='inline-block w-4 h-5 mr-3 -mt-1'></IoWalletOutline>
              Wallet
            </NavLink>
          </li>
          <li className='mb- text-sm hover:bg-white py-2'>
            <NavLink to="/targets" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
              <TbTargetArrow className='inline-block w-4 h-5 mr-3 -mt-1'></TbTargetArrow>
              Target and Goals
            </NavLink>
          </li>
          <li className='mb- text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/safe-lock-list" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
              <GiDialPadlock className='inline-block w-4 h-5 mr-3 -mt-1'></GiDialPadlock>
              Safe Lock
            </NavLink>
          </li>
          <li className='mb- text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/transaction-history" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
              <GrAnalytics className='inline-block w-4 h-5 mr-3 -mt-1'></GrAnalytics>
              Report & Analytics
            </NavLink>
          </li>

        </ul>

        {/* Profile and Settings at the bottom */}
        <ul className="mt-auto px-4 flex flex-col gap-3">
          <li className='text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-orange-500 px-3 py-2' : 'text-white px-3 hover:text-orange-500')}>
              <FaUser className='inline-block w-4 h-5 mr-3 -mt-1'></FaUser>
              Profile
            </NavLink>
          </li>
          <li className='mb- text-sm gap-5 hover:bg-white py-2'>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-orange-500 px-3' : 'text-white px-3 hover:text-orange-500')}>
              <FaCog className='inline-block w-4 h-5 mr-3 -mt-1'></FaCog>
              Settings
            </NavLink>
          </li>
        </ul>
        
      </div>
    </>
  )
}

export default SideBar;

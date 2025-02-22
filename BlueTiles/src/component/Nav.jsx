import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import { TbTargetArrow } from "react-icons/tb";
import { GrAnalytics } from "react-icons/gr";
import { AiOutlineStock } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



const Nav = ({ title }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); // Ref to track the sidebar element

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false); // Close the sidebar
      }
    };

    // Close sidebar on escape key press
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    // Add event listeners for click outside and key press
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Cleanup listeners on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div> 
      <header>
        <nav>
          <div> 
            <div className='nav mt-6  flex justify-between  border-b-orange-500'>
              <div className="">
                <div className='flex center text-xl'>
                  {/* Toggle Button for Sidebar */}
                  <button className='group' onClick={toggleSidebar}>
                    <FaBars className='text-gray-600 me-4 hidden max-lg:block w-6 h-6 mb-3' />
                  </button>

                  {/* Sidebar */}
                  {isSidebarOpen && (
                    <div
                      className="sidebar z-10 absolute w-[216px] px-4 py-2 mt-0"
                      ref={sidebarRef} // Attach ref to the sidebar
                    >
                      <div>
                        <div className={`sidebar active  flex flex-col w-[216px] py-2 min-lg:block h-screen mt-0 bg-blue-950 fixed`}>
                          <div className='mt-[30px] mb-[42px] w-41 h-14 px-4 flex justify-center items-center'>
                              <h1 className='px-2 text-white text-2xl font-semibold border-4 border-orange-500 '>BlueTiles</h1>
                          </div>
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
                      </div>
                    </div>
                  )}
                  <span className='text-blue-950 text-4xl font-semibold mb-3'>{title}</span>
                </div>
              </div>
              <div className='flex items-center gap-x-5'>
                <div className='mb-3 px-3 py-1 border rounded-md bg-gray-300 relative'>

                    <a onClick={() => navigate('/login')} className='text-sm text-blue-950 font-semibold logout'>Log Out</a>
                    {/* <div className='z-10 hidden absolute rounded-lg shadow w-32 group-focus:block top-full right-0 bg-black'>
                      <ul className='py-2 text-sm text-orange-500'>
                        <li><a href="">Profile</a></li>
                        <li><a href="">Settings</a></li>
                        <li><a href="">Sign out</a></li>
                      </ul>
                    </div> */}

                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Nav;

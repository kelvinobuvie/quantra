import React from 'react'
import BackgroundChanger from '../component/login/BackgroundChanger'
import Input from '../component/login/Input'
import { LuUser2 } from 'react-icons/lu'
import { GoLock } from 'react-icons/go'
import SignInbtn from '../component/login/SignINbtn'

const Login = () => {
  return (
    <div className=' box-content flex w-full h-screen'>
        <div className='sideA  w-full lg:block max-lg:hidden'>
            {/* <div className='bg-pictures flex items-end justify-center pb-20'>
                <div className='text-2xl text-green-800 font-extrabold'>
                    hellow worls
                </div>
            </div> */}
            <BackgroundChanger/>
        </div>
        <div className='sideB bg-white w-full h-screen flex justify-center items-center'>
            <div className='form '>
                <div className='flex-column gap-12 '>
                    <h1 className='font-bold text-3xl py-2 text-blue-950'>Welcome Back,</h1>
                    <p className='text-sm py-3 text-orange-600'>Sigin to view Dashboad</p>
                </div>
                <div>
                    <Input
                        type='text'
                        label="Login ID"
                        placeholder="Enter your login ID"
                        icon={<LuUser2/>}
                    />
                    <Input className="flex"
                        type='password'
                        label="password"
                        placeholder="Enter your password"
                        icon={<GoLock />}
                 />
                </div>
                <div className='mt-6 flex justify-center'>
                    <SignInbtn/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
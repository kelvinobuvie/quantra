import React from 'react'
import { useNavigate } from 'react-router';


const SignInbtn = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/overview')
  }
  
  return (
    <button onClick={handleLogin} className='bg-blue-950 py-2 w-full text-white text-lg font-bold  rounded-sm hover:bg-black'>
        Sign In
    </button>
  )
}

export default SignInbtn
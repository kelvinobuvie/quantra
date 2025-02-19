import React from 'react'
import { useNavigate } from 'react-router-dom';

const SetNewTargetBtn = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
    navigate('/new-target')
  }

  return (
    <button onClick={handleLogin} className="bg-orange-500 py-2 px-4 text-white font-bold ">
        Set New Target
    </button>
  )
}

export default SetNewTargetBtn
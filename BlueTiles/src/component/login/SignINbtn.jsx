import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInbtn = ({ isSignUp, email, password, name, setAlert }) => {
  const navigate = useNavigate();

  const handleAuth = async () => {
    const url = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
    const data = isSignUp ? { name, email, password } : { email, password };

    try {
      const response = await axios.post(url, data);
      setAlert({ type: 'success', message: response.data.message });

      // Clear the form fields
      if (isSignUp) {
        // Clear name if it's a sign-up form
        name = '';
      }
      email = '';
      password = '';

      // Redirect to the overview/dashboard page
      navigate('/overview');
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Something went wrong!' });
    }
  };

  return (
    <button
      onClick={handleAuth}
      className='bg-blue-950 py-2 w-full text-white text-lg font-bold rounded-sm hover:bg-black'
    >
      {isSignUp ? 'Sign Up' : 'Sign In'}
    </button>
  );
};

export default SignInbtn;

import React, { useState } from 'react';
import BackgroundChanger from '../component/login/BackgroundChanger';
import Input from '../component/login/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Track whether Sign Up or Sign In form is shown
  const [email, setEmail] = useState(''); // Track email input
  const [password, setPassword] = useState(''); // Track password input
  const [firstName, setFirstName] = useState(''); // Track first name input (for signup)
  const [lastName, setLastName] = useState(''); // Track last name input (for signup)
  const [alert, setAlert] = useState(null); // Alert state for success or error messages
  const navigate = useNavigate(); // For navigation after successful login/signup

  // Toggle between Sign Up and Sign In forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setAlert(null); // Clear alert when toggling forms
  };

  // Handle form submission (either sign up or sign in)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!email || !password || (isSignUp && (!firstName || !lastName))) {
      setAlert({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    // Select the correct API endpoint for login
    const url = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
    const data = isSignUp ? { firstName, lastName, email, password } : { email, password };

    try {
      const response = await axios.post(url, data);

      // On successful response, show success message and clear form
      setAlert({ type: 'success', message: response.data.message });

      // Clear form fields after submission
      setEmail('');
      setPassword('');
      if (isSignUp) {
        setFirstName('');
        setLastName('');
      } // Clear first and last name fields if it's signup

      // Redirect to the dashboard after successful login/signup
      navigate('/overview');
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Something went wrong!' });
    }
  };

  return (
    <div className="box-content flex w-full h-screen">
      <div className="sideA w-full lg:block max-lg:hidden">
        <BackgroundChanger />
      </div>

      <div className="sideB bg-white w-full h-screen flex justify-center items-center">
        <div className="form">
          <div className="flex-column gap-12">
            <h1 className="font-bold text-3xl py-2 text-blue-950">
              {isSignUp ? 'Create Account' : 'Welcome Back,'}
            </h1>
            <p className="text-sm py-3 text-orange-600">
              {isSignUp ? 'Sign up to view your Dashboard' : 'Sign in to view Dashboard'}
            </p>
          </div>

          {/* Show alerts if any */}
          {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}

          <form onSubmit={handleSubmit}>
            {/* Show First Name and Last Name fields only for signup */}
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            )}
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            )}

            {/* Email input */}
            <div>
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password input */}
            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="bg-blue-950 py-2 w-full text-white text-lg font-bold rounded-sm hover:bg-black"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Toggle between Sign Up and Sign In */}
          <div className="mt-4 text-center">
            <button
              className="text-blue-600"
              onClick={toggleForm}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

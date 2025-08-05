import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }
    // Here you would typically make an API call to verify credentials
    console.log('Login attempt:', credentials);
    // For now, just navigate to the next page
    navigate('/dashboard'); // or wherever you want to redirect after login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <p className="flex flex-start font-medium text-center mb-4">User name</p>
        <input
          type="text"
          placeholder="Enter your user name"
          className="w-full p-4 border border-teal-200 rounded-full text-base focus:outline-none focus:border-teal-400"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
      </div>
      <div className="relative">
        <p className='flex flex-start font-medium text-center mb-4'>Password</p>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your Password"
          className="w-full p-4 border border-teal-200 rounded-full  text-base pr-10 focus:outline-none focus:border-teal-400"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-14 text-gray-400 cursor-pointer"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-teal-400 rounded border-gray-300" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-teal-400 hover:text-teal-500">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="bg-teal-400 text-white p-4 rounded-full hover:bg-teal-500 transition-colors w-full font-medium text-lg mt-2"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

import education from '../assets/youngsters-watching-laptop-cafe.jpg'
export default function Login() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left side with image */}
      <div className="w-full md:w-1/2 bg-cover bg-center overflow-hidden relative p-3 md:p-5 h-[30vh] md:h-auto" >
        <img
          src={education}
          alt=""
          className='w-full h-full object-cover rounded-3xl'
        />
        <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 text-white">
          <h2 className="text-2xl md:text-3xl font-bold">Lorem Ipsum is simply</h2>
          <p className="text-base md:text-lg mt-2">Lorem Ipsum is simply</p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 md:px-16 py-8 md:py-0">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Bienvenue!</h1>
        </div>
        <div className="flex justify-between  max-w-sm h-15  mb-6 space-x-5 bg-teal-300 rounded-full">
          <div className='pt-2 pl-2'>
            <button className="px-6 md:px-8 py-2 bg-teal-400 text-white rounded-full font-medium text-sm md:text-base">Connexion</button>
          </div>
          <div className='pt-2 pr-2'>
            <button onClick={handleRegisterClick} className="px-6 md:px-8 py-2 text-white rounded-full font-medium text-sm md:text-base hover:bg-teal-500">
              Inscription
            </button>
          </div>
        </div>

        <div className="w-full max-w-md pt-3 md:pt-5">
          <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 pb-3 md:pb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
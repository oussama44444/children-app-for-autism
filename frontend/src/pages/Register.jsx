import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import educ from '../assets/happy-students-sitting-studying-outdoors-while-talking.jpg';

export default function Register() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with image - Hidden on small screens */}
      <div className="w-full md:w-1/2 bg-cover bg-center overflow-hidden relative p-3 md:p-5 h-[30vh] md:h-auto" >
        <img 
          src={educ} 
          alt="" 
          className='w-full h-full object-cover rounded-3xl'
        />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-2xl lg:text-3xl font-bold">Lorem Ipsum is simply</h2>
          <p className="text-base lg:text-lg mt-2">Lorem Ipsum is simply</p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Créez votre compte!</h1>
        </div>
        <div className="flex justify-between  max-w-[320px] sm:max-w-[360px] h-12 sm:h-14 mb-6 space-x-2 sm:space-x-4 bg-teal-300 rounded-full">
          <div className='pt-1.5 sm:pt-2 pl-1 sm:pl-2'>
            <button onClick={handleLoginClick} 
              className="px-4 sm:px-8 py-1.5 sm:py-2 text-white rounded-full text-sm sm:text-base font-medium hover:bg-teal-500">
              Connexion
            </button>
          </div>
          <div className='pt-1.5 sm:pt-2 pr-1 sm:pr-2'>
            <button className="px-4 sm:px-8 py-1.5 sm:py-2 bg-teal-400 text-white rounded-full text-sm sm:text-base font-medium">
              Inscription
            </button>
          </div>
        </div>
        
        <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-md pt-4 md:pt-5">
          <p className="text-gray-500 text-xs sm:text-sm mb-4 md:mb-6 pb-3 md:pb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
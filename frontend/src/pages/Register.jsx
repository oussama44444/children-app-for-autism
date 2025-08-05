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
    <div className="min-h-screen flex">
      {/* Left side with image */}
      <div className="w-1/2 bg-cover bg-center overflow-hidden relative p-5" >
        <img 
          src={educ} 
          alt="" 
          className='w-full h-full object-cover rounded-3xl'
        />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-3xl font-bold">Lorem Ipsum is simply</h2>
          <p className="text-lg mt-2">Lorem Ipsum is simply</p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Créez votre compte!</h1>
        </div>
        <div className="flex justify-between w-90 h-15 mb-6 space-x-5 bg-teal-300 rounded-full">
          <div className='pt-2 pl-2'>
            <button onClick={handleLoginClick} className="px-8 py-2 text-white rounded-full font-medium hover:bg-teal-500">Connexion</button>
          </div>
          <div className='pt-2 pr-2'>
            <button className="px-8 py-2 bg-teal-400 text-white rounded-full font-medium">Inscription</button>
          </div>
        </div>
        
        <div className="w-full max-w-md pt-5 ">
          <p className="text-gray-500 text-sm mb-6 pb-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
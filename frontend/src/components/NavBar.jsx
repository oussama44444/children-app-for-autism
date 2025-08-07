import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function NavBar() {
      const navigate = useNavigate();
    
      const handleLogin = () => {
       console.log('Login clicked');
        navigate('/login');
      };
      const handleRegister = () => {
           console.log('Register clicked'); 
        navigate('/register');
      };
  return (
    <nav className="bg-transparent ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-600">SVT Platform</h1>
            </div>
            <div className='flex'>
            <div className="flex pl-30 pr-30 gap-15  text-white items-center">
                <Link to='/home' className='hover:scale-110 '>Accueil</Link> 
          
                <Link to='/course' className='hover:scale-110 ' >Cours</Link>
           
                <Link to='/career' className='hover:scale-110 '  >Carrières</Link>
           
                <Link to='/blog' className='hover:scale-110 '  >Blog</Link>
         
          
                <Link to='/about' className='hover:scale-110 ' >À propos de nous</Link>
            </div>
            <div className="flex items-center  -m-15">
              <button
              type='button'
                onClick={handleLogin}
                className="ml-4 px-4 py-2 rounded-full hover:scale-110 cursor-pointer  text-sm font-medium text-black bg-white hover:bg-teal-500"
              >
                Connexion
              </button>
              <button
              type='button'
                onClick={handleRegister}
                className="ml-4 px-4 py-2 rounded-full hover:scale-110 cursor-pointer text-sm font-medium text-white bg-customblue hover:bg-teal-500"
              >
                Inscription
              </button>
            </div>
            </div>
          </div>
        </div>
      </nav>
  )
}

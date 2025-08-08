import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-transparent md:pt-10 lg:pt-0 relative">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
          <div className="flex items-center">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold text-teal-600 truncate max-w-[150px] sm:max-w-full">
              SVT Platform
            </h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-1 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-8 text-white">
              <Link to='/home' className='hover:scale-110'>Accueil</Link>
              <Link to='/course' className='hover:scale-110'>Cours</Link>
              <Link to='/career' className='hover:scale-110'>Carrières</Link>
              <Link to='/blog' className='hover:scale-110'>Blog</Link>
              <Link to='/about' className='whitespace-nowrap hover:scale-110'>À propos</Link>
            </div>
            <div className="ml-8 flex items-center  space-x-4">
              <button onClick={handleLogin} className="lg:px-4 md:px-2 py-2 rounded-full hover:scale-110 text-sm font-medium text-black bg-white hover:bg-teal-500">
                Connexion
              </button>
              <button onClick={handleRegister} className="lg:px-4 md:px-2 py-2  rounded-full hover:scale-110 text-sm font-medium text-white bg-customblue hover:bg-teal-500">
                Inscription
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-1 p-2 mx-1">
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <Link to='/home' className='text-gray-800 hover:text-teal-500 text-xs sm:text-sm px-2 py-1.5 rounded hover:bg-gray-100'>
                Accueil
              </Link>
              <Link to='/course' className='text-gray-800 hover:text-teal-500 text-xs sm:text-sm px-2 py-1.5 rounded hover:bg-gray-100'>
                Cours
              </Link>
              <Link to='/career' className='text-gray-800 hover:text-teal-500 text-xs sm:text-sm px-2 py-1.5 rounded hover:bg-gray-100'>
                Carrières
              </Link>
              <Link to='/blog' className='text-gray-800 hover:text-teal-500 text-xs sm:text-sm px-2 py-1.5 rounded hover:bg-gray-100'>
                Blog
              </Link>
              <Link to='/about' className='text-gray-800 hover:text-teal-500 text-xs sm:text-sm px-2 py-1.5 rounded hover:bg-gray-100'>
                À propos de nous
              </Link>
              <div className="flex flex-col space-y-1 sm:space-y-2 pt-1 sm:pt-2 border-t">
                <button 
                  onClick={handleLogin} 
                  className="w-full px-2 py-1.5 rounded-full text-xs sm:text-sm font-medium text-black bg-gray-100 hover:bg-teal-500"
                >
                  Connexion
                </button>
                <button 
                  onClick={handleRegister} 
                  className="w-full px-2 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white bg-customblue hover:bg-teal-500"
                >
                  Inscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

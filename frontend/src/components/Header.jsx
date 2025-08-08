import React from 'react'
import student from '../assets/upscalemedia-transformed.png'
import NavBar from './NavBar';

export default function Header() {
  return (
    <header className="md:min-h-[98vh] h-150 bg-customcyan w-full rounded-b-[50%_7%] relative overflow-hidden">
      
      <div className="container mx-auto px-2 py-4">
        {/* Student Image */}
        <div className="absolute right-0 -top-16 sm:-top-32 h-full flex items-end z-10">
          <img 
            src={student} 
            alt="Happy student" 
            className="h-[120%] sm:h-[120%]  max-h-[700px] object-contain object-bottom  md:translate-y-40 opacity-30 sm:opacity-100" 
          />
        </div>

        <div className="flex items-center justify-start min-h-[70vh] px-2 sm:px-10">
          <div className="w-full max-w-[280px] sm:max-w-md z-20">
            <h1 className=" sm:text-3xl md:text-5xl md:pt-50 md:pl-20 font-bold text-white leading-tight mb-3">
              <span className="text-orange-500">Étudier </span>
              en ligne est désormais beaucoup
              <span className="block mt-1">plus facile</span>
            </h1>

            <p className="text-sm md:pl-20 sm:text-base text-white text-opacity-80 mb-6">
              SVT est une plateforme intéressante qui vous enseignera de manière plus interactive
            </p>

            <div className="flex flex-col md:pl-20 sm:flex-row items-start sm:items-center gap-4"> 
              <button className="w-full  sm:w-auto bg-white text-xs sm:text-sm cursor-pointer hover:scale-105 text-[#36B3BD] font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md hover:opacity-90 transition">
                Rejoignez gratuitement
              </button>

              <a href="https://youtu.be/KQPZ_p8MIX4" target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                <div className="w-20 h-16 bg-white rounded-full hover:scale-105 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#36B3BD]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-white text-opacity-90 font-medium">Découvrez comment ça marche</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
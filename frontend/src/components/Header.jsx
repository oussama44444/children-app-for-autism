import React from 'react'
import student from '../assets/upscalemedia-transformed.png'

export default function Header() {
  
  return (
    <header className="h-200 bg-customcyan w-full rounded-b-[50%_7%] relative">
      <div className="container mx-auto px-4 py-6">
        <div className="absolute right-0 -top-32 h-full flex items-end z-10">
          <img 
            src={student} 
            alt="Happy student" 
            className="h-[150%] max-h-[700px] object-contain object-bottom translate-y-32" 
          />
        </div>
        <div className="flex items-center justify-start min-h-screen px-10">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          <span className="text-orange-400">Étudier </span>
          en ligne est désormais
beaucoup<br />
           plus facile
        </h1>

        <p className="text-white text-opacity-80 mb-8">
         SVT est une plateforme intéressante qui vous enseignera
de manière plus interactive
        </p>

        <div className="flex items-center gap-4"> 
          {/* Join Button */}
          <button className="bg-white cursor-pointer hover:scale-110 text-[#36B3BD] font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
            Rejoignez gratuitement
          </button>

          {/* Watch Video Button */}
          <a
  href="https://youtu.be/KQPZ_p8MIX4?si=K59JC9nZB3tChMXI"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 cursor-pointer"
>
  <div className="w-17 h-17 bg-white rounded-full hover:scale-110 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6  w-6 text-[#36B3BD]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
  <span className="text-white  text-opacity-90 font-medium">Découvrez comment ça marche</span>
</a>

        </div>
      </div>
    </div>
    </div>
    </header>
  )
}
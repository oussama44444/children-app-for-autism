import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ExploreCourses from '../components/ExploreCourses'
import sciencelogo from '../assets/png-clipart-computer-icons-physics-science-research-scientists-people-logo-removebg-preview.png'
import mathlogo from '../assets/pngtree-builddesigngeometrymathtool-glyph-icon--vector-isolated-png-image_1059914-removebg-preview.png'
import math from '../assets/asset-v1_HarvardX+CalcAPL1x+2T2017+type@asset+block@TITLE-Calculus-Applied-2120x1192-NO-SPOTLIGHT 2.png'
import physics from '../assets/https___d1e00ek4ebabms.cloudfront.net_production_184534e4-83df-440d-a180-f5d7b24ea1ed.avif'
import info from '../assets/alison_courseware_intro_1878.jpg'
import chimie from '../assets/image.jpg'
import science from '../assets/Science.png'
import physicslogo from '../assets/176024-removebg-preview.png'
import { Navigate , useNavigate } from 'react-router-dom'
import Features from '../components/Features'
import LatestCourses from '../components/LatestCourses'
const row1 = [
  { id: 1, title: "science", color: "from-orange-400 to-orange-300", image: science, price: "$450" },
  { id: 2, title: "physique", color: "from-pink-400 to-pink-300", image: physics, price: "$450" },
  { id: 3, title: "Math", color: "from-yellow-500 to-yellow-400", image: math, price: "$450" },
  { id: 4, title: "informatique", color: "from-blue-400 to-blue-300", image: info, price: "$450" },
  { id: 5, title: "chimie", color: "from-purple-400 to-purple-300", image: chimie, price: "$450" },
  
  { id: 1, title: "science", color: "from-orange-400 to-orange-300", image: science, price: "$450" },
  { id: 2, title: "physique", color: "from-pink-400 to-pink-300", image: physics, price: "$450" },
  { id: 3, title: "Math", color: "from-yellow-500 to-yellow-400", image: math, price: "$450" },
  { id: 4, title: "informatique", color: "from-blue-400 to-blue-300", image: info, price: "$450" },
  { id: 5, title: "chimie", color: "from-purple-400 to-purple-300", image: chimie, price: "$450" },
  
  { id: 1, title: "science", color: "from-orange-400 to-orange-300", image: science, price: "$450" },
  { id: 2, title: "physique", color: "from-pink-400 to-pink-300", image: physics, price: "$450" },
  { id: 3, title: "Math", color: "from-yellow-500 to-yellow-400", image: math, price: "$450" },
  { id: 4, title: "informatique", color: "from-blue-400 to-blue-300", image: info, price: "$450" },
  { id: 5, title: "chimie", color: "from-purple-400 to-purple-300", image: chimie, price: "$450" },
  
];
const row2 = [
  { id: 1, title: "science", color: "from-orange-400 to-orange-300", image: science, price: "$450" },
  { id: 2, title: "physique", color: "from-pink-400 to-pink-300", image: physics, price: "$450" },
  { id: 3, title: "Math", color: "from-yellow-500 to-yellow-400", image: math, price: "$450" },
  { id: 4, title: "informatique", color: "from-blue-400 to-blue-300", image: info, price: "$450" },
  { id: 5, title: "chimie", color: "from-purple-400 to-purple-300", image: chimie, price: "$450" },
  
];
export default function LandingPage() {
  const Navigate = useNavigate();
  const HandleExplore = () => {
    Navigate('/course')}
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute w-full z-50">
        <NavBar />
      </div>
      <Header />
      <Features />
      <div className="flex  md:justify-end pr-4 md:pr-20">
          <button 
            onClick={HandleExplore}
            className="text-[#36B3BD] not-md:hidden cursor-pointer hover:scale-101 hover:text-teal-600 text-base md:text-lg font-medium"
          >
            Explorer les cours &rarr;
          </button>
      </div>
      <div className='px-4 md:pl-10 flex items-center mb-4'>
        <img className='h-8 md:h-10' src={sciencelogo} alt="" />
        <p className='font-bold text-xl md:text-2xl ml-2'>Cours 1 ére année</p>
      </div>
     <ExploreCourses courses={row1} />
    
       <div className='px-4 md:pl-10 flex items-center mb-4'>
        <img className='h-8 md:h-10' src={mathlogo} alt="" />
        <p className='font-bold text-xl md:text-2xl ml-2'>Cours 2 éme année</p>
      </div>
     <ExploreCourses courses={row2} />
       <div className='px-4 md:pl-10 flex items-center mb-4'>
        <img className='h-8 md:h-10' src={physicslogo} alt="" />
        <p className='font-bold text-xl md:text-2xl ml-2'>Cours 3 éme année </p>
      </div>
     <ExploreCourses courses={row2} />
     <div className="flex  not-md:justify-end pr-4 md:pr-20">
          <button 
            onClick={HandleExplore}
            className="text-[#36B3BD] md:hidden cursor-pointer hover:scale-101 hover:text-teal-600 text-base md:text-lg font-medium"
          >
            Explorer les cours &rarr;
          </button>
      </div>
      <LatestCourses />
      <Footer />
    </div>
  )
}
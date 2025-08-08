// src/components/CloudSoftwareFeatures.jsx
import React from 'react';
import { FaFileInvoice, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import quizz from '../assets/Quizzes-1080x675-removebg-preview.png'
import meet from '../assets/upscalemedia-transformed (2).png'
import { FaUserGraduate, FaChalkboardTeacher, FaBookOpen,  } from 'react-icons/fa';
import { FaReact, FaNodeJs, FaPython } from 'react-icons/fa';
import teacher from '../assets/young-woman-teacher-wearing-glasses-sitting-school-desk-front-blackboard-classroom-checking-class-register-looking-camera-smiling-cheerfully-min-scaled-1.jpg'
import { LayoutGrid, MonitorSmartphone, Users2 } from 'lucide-react';
import featimg from '../assets/upscalemedia-transformed (1).png'
import student from '../assets/gettyimages-2105091005.jpg'
import call from '../assets/sTKfkjXZCccZzvIvkSUIjU4UVZL9WgNNP7gE3C7j.jpeg'
import level from '../assets/upscalemedia-transformed (3).png'
import { useState } from 'react';
const classfeatures = [
    {
      icon: <LayoutGrid className="text-indigo-600 not-lg:hidden w-5 h-5" />,
      text: 'Les enseignants ne se perdent pas dans la vue en grille et disposent d’un espace Podium dédié.',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: <MonitorSmartphone className="text-orange-500 not-lg:hidden w-5 h-5" />,
      text: 'Les assistants et les présentateurs peuvent être placés à l’avant de la classe.',
      bgColor: 'bg-orange-100',
    },
    {
      icon: <Users2 className="text-purple-600 w-5 not-lg:hidden h-5" />,
      text: 'Les enseignants peuvent facilement voir tous les eleves et les données de la classe en un seul coup d’œil.',
      bgColor: 'bg-purple-100',
    },
  ];
const feature = [
  {
    title: 'Facturation, Invoicing et Contrats en ligne',
    description: 'Contrôle simple et sécurisé des transactions financières et juridiques de votre organisation. Envoyez des factures et des contrats personnalisés.',
    icon: <FaFileInvoice size={28} className="text-white" />,
    iconBg: 'bg-blue-500',
  },
  {
    title: 'Planification facile et suivi de la présence',
    description: 'Planifiez et réservez des salles de classe sur un ou plusieurs campus. Conservez des enregistrements détaillés de la présence des étudiants.',
    icon: <FaCalendarAlt size={28} className="text-white" />,
    iconBg: 'bg-teal-400',
  },
  {
    title: 'Suivi des clients',
    description: 'Automatisez et suivez les e-mails envoyés à des individus ou à des groupes. Le système intégré de Skilline aide à organiser votre structure.',
    icon: <FaUsers size={28} className="text-white" />,
    iconBg: 'bg-sky-400',
  },
];

export default function Features() {
    const [showAll, setShowAll] = useState(false);
    
  return (
    <div className="py-12 px-6 md:px-20 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-800">
        Tout-en-Un <span className="text-teal-500">Cloud Software.</span>
      </h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
       SVT est une puissante suite logicielle en ligne qui regroupe tous les outils nécessaires pour gérer une école ou un bureau avec succès.
      </p>

      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {feature.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-8 relative">
            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 flex items-center justify-center rounded-full ${feature.iconBg} shadow-lg`}>
              {feature.icon}
            </div>
            <h3 className="mt-10 text-lg font-semibold text-gray-800">{feature.title}</h3>
            <p className="mt-2 text-sm not-lg:hidden text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className='pt-40'>
         <h2 className="text-3xl font-bold text-gray-800">
        Qu’est-ce que <span className="text-teal-500">SVT ?</span>
      </h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
       SVT est une plateforme qui permet aux enseignants de créer des classes en ligne où ils peuvent stocker les supports de cours, gérer les devoirs, les quiz et les examens, suivre les dates limites, noter les résultats et fournir des retours aux étudiants — le tout en un seul endroit.
      </p>
      </div>
     <div className="mt-12 grid md:grid-cols-2 gap-4">
  {/* Instructor Card */}
  <div className="relative md:w-full md:h-[400px] h-50 rounded-xl overflow-hidden shadow-md bg-white">
    <img
      src={teacher}
      alt="instructor"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0  bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Pour les enseignants</h2>
      <button className=" text-white border border-white cursor-pointer   font-semibold px-6 py-5 rounded-full hover:bg-gray-400 transition">
        Commencer une classe aujourd’hui
      </button>
    </div>
  </div>

  {/* Student Card */}
  <div className="relative md:w-full md:h-[400px] h-50 rounded-xl overflow-hidden shadow-md bg-white">
    <img
      src={student}
      alt="student"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0  bg-opacity-50 flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Pour les étudiants</h2>
      <button className="bg-blue-500 text-black cursor-pointer font-semibold px-6 py-5 rounded-full hover:bg-gray-200 transition">
        Entrer le code d’accès
      </button>
    </div>
  </div>
</div>
   <section className='py-8 px-4 md:py-16 md:px-20 pt-20 md:pt-30 bg-white'>
      {/* Title Section */}
      <div className="text-center ">
        <h2 className="text-2xl md:text-3xl font-bold pb-6 md:pb-10 text-gray-800">
          Nos <span className="text-teal-500">Fonctionnalités.</span>
        </h2>
        <p className='text-gray-500 mb-8 md:mb-16 px-4 md:px-0'>
          Cette fonctionnalité exceptionnelle peut rendre les activités d'apprentissage plus efficaces.
        </p>
      </div>

      {/* Feature 1: Interface Utilisateur */}
      <div className="mb-12 not-lg:hidden md:mb-20 flex flex-col md:flex-row items-center gap-8 md:gap-20">
        <div className="w-full md:w-1/2 order-1 md:order-1">
          <img src={call} alt="Interface utilisateur" className="w-full lg:h-90  md:h-110 max-w-md mx-auto rounded-xl" />
        </div>
        <div className="w-full md:w-1/2 pt-8 md:pt-20 order-2 md:order-2">
          <div className='pb-8 lg:pl-10 lg:pb-20 text-center lg:text-left '>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Une <span className="text-teal-500">interface utilisateur </span>
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold  text-gray-800">
              conçue pour la salle de classe.
            </h2>
          </div>
          <div className="space-y-6 lg:pr-30">
            {classfeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 mx-auto max-w-md">
                <div className={`rounded-full p-2  ${feature.bgColor}`}>
                  {feature.icon}
                </div>
                <p className="text-gray-700 text-center lg:text-left leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature 2: Outils pour enseignants */}
      <div className="mb-12 md:mb-20 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-1">
        <div className="w-full md:w-1/2 relative order-1 md:order-1">
          <img
            src={featimg}
            alt="Outils pour enseignants"
            className="w-full  h-auto md:w-[700px] md:h-[375px] lg:h-[775px] lg:pr-[50px] rounded-xl pb-4 lg:pb-20 relative z-10"
          />
          
          {/* Floating Bubbles - Visible on all screens but positioned differently */}
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full top-1/2 md:top-50 left-1/2 animate-float delay-0"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-green-700 rounded-full top-1/4 md:top-20 left-1/2 animate-float delay-0"></span>
          <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full top-1/3 md:top-1/3 right-1/4 md:right-50 animate-float delay-200"></span>
          <span className="absolute w-4 h-4 md:w-5 md:h-5 bg-purple-400 rounded-full bottom-1/6 md:bottom-5 left-1/4 animate-float delay-400"></span>
          <span className="absolute w-2 h-2 md:w-2 md:h-2 bg-green-300 rounded-full bottom-1/3 md:bottom-1/4 right-1/3 animate-float delay-600"></span>
          <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full top-1/2 md:top-50 left-1/5 md:left-20 animate-float delay-300"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-800 rounded-full bottom-1/6 md:bottom-5 right-1/3 md:right-50 animate-float delay-100"></span>
          
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 right-1/3 md:right-40 animate-float delay-100"></span>
          <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 left-1/3 md:left-40 animate-float delay-100"></span>
          <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 left-1/4 md:left-[30%] animate-float delay-500"></span>
          
          <span className="absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-teal-400 rounded-full bottom-1/6 md:bottom-[10%] left-1/6 md:left-[10%] animate-float delay-700"></span>
          <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-red-400 rounded-full top-1/2 md:top-40 left-1/3 md:left-40 animate-float delay-300"></span>
          <span className="absolute w-2 h-2 md:w-2 md:h-2 bg-orange-300 rounded-full top-1/2 md:top-[50%] right-1/6 md:right-[10%] animate-float delay-[800ms]"></span>
          
          {/* Icons - Visible on all screens */}
          <FaUserGraduate className="absolute w-5 h-5 md:w-6 md:h-6 top-0 md:top-[-10px] left-1/2 md:left-[50%] animate-float delay-0 text-blue-500" />
          <FaChalkboardTeacher className="absolute w-4 h-4 md:w-5 md:h-5 top-1/5 md:top-[20%] right-0 md:right-[-10px] animate-float delay-200 text-green-600" />
          <FaBookOpen className="absolute w-5 h-5 md:w-7 md:h-7 bottom-0 md:bottom-[-10px] left-1/4 md:left-[25%] animate-float delay-400 text-purple-600" />
          <FaUsers className="absolute w-3 h-3 md:w-4 md:h-4 bottom-1/4 md:bottom-[25%] right-0 md:right-[-10px] animate-float delay-600 text-pink-500" />
          <FaUserGraduate className="absolute w-4 h-4 md:w-5 md:h-5 top-1/6 md:top-[10px] left-1/6 md:left-[10px] animate-float delay-300 text-yellow-500" />
          <FaChalkboardTeacher className="absolute w-3 h-3 md:w-4 md:h-4 bottom-1/6 md:bottom-[10px] right-1/6 md:right-[10px] animate-float delay-100 text-red-400" />
          <FaBookOpen className="absolute w-4 h-4 md:w-5 md:h-5 top-1/4 md:top-[40px] right-1/4 md:right-[90px] animate-float delay-500 text-indigo-500" />
          <FaUsers className="absolute w-5 h-5 md:w-6 md:h-6 bottom-1/3 md:bottom-[40px] left-1/4 md:left-[40px] animate-float delay-700 text-teal-400" />
          <FaUserGraduate className="absolute w-3 h-3 md:w-4 md:h-4 top-1/2 md:top-[50%] right-1/6 md:right-[20px] animate-float delay-[800ms] text-orange-400" />
        </div>

        <div className="w-full md:w-1/2 pt-8 md:pt-20 order-2 md:order-2">
          <div className='pb-8 md:pb-20 text-center lg:text-left lg:pl-40'>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              <span className="text-teal-500">Outils pour </span>
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              enseignants et apprenants.
            </h2>
          </div>
          <div className="space-y-6 px-4 lg:pl-40 md:pr-0">
            <p className="text-gray-700 text-center md:text-justify leading-relaxed max-w-md mx-auto md:mx-0">
              Class dispose d'un ensemble dynamique d'outils pédagogiques conçus pour être utilisés en temps réel pendant les cours. Les enseignants peuvent distribuer des devoirs en direct que les élèves complètent et soumettent immédiatement.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 3: Évaluations */}
      <div className="mb-12 md:mb-20 flex flex-col md:flex-row items-center gap-8 md:gap-20">
        <div className="w-full md:w-1/2 relative order-1 md:order-1">
          <img
            src={quizz}
            alt="Évaluations"
            className="w-50 max-w-md mx-auto h-auto lg:w-[500px] lg:h-[375px] md:w-[400px] md:h-[175px] md:pr-[50px] rounded-xl pb-4 md:pb-2 relative z-10"
          />
          {/* Floating Bubbles */}
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full top-1/2 md:top-50 left-1/2 animate-float delay-0"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-green-700 rounded-full top-1/4 md:top-20 left-1/2 animate-float delay-0"></span>
          <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full top-1/3 md:top-1/3 right-1/5 md:right-20 animate-float delay-200"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 right-1/6 md:right-10 animate-float delay-100"></span>
          <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>
          <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 left-1/3 md:left-40 animate-float delay-100"></span>
          
          {/* Icons */}
          <FaReact className="absolute w-4 h-4 md:w-5 md:h-5 top-0 md:top-[-10px] left-1/2 md:left-[50%] animate-float delay-0 text-blue-500" />
          <FaNodeJs className="absolute w-5 h-5 md:w-6 md:h-6 top-1/5 md:top-[20%] right-0 md:right-[-10px] animate-float delay-200 text-green-600" />
          <FaPython className="absolute w-4 h-4 md:w-5 md:h-5 bottom-0 md:bottom-[-10px] left-1/4 md:left-[25%] animate-float delay-400 text-yellow-500" />
        </div>

        <div className="w-full md:w-1/2 pt-8 md:pt-20 order-2 md:order-2">
          <div className='pb-8 lg:pb-20 text-center lg:text-left'>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Évaluations, <span className="text-teal-500"> Quiz </span>
            </h2>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Tests.
            </h2>
          </div>
          <div className="space-y-6 px-4 md:px-0">
            <p className="text-gray-700 text-center md:text-justify leading-relaxed max-w-md mx-auto md:mx-0">
              Lancez facilement des devoirs, quiz et tests en direct.
              Les résultats des étudiants sont automatiquement enregistrés dans le carnet de notes en ligne.
            </p>
          </div>
        </div>
      </div>

      {/* Conditional Features */}
      {!showAll ? (
        <div className="text-center mb-10 pt-10">
          <button
            onClick={() => setShowAll(true)}
            className="text-teal-600 border border-teal-300 rounded-3xl px-6 py-2 hover:bg-teal-100 cursor-pointer font-semibold hover:underline"
          >
            Explore More
          </button>
        </div>
      ) : (
        <>
          {/* Feature 4: Discussions */}
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-20">
            <div className="w-full md:w-1/2 relative order-1 md:order-1">
              <img
                src={meet}
                alt="Discussions"
                className="w-full max-w-md mx-auto h-auto md:w-[500px] md:h-[375px] md:pr-[50px] rounded-xl pb-4 md:pb-2 relative z-10"
              />
              {/* Floating Bubbles */}
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full top-1/2 md:top-50 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-green-700 rounded-full top-1/12 md:top-1 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full top-1/3 md:top-1/3 right-1/5 md:right-20 animate-float delay-200"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 right-1/6 md:right-10 animate-float delay-100"></span>
              <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-300 rounded-full top-1/6 md:top-10 left-1/6 md:left-10 animate-float delay-100"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full top-2/3 md:top-70 left-1/12 md:left-1 animate-float delay-100"></span>
              <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-1/6 md:bottom-10 left-1/6 md:left-10 animate-float delay-100"></span>
            </div>   <div className="w-full md:w-1/2 pt-8 md:pt-20 order-2 md:order-2">
              <div className="pb-8 lg:pb-20 text-center lg:text-left lg:pl-40">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Discussions <span className="text-teal-500">en tête-à-tête</span>.
                </h2>
              </div>
              <div className="space-y-6 px-4  md:px-0">
                <p className="text-gray-700 lg:pl-40 text-center md:text-justify leading-relaxed max-w-md mx-auto md:mx-0">
                  Les enseignants et les assistants pédagogiques peuvent discuter en privé avec les étudiants sans quitter l'environnement Zoom.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 5: Niveaux d'éducation */}
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row items-center gap-8 md:gap-20">
            <div className="w-full md:w-1/2 relative order-1 md:order-1">
              <img
                src={level}
                alt="Niveaux d'éducation"
                className="w-full max-w-md mx-auto h-auto lg:w-[500px]  lg:h-[375px] md:w-[400px] md:h-[275px] md:pr-[90px] rounded-xl pb-4 md:pb-2 relative z-10"
              />
              
              {/* Floating Bubbles */}
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full top-1/2 md:top-50 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-green-700 rounded-full top-1/12 md:top-1 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-2 h-2 md:w-3 md:h-3 bg-pink-400 rounded-full top-1/3 md:top-1/3 right-1/5 md:right-20 animate-float delay-200"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-300 rounded-full bottom-2/3 md:bottom-70 right-1/6 md:right-10 animate-float delay-100"></span>
              <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-300 rounded-full top-1/6 md:top-10 left-1/6 md:left-10 animate-float delay-100"></span>
              <span className="absolute w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full top-2/3 md:top-70 left-1/12 md:left-1 animate-float delay-100"></span>
              <span className="absolute w-2 h-2 md:w-2.5 md:h-2.5 bg-indigo-300 rounded-full top-1/6 md:top-10 right-1/4 md:right-[30%] animate-float delay-500"></span>

              {/* Icons */}
              <FaChalkboardTeacher className="absolute w-4 h-4 md:w-5 md:h-5 top-1/5 md:top-[20%] right-0 md:right-[-10px] animate-float delay-200 text-green-600" />
              <FaBookOpen className="absolute w-5 h-5 md:w-7 md:h-7 bottom-0 md:bottom-[-10px] left-1/4 md:left-[25%] animate-float delay-400 text-red-600" />
              <FaUsers className="absolute w-3 h-3 md:w-4 md:h-4 bottom-1/4 md:bottom-[25%] right-1/4 md:right-[150px] animate-float delay-600 text-pink-500" />
              <FaUserGraduate className="absolute w-4 h-4 md:w-5 md:h-5 top-1/3 md:top-[80px] left-1/4 md:left-[150px] animate-float delay-300 text-yellow-500" />
              <FaChalkboardTeacher className="absolute w-3 h-3 md:w-4 md:h-4 bottom-1/3 md:bottom-[80px] right-1/6 md:right-[80px] animate-float delay-100 text-red-400" />
              <FaBookOpen className="absolute w-4 h-4 md:w-5 md:h-5 top-1/4 md:top-[40px] right-1/4 md:right-[90px] animate-float delay-500 text-indigo-500" />
              <FaUsers className="absolute w-5 h-5 md:w-6 md:h-6 bottom-1/3 md:bottom-[70px] left-1/6 md:left-[80px] animate-float delay-700 text-teal-400" />
              <FaUserGraduate className="absolute w-3 h-3 md:w-4 md:h-4 top-1/2 md:top-[50%] right-1/4 md:right-[175px] animate-float delay-[800ms] text-orange-400" />
              <FaChalkboardTeacher className="absolute w-4 h-4 md:w-5 md:h-5 top-1/5 md:top-[20%] right-0 md:right-[-10px] animate-float delay-200 text-green-600" />
              <FaBookOpen className="absolute w-5 h-5 md:w-7 md:h-7 bottom-0 md:bottom-[-10px] left-1/4 md:left-[25%] animate-float delay-400 text-purple-600" />
              <FaUsers className="absolute w-3 h-3 md:w-4 md:h-4 bottom-1/4 md:bottom-[25%] left-1/12 md:left-[21px] animate-float delay-600 text-pink-500" />
              <FaBookOpen className="absolute w-4 h-4 md:w-5 md:h-5 bottom-1/12 md:bottom-[5px] left-1/4 md:left-[90px] animate-float delay-500 text-indigo-500" />
              <FaUsers className="absolute w-5 h-5 md:w-6 md:h-6 bottom-1/12 md:bottom-[10px] right-1/4 md:right-[200px] animate-float delay-700 text-teal-400" />
            </div>

            <div className="w-full md:w-1/2 pt-8 md:pt-20 order-2 md:order-2">
              <div className="pb-8 lg:pb-20 text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Cours pour chaque <span className="text-teal-500">niveau d'éducation</span>.
                </h2>
              </div>
              <div className="space-y-6 px-4 md:px-0">
                <p className="text-gray-700 text-center md:text-justify leading-relaxed max-w-md mx-auto md:mx-0">
                  Accédez à une large sélection de cours adaptés à tous les niveaux d'éducation, du fondamental au supérieur. Que vous soyez élève, étudiant ou en reconversion, trouvez les ressources qui répondent à vos besoins.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(false)}
              className="text-teal-600 border border-teal-300 rounded-3xl px-6 py-2 hover:bg-teal-100 cursor-pointer font-semibold hover:underline"
            >
              Show Less
            </button>
          </div>
        </>
      )}
    </section>

    </div>
  );
}
   
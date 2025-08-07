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
      icon: <LayoutGrid className="text-indigo-600 w-5 h-5" />,
      text: 'Les enseignants ne se perdent pas dans la vue en grille et disposent d’un espace Podium dédié.',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: <MonitorSmartphone className="text-orange-500 w-5 h-5" />,
      text: 'Les assistants et les présentateurs peuvent être placés à l’avant de la classe.',
      bgColor: 'bg-orange-100',
    },
    {
      icon: <Users2 className="text-purple-600 w-5 h-5" />,
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
            <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
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
  <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md bg-white">
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
  <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md bg-white">
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
<section className='py-16 px-6 md:px-20 pt-30 bg-white'>
  
  <h2 className="text-3xl font-bold pb-10 text-gray-800">
        Nos  <span className="text-teal-500">Fonctionnalités.</span></h2>
        <p className='text-center text-gray-500 mb-16'>Cette fonctionnalité exceptionnelle peut rendre les activités d’apprentissage plus efficaces."</p>
        <div className="mb-20 flex flex-col md:flex-row items-center gap-20">
  
  <div className="md:w-1/2">
    <img src={call} alt="Feature" className="w-full rounded-xl" />
    
  </div>

  
  <div className="md:w-1/2 pt-20">
  <div className='pb-20'>
    <h2 className="text-3xl font-bold text-gray-800 pr-30">
        Une <span className="text-teal-500">interface utilisateur </span><h2 className="text-3xl font-bold text-gray-800">conçue pour la salle de classe.</h2></h2>
        </div>
   <div className="space-y-6">
      {classfeatures.map((feature, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className={`rounded-full p-2 ${feature.bgColor}`}>
            {feature.icon}
          </div>
          <p className="text-gray-700  leading-relaxed max-w-md pr-10 pb-10">{feature.text}</p>
        </div>
      ))}
      
    </div>
  </div>
</div>
        <div className="mb-20 flex flex-col md:flex-row-reverse items-center gap-1">
  
 <div className="md:w-1/2 relative">
  {/* Image */}
  <img
    src={featimg}
    alt="Feature"
    className="w-[500px] h-[675px] pr-[50px] rounded-xl pb-20 relative z-10"
  />

  {/* Floating Bubbles */}
  <span className="absolute w-4 h-4 bg-blue-400 rounded-full top-50 left-1/2 animate-float delay-0"></span>
  <span className="absolute w-4 h-4 bg-green-700 rounded-full top-20 left-1/2 animate-float delay-0"></span>
  <span className="absolute w-3 h-3 bg-pink-400 rounded-full top-1/3 right-50 animate-float delay-200"></span>
  <span className="absolute w-5 h-5 bg-purple-400 rounded-full bottom-5 left-1/4 animate-float delay-400"></span>
  <span className="absolute w-2 h-2 bg-green-300 rounded-full bottom-1/4 right-1/3 animate-float delay-600"></span>
  <span className="absolute w-3 h-3 bg-yellow-400 rounded-full top-50 left-20 animate-float delay-300"></span>
  <span className="absolute w-4 h-4 bg-red-800 rounded-full bottom-5 right-50 animate-float delay-100"></span>
  
  <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 right-40 animate-float delay-100"></span>
  <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>
  <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 left-40 animate-float delay-100"></span>
  <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 left-[30%] animate-float delay-500"></span>
  
  <span className="absolute w-3.5 h-3.5 bg-teal-400 rounded-full bottom-[10%] left-[10%] animate-float delay-700"></span>
  <span className="absolute w-3 h-3 bg-red-400 rounded-full top-40 left-40 animate-float delay-300"></span>
  <span className="absolute w-2 h-2 bg-orange-300 rounded-full top-[50%] right-[10%] animate-float delay-[800ms]"></span>
   <FaReact className="absolute w-5 h-5 top-[-10px] left-[50%] animate-float delay-0 text-blue-500" />
  <FaNodeJs className="absolute w-6 h-6 top-[20%] right-[-10px] animate-float delay-200 text-green-600" />
  <FaPython className="absolute w-5 h-5 bottom-[-10px] left-[25%] animate-float delay-400 text-yellow-500" />
   <FaUserGraduate className="absolute w-6 h-6 top-[-10px] left-[50%] animate-float delay-0 text-blue-500" />
      <FaChalkboardTeacher className="absolute w-5 h-5 top-[20%] right-[-10px] animate-float delay-200 text-green-600" />
      <FaBookOpen className="absolute w-7 h-7 bottom-[-10px] left-[25%] animate-float delay-400 text-purple-600" />
      <FaUsers className="absolute w-4 h-4 bottom-[25%] right-[-10px] animate-float delay-600 text-pink-500" />
      <FaUserGraduate className="absolute w-5 h-5 top-[10px] left-[10px] animate-float delay-300 text-yellow-500" />
      <FaChalkboardTeacher className="absolute w-4 h-4 bottom-[10px] right-[10px] animate-float delay-100 text-red-400" />
      <FaBookOpen className="absolute w-5 h-5 top-[40px] right-[90px] animate-float delay-500 text-indigo-500" />
      <FaUsers className="absolute w-6 h-6 bottom-[40px] left-[40px] animate-float delay-700 text-teal-400" />
      <FaUserGraduate className="absolute w-4 h-4 top-[50%] right-[20px] animate-float delay-[800ms] text-orange-400" />
</div>


  
  <div className="md:w-1/2 pt-20">
  <div className='pb-20 '>
    <h2 className="text-3xl font-bold text-justify break-words text-gray-800 pl-40">
         <span className="text-teal-500">Outils  pour </span><h2 className="text-3xl font-bold text-gray-800">enseignants et apprenants.</h2></h2>
        </div>
   <div className="space-y-6 pl-40">
      
          <p className="text-gray-700 text-justify break-words  leading-relaxed max-w-md pr-10 pb-10">Class dispose d’un ensemble dynamique d’outils pédagogiques conçus pour être utilisés en temps réel pendant les cours. Les enseignants peuvent distribuer des devoirs en direct que les élèves complètent et soumettent immédiatement. </p>
        
      
    </div>
  </div>
</div>

 <div className="mb-20 flex flex-col md:flex-row items-center gap-20">
  
  <div className="md:w-1/2 relative">
  {/* Image */}
  <img
    src={quizz}
    alt="Feature"
    className="w-[500px] h-[375px] pr-[50px] rounded-xl pb-2 relative z-10"
  />

  {/* Floating Bubbles */}
  <span className="absolute w-4 h-4 bg-blue-400 rounded-full top-50 left-1/2 animate-float delay-0"></span>
  <span className="absolute w-4 h-4 bg-green-700 rounded-full top-20 left-1/2 animate-float delay-0"></span>
  <span className="absolute w-3 h-3 bg-pink-400 rounded-full top-1/3 right-20 animate-float delay-200"></span>
  <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 right-10 animate-float delay-100"></span>
  <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>
  <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 left-40 animate-float delay-100"></span>
  </div>

  
  <div className="md:w-1/2 pt-20 ">
  <div className='pb-20 '>
    <h2 className="text-3xl font-bold text-gray-800 pr-30">
        Évaluations, <span className="text-teal-500"> Quiz </span><h2 className="text-3xl font-bold text-gray-800">, Tests.</h2></h2>
        </div>
   <div className="space-y-6">
      
          <p className="text-gray-700 text-justify break-words  leading-relaxed max-w-md pr-10 pb-20">Lancez facilement des devoirs, quiz et tests en direct.
Les résultats des étudiants sont automatiquement enregistrés dans le carnet de notes en ligne.</p>
      
      
    </div>
  </div>
  
</div>
{!showAll && (
        <div className="text-center  mb-10 pt-10">
          <button
            onClick={() => setShowAll(true)}
            className="text-teal-600 border border-teal-300 rounded-3xl h-10 w-50 hover:bg-teal-100 cursor-pointer font-semibold hover:underline"
          >
            Explore More
          </button>
        </div>
      )}

      {showAll && (
        <>
          <div className="mb-20 flex flex-col md:flex-row-reverse items-center gap-20">
            <div className="md:w-1/2 relative">
              <img
                src={meet}
                alt="Feature"
                className="w-[500px] h-[375px] pr-[50px] rounded-xl pb-2 relative z-10"
              />
              {/* Floating Bubbles */}
              <span className="absolute w-4 h-4 bg-blue-400 rounded-full top-50 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-4 h-4 bg-green-700 rounded-full top-1 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-3 h-3 bg-pink-400 rounded-full top-1/3 right-20 animate-float delay-200"></span>
              <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 right-10 animate-float delay-100"></span>
              <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>
              <span className="absolute w-4 h-4 bg-blue-300 rounded-full top-10 left-10 animate-float delay-100"></span>
              <span className="absolute w-4 h-4 bg-red-500 rounded-full top-70 left-1 animate-float delay-100"></span>
              <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>
              <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-10 left-10 animate-float delay-100"></span>
            </div>

            <div className="md:w-1/2 pt-20">
              <div className="pb-20 text-justify break-words">
                <h2 className="text-3xl font-bold text-gray-800 pr-30">
                  Discussions <span className="text-teal-500"> en tête-à-tête </span>.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 text-justify break-words leading-relaxed max-w-md pr-10 pb-20">
                  Les enseignants et les assistants pédagogiques peuvent discuter en privé avec les étudiants sans quitter l’environnement Zoom.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-20 flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2 relative">
              <img
                src={level}
                alt="Feature"
                className="w-[500px] h-[375px] pr-[50px] rounded-xl pb-2 relative z-10"
              />
              {/* Floating Bubbles + Icons */}
              <span className="absolute w-4 h-4 bg-blue-400 rounded-full top-50 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-4 h-4 bg-green-700 rounded-full top-1 left-1/2 animate-float delay-0"></span>
              <span className="absolute w-3 h-3 bg-pink-400 rounded-full top-1/3 right-20 animate-float delay-200"></span>
              <span className="absolute w-4 h-4 bg-red-300 rounded-full bottom-70 right-10 animate-float delay-100"></span>
              <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>
              <span className="absolute w-4 h-4 bg-blue-300 rounded-full top-10 left-10 animate-float delay-100"></span>
              <span className="absolute w-4 h-4 bg-red-500 rounded-full top-70 left-1 animate-float delay-100"></span>
              <span className="absolute w-2.5 h-2.5 bg-indigo-300 rounded-full top-10 right-[30%] animate-float delay-500"></span>

              <FaChalkboardTeacher className="absolute w-5 h-5 top-[20%] right-[-10px] animate-float delay-200 text-green-600" />
              <FaBookOpen className="absolute w-7 h-7 bottom-[-10px] left-[25%] animate-float delay-400 text-red-600" />
              <FaUsers className="absolute w-4 h-4 bottom-[25%] right-[150px] animate-float delay-600 text-pink-500" />
              <FaUserGraduate className="absolute w-5 h-5 top-[80px] left-[150px] animate-float delay-300 text-yellow-500" />
              <FaChalkboardTeacher className="absolute w-4 h-4 bottom-[80px] right-[80px] animate-float delay-100 text-red-400" />
              <FaBookOpen className="absolute w-5 h-5 top-[40px] right-[90px] animate-float delay-500 text-indigo-500" />
              <FaUsers className="absolute w-6 h-6 bottom-[70px] left-[80px] animate-float delay-700 text-teal-400" />
              <FaUserGraduate className="absolute w-4 h-4 top-[50%] right-[175px] animate-float delay-[800ms] text-orange-400" />
              <FaChalkboardTeacher className="absolute w-5 h-5 top-[20%] right-[-10px] animate-float delay-200 text-green-600" />
              <FaBookOpen className="absolute w-7 h-7 bottom-[-10px] left-[25%] animate-float delay-400 text-purple-600" />
              <FaUsers className="absolute w-4 h-4 bottom-[25%] left-[21px] animate-float delay-600 text-pink-500" />
              <FaBookOpen className="absolute w-5 h-5 bottom-[5px] left-[90px] animate-float delay-500 text-indigo-500" />
              <FaUsers className="absolute w-6 h-6 bottom-[10px] right-[200px] animate-float delay-700 text-teal-400" />
            </div>

            <div className="md:w-1/2 pt-20">
              <div className="pb-20">
                <h2 className="text-3xl font-bold text-gray-800 pr-40">
                  Cours pour chaque <span className="text-teal-500">niveau d'éducation</span>.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 text-justify break-words leading-relaxed max-w-md pr-10 pb-20">
                  Accédez à une large sélection de cours adaptés à tous les niveaux d'éducation, du fondamental au supérieur. Que vous soyez élève, étudiant ou en reconversion, trouvez les ressources qui répondent à vos besoins.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
  <button
    onClick={() => setShowAll(false)}
    className="text-teal-600 border border-teal-300 rounded-3xl h-10 w-50 hover:bg-teal-100 cursor-pointer font-semibold hover:underline"
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

import React from "react";
import { Link } from "react-router-dom";

import meeting from '../assets/business-video-call-laptop_23-2148667505.avif'
import cellule from '../assets/mitose.jpg'
import mutatuion from '../assets/1-fnx-svt-c04-img01.png'
import ecosystem from '../assets/Roue des services écosystémiques WWF.png'
import replication from '../assets/maxresdefault.jpg'
const LatestCourses = () => {
  const latestMeeting = {
    title: "Réunion: Comprendre la biodiversité : cours sur les mécanismes de l’évolution et l’organisation du vivant",
    description:
      "Lors de cette réunion dédiée au programme de SVT de 2ᵉ année (classe de Seconde), nous présenterons un cours approfondi sur « La Terre, la vie et l’organisation du vivant », en particulier les mécanismes de l’évolution, la biodiversité à différentes échelles (écosystèmes, espèces, individus) et la spécialisation cellulaire.Ce cours permettra aux élèves de comprendre comment la science construit, à partir d'observations rigoureuses, une explication cohérente du vivant et de son histoire.",
    tag: "NEWS",
    image: "https://images.unsplash.com/photo-1587613755375-4d1b7ac5d5b4", // Replace with your meeting image
  };

  const latestCourses = [
  {
    tag: "NEWS",
    title: "Les divisions cellulaires chez les eucaryotes",
    description: "Explore les mécanismes de la mitose et de la méiose, comprenez comment se duplique le matériel génétique et comment les chromosomes sont répartis entre cellules filles.",
    image: cellule,
  },
  {
    tag: "NEWS",
    title: "La réplication de l’ADN",
    description: "Étudiez le processus semi-conservatif de duplication de l’ADN durant la phase S du cycle cellulaire, ainsi que les enzymes impliquées (ex. ADN polymérase).",
    image: replication,
  },
  {
    tag: "NEWS",
    title: "Mutations de l’ADN et variabilité génétique",
    description: "Plongez dans les causes des mutations (erreurs, agents mutagènes), leur transmission, l’origine de la diversité allélique, et l’impact sur le phénotype.",
    image: mutatuion,
  },
  {
    tag: "NEWS",
    title: "Écosystèmes et services environnementaux",
    description: "Étudiez les interactions entre êtres vivants et leur milieu, les fonctions écologiques des écosystèmes, et l’importance de leur gestion durable.",
    image: ecosystem,

  },
];

  return (
    <div className="max-w-7xl pt-40 mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-900">
        Dernières nouvelles et ressources
      </h2>
      <p className="text-center text-gray-500 mb-10">
        Découvrez les tout derniers cours ajoutés à SVT et enrichissez vos connaissances grâce à des contenus récents, pertinents et adaptés à vos besoins.
      </p>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left Side - Latest Meeting */}
  <Link to="/meetings" className="bg-white rounded-lg shadow p-4 block hover:shadow-md transition">
    <img
      src={meeting}
      alt="Meeting"
      className="rounded-lg w-full h-56 object-cover mb-4"
    />
    <span className="inline-block bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
      {latestMeeting.tag}
    </span>
    <h3 className="text-lg font-semibold mb-2">{latestMeeting.title}</h3>
    <p className="text-sm text-gray-600 mb-2">{latestMeeting.description}</p>
  </Link>

  {/* Right Side - Latest Courses */}
  <div className="space-y-4">
    {latestCourses.map((course, idx) => (
      <Link
        key={idx}
        to={`/course/${encodeURIComponent(course.title)}`}
        className="block transform transition hover:scale-105"
      >
        <div className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow">
          <img
            src={course.image}
            alt={course.title}
            className="w-20 h-20 rounded object-cover"
          />
          <div>
            <span className="inline-block text-xs text-white font-semibold px-2 py-1 rounded-full bg-indigo-400 mb-1">
              {course.tag}
            </span>
            <h4 className="font-semibold text-sm">{course.title}</h4>
            <p className="text-xs text-gray-600">{course.description}</p>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>
    </div>
  );
};

export default LatestCourses;

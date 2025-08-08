import React, { useRef, useState} from 'react';

const ExploreCourses = ({ courses }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const scrollRef = useRef(null);
  const [expandedText, setExpandedText] = useState({});

  const toggleText = (index) => {
    setExpandedText(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleInteraction = (index) => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      setHoveredIndex(index);
    } else {
      setClickedIndex(clickedIndex === index ? null : index);
    }
  };

  return (
    <div className="relative bg-gray-200">
      <div ref={scrollRef} className="flex items-center px-4 md:px-20 gap-2 md:gap-4 overflow-x-auto scrollbar-hide py-4 md:py-6">
        {courses.map((course, index) => {
          const isActive = window.innerWidth >= 1024 ? hoveredIndex === index : clickedIndex === index;
          const isExpanded = expandedText[index];

          return (
            <div
              key={course.id}
              onClick={() => handleInteraction(index)}
              onMouseEnter={() => window.innerWidth >= 1024 && setHoveredIndex(index)}
              onMouseLeave={() => window.innerWidth >= 1024 && setHoveredIndex(null)}
              className={`transition-all duration-300 relative flex-shrink-0 cursor-pointer ${
                isActive ? 'z-20 scale-100' : 'scale-90 z-10'
              }`}
            >
              {isActive ? (
                <div className="w-48 md:w-64 h-72 md:h-80 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 bg-white flex flex-col">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h2>
                    
                    {/* Scrollable content area */}
                    <div className="flex-1 mb-2 relative">
                      <div 
                        className={`${isExpanded ? 'h-[70px] overflow-y-auto pr-2' : 'h-[40px] overflow-hidden'} transition-all duration-300`}
                      >
                        <p className="text-sm text-gray-600">
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                      </div>
                      {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
                      )}
                    </div>

                    {/* Fixed bottom content */}
                    <div className="mt-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleText(index);
                        }}
                        className="text-xs text-[#36B3BD] hover:underline block mb-2"
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </button>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-md font-bold text-[#36B3BD]">{course.price}</span>
                        <button className="px-4 py-2 text-sm bg-[#36B3BD] text-white rounded-full hover:bg-[#2a9ba4] transition">
                          Enroll now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-20 md:w-24 h-72 md:h-80 bg-gradient-to-b ${course.color} rounded-xl flex items-center justify-center text-white font-semibold shadow-md transition-transform transform -rotate-6`}
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                  }}
                >
                  {course.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreCourses;

import React, { useState, useEffect } from "react";

const Face = ({ showOptions }) => {
  const [pupilPosition, setPupilPosition] = useState('center');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const positions = ['left', 'center', 'right'];
    const movePupils = setInterval(() => {
      setPupilPosition(positions[Math.floor(Math.random() * positions.length)]);
    }, 1000);

    return () => clearInterval(movePupils);
  }, []);

  useEffect(() => {
    console.log('Face animation state:', { showOptions, isClosing });
    if (showOptions) {
      setIsClosing(true);
      // Reset closing state after animation completes
      setTimeout(() => setIsClosing(false), 1500);
    }
  }, [showOptions]);

  // Return null only after animation completes
  if (showOptions && !isClosing) return null;

  const getPupilStyle = (side) => {
    const basePosition = side === 'left' ? 'right-[30px]' : 'left-[30px]';
    const positions = {
      left: side === 'left' ? 'right-[50px]' : 'left-[10px]',
      center: basePosition,
      right: side === 'left' ? 'right-[10px]' : 'left-[50px]'
    };
    return positions[pupilPosition];
  };

  if (isClosing || showOptions) {
    return (
      <div className="fixed inset-0 bg-[#ecd7a5] flex items-center justify-center z-10 animate-fadeOut">
        <div className="face relative w-screen h-screen flex justify-center items-center">
          <div className="eye left absolute left-1/4 top-78 w-[250px] h-[180px] bg-[#f5e5c0] 
            rounded-[50%_50%_60%_40%/50%_60%_40%_50%] overflow-hidden border-2 border-b-gray-500 animate-closeEyes">
            <div className={`pupil absolute top-[45px] ${getPupilStyle('left')} w-[120px] h-[120px] bg-black rounded-full transition-all duration-700`}>
              <div className="shine absolute top-5 right-2 w-[25px] h-[25px] bg-white rounded-full opacity-80"></div>
            </div>
          </div>

          <div className="eye right absolute right-1/4 top-78 w-[250px] h-[180px] bg-[#f5e5c0] 
            rounded-[50%_50%_40%_60%/60%_50%_50%_40%] overflow-hidden border-2 border-b-gray-500 animate-closeEyes">
            <div className={`pupil absolute top-[45px] ${getPupilStyle('right')} w-[120px] h-[120px] bg-black rounded-full transition-all duration-700`}>
              <div className="shine absolute top-5 left-2 w-[25px] h-[25px] bg-white rounded-full opacity-80"></div>
            </div>
          </div>

          <div className="mouth absolute top-2/3 left-1/2 w-[700px] h-[100px] border-b-4 border-black rounded-b-[100%] -translate-x-1/2"></div>
        </div>

        <style>{`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
          }

          @keyframes closeEyes {
            0% { height: 180px; }
            100% { height: 10px; }
          }

          .animate-fadeOut {
            animation: fadeOut 1.5s ease-out forwards;
          }

          .animate-closeEyes {
            animation: closeEyes 1.5s ease-in forwards;
          }

          @keyframes blink {
            0%, 96%, 100% { transform: scaleY(1); }
            97%, 99% { transform: scaleY(0.05); }
          }
          .eye { animation: blink 3s infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#ecd7a5] flex items-center justify-center z-50">
      <div className="face relative w-screen h-screen flex justify-center items-center">
        {/* Left eye - wider and more spaced */}
       <div className="eye left absolute left-1/4 top-78 w-[250px] h-[180px] bg-[#f5e5c0] 
  rounded-[50%_50%_60%_40%/50%_60%_40%_50%] overflow-hidden border-2 border-b-gray-500">
  <div className={`pupil absolute top-[45px] ${getPupilStyle('left')} w-[120px] h-[120px] bg-black rounded-full transition-all duration-700`}>
    <div className="shine absolute top-5 right-2 w-[25px] h-[25px] bg-white rounded-full opacity-80"></div>
  </div>
</div>


        {/* Right eye - wider and more spaced */}
      <div className="eye right absolute right-1/4 top-78 w-[250px] h-[180px] bg-[#f5e5c0] 
 rounded-[50%_50%_40%_60%/60%_50%_50%_40%] overflow-hidden border-2 border-b-gray-500">
  <div className={`pupil absolute top-[45px] ${getPupilStyle('right')} w-[120px] h-[120px] bg-black rounded-full transition-all duration-700`}>
    <div className="shine absolute top-5 left-2 w-[25px] h-[25px] bg-white rounded-full opacity-80"></div>
  </div>
</div>


        {/* Mouth - wider smile that spans between eyes */}
        <div className="mouth absolute top-2/3 left-1/2 w-[700px] h-[100px] border-b-4 border-black rounded-b-[100%] -translate-x-1/2"></div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.05); }
        }
        .eye { animation: blink 5s infinite; }
      `}</style>
    </div>
  );
};
export default Face;



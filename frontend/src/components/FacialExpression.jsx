import React, { useEffect, useState } from "react";

const FullscreenFace = ({ blinkInterval = 4500, pupilMoveInterval = 1200, isVisible = true }) => {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // random pupil movement
  useEffect(() => {
    const positions = [
      { x: 0, y: 0 },
      { x: -6, y: 0 },
      { x: 6, y: 0 },
      { x: -3, y: -4 },
      { x: 3, y: -4 },
      { x: 0, y: 4 },
    ];
    const id = setInterval(() => {
      const next = positions[Math.floor(Math.random() * positions.length)];
      setPupilOffset(next);
    }, pupilMoveInterval);
    return () => clearInterval(id);
  }, [pupilMoveInterval]);

  // blinking logic
  useEffect(() => {
    const blinkLoop = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, blinkInterval + Math.random() * 1500);
    return () => clearInterval(blinkLoop);
  }, [blinkInterval]);

  // CSS for mouth talking animation (slow, smooth)
  const svgStyles = `
    @keyframes slowTalk {
      0%   { transform: translateY(0px) scaleY(1); }
      25%  { transform: translateY(2px) scaleY(0.9); }
      50%  { transform: translateY(4px) scaleY(0.75); }
      75%  { transform: translateY(2px) scaleY(0.9); }
      100% { transform: translateY(0px) scaleY(1); }
    }
    .mouth-talk {
      animation: slowTalk 1.0s ease-in-out infinite;
      transform-origin: 160px 238px; /* center of mouth region */
    }
  `;

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-[#7bb3e0] transition-opacity duration-500 
      ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <style>{svgStyles}</style>

      <svg
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="w-screen h-screen"
      >
        <defs>
          <radialGradient id="irisShadow" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          <clipPath id="eyeLeft">
            <ellipse cx="60" cy="140" rx="54" ry="66" />
          </clipPath>
          <clipPath id="eyeRight">
            <ellipse cx="260" cy="140" rx="54" ry="66" />
          </clipPath>

          <filter id="cheekBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {/* Eyebrows */}
        <path
          d="M42 48c8 -12 36 -18 50 -10"
          stroke="#2f4952"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M278 48c-8 -12 -36 -18 -50 -10"
          stroke="#2f4952"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left Eye */}
        <g clipPath="url(#eyeLeft)">
          <ellipse cx="60" cy="140" rx="54" ry="66" fill="#fff" stroke="#2f4952" strokeWidth="8" />
          <g
            transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
            style={{ transition: "transform 0.5s ease" }}
          >
            <ellipse cx="60" cy="150" rx="30" ry="40" fill="#1e1e1e" />
            <circle cx="68" cy="122" r="9" fill="#fff" opacity="0.95" />
            <circle cx="58" cy="129" r="3.5" fill="#fff" opacity="0.65" />
          </g>
          <ellipse cx="60" cy="160" rx="44" ry="56" fill="url(#irisShadow)" opacity="0.5" />

          {/* Eyelid */}
          <rect
            x="13"
            y="-11"
            width="95"
            height="120"
            rx="54"
            ry="66"
            fill="#2f4952"
            transform={`translate(0, ${isBlinking ? 90 : -90}) scale(1, ${isBlinking ? 1 : 0})`}
            style={{
              transformOrigin: "60px 140px",
              transition: "transform 140ms ease-in-out",
            }}
            opacity={isBlinking ? 1 : 0.98}
          />
        </g>

        {/* Right Eye */}
        <g clipPath="url(#eyeRight)">
          <ellipse cx="260" cy="140" rx="54" ry="66" fill="#fff" stroke="#2f4952" strokeWidth="8" />
          <g
            transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
            style={{ transition: "transform 0.5s ease" }}
          >
            <ellipse cx="260" cy="150" rx="30" ry="40" fill="#1e1e1e" />
            <circle cx="268" cy="122" r="9" fill="#fff" opacity="0.95" />
            <circle cx="258" cy="129" r="3.5" fill="#fff" opacity="0.65" />
          </g>
          <ellipse cx="260" cy="160" rx="44" ry="56" fill="url(#irisShadow)" opacity="0.5" />

          {/* Eyelid */}
          <rect
            x="206"
            y="-11"
            width="95"
            height="120"
            rx="54"
            ry="66"
            fill="#2f4952"
            transform={`translate(0, ${isBlinking ? 90 : -90}) scale(1, ${isBlinking ? 1 : 0})`}
            style={{
              transformOrigin: "260px 140px",
              transition: "transform 140ms ease-in-out",
            }}
            opacity={isBlinking ? 1 : 0.98}
          />
        </g>

        {/* Cheeks */}
        <circle cx="0" cy="228" r="28" fill="#ffb59b" />
        <circle cx="320" cy="228" r="28" fill="#ffb59b" />

        {/* Croissant / crescent mouth (animated) */}
       <svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      className="mouth translate-y-45 translate-x-15"
    >
      {/* Outer dark croissant mouth */}
      <path
       d="M40 55
           Q100 100 160 55
           Q100 150 40 55 Z"
        fill="#263238"
      />

      {/* White teeth area */}
      <path
        d="M40 55
           Q100 100 160 55
           Q100 70 40 55 Z"
        fill="#ffffff"
      />

      {/* Tongue (bottom orange part) */}
      <path
    d="M60 70
       Q100 110 140 70
       Q100 60 60 70 Z"
    fill="#ff8b56"
     transform="translate(0, 12)" 
  />
      <style>{`
       
        @keyframes talk {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.6);
          }
        }
      `}</style>
    </svg>
      </svg>
    </div>
  );
};

export default FullscreenFace;

import { useState, useEffect } from 'react';
import './ScreenEyesAnimation.css'; // Updated import path

export default function ScreenEyesAnimation() {
  const [eyeState, setEyeState] = useState({
    isClosed: false,
    isWide: false,
    lookDirection: 'center'
  });

  useEffect(() => {
    // Blinking animation
    const blinkInterval = setInterval(() => {
      setEyeState(prev => ({ ...prev, isClosed: true }));
      setTimeout(() => {
        setEyeState(prev => ({ ...prev, isClosed: false }));
      }, 200);
    }, 4000);

    // Looking around animation
    const lookInterval = setInterval(() => {
      const directions = ['left', 'center', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      setEyeState(prev => ({ ...prev, lookDirection: randomDirection }));
    }, 3000);

    // Wide eyes animation
    const wideInterval = setInterval(() => {
      setEyeState(prev => ({ ...prev, isWide: !prev.isWide }));
      setTimeout(() => {
        setEyeState(prev => ({ ...prev, isWide: false }));
      }, 500);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(lookInterval);
      clearInterval(wideInterval);
    };
  }, []);

  return (
    <div className="eyes-container">
      <div className={`eye ${eyeState.lookDirection} ${eyeState.isWide ? 'wide' : ''} ${eyeState.isClosed ? 'closed' : ''}`}>
        <div className="pupil" />
      </div>
      <div className={`eye ${eyeState.lookDirection} ${eyeState.isWide ? 'wide' : ''} ${eyeState.isClosed ? 'closed' : ''}`}>
        <div className="pupil" />
      </div>
    </div>
  );
}

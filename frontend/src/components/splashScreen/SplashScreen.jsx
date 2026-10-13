import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show for 4 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-container ${isLoading ? 'show' : 'hide'}`}>
      {/* Background particle animation */}
      <div className="particle-background">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Content with glitch and parallax effects */}
      <div className="splash-content">
        <h1 className="glitch-text" data-text="FITNESS PRO">FITNESS PRO</h1>
        <p className="slogan">TRANSFORM YOUR BODY</p>
      </div>
    </div>
  );
};

export default SplashScreen;

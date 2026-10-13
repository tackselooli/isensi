import React from 'react';

const Hero = ({ image, title, description, buttonText, buttonText2 }) => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay with a gradient to enhance text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black opacity-80"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-screen px-6 md:px-16 lg:px-24 text-white">
        {/* Title & Subtitle */}
        <div className="space-y-2 md:space-y-4">
          <p className="text-2xl md:text-4xl font-light animate-fadeIn text-shadow">
            {title}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-slideUp text-shadow">
            {title}
          </h1>
        </div>

        {/* Description */}
        <div className="max-w-lg mt-4 md:mt-6 animate-fadeIn text-shadow">
          <p className="text-lg md:text-xl font-light">{description}</p>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-4">
          <a
            href="#"
            className="inline-block px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-medium bg-gradient-to-r from-blue-500 to-teal-400 hover:from-teal-400 hover:to-blue-500 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            {buttonText}
          </a>
          <a
            href="#"
            className="inline-block px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-medium bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-500 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            {buttonText2}
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-12 md:h-16 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default Hero;

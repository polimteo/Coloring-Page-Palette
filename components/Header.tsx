
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
        Coloring Page <span className="text-indigo-600">Paletter</span>
      </h1>
      <p className="mt-2 text-md md:text-lg text-gray-500 max-w-2xl mx-auto">
        Let AI inspire your next masterpiece. Upload a coloring page to discover beautiful color palettes and see them in action.
      </p>
    </header>
  );
};

export default Header;

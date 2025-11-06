import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Color Palette Generator</h1>
          <p className="text-gray-600 mt-1">Upload coloring pages and bring them to life with AI-generated color palettes</p>
        </div>
      </div>
    </header>
  );
};

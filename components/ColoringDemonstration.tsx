import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ColoringDemonstrationProps {
  originalImage: string;
  coloredImage: string | null;
  isColoring: boolean;
  onTryAgain: () => void;
  onDownload: () => void;
  paletteSelected: boolean;
}

const ImageCard: React.FC<{ src: string; title: string; isLoading?: boolean; children?: React.ReactNode }> = ({ src, title, isLoading, children }) => (
    <div className="w-full flex-1 min-w-[280px]">
        <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">{title}</h3>
        <div className="relative aspect-square bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
            <img src={src} alt={title} className="max-w-full max-h-full object-contain"/>
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    </div>
);


const ColoringDemonstration: React.FC<ColoringDemonstrationProps> = ({ originalImage, coloredImage, isColoring, onTryAgain, onDownload, paletteSelected }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8">
        <ImageCard src={originalImage} title="Original" />
        {coloredImage ? (
            <div className="w-full flex-1 min-w-[280px]">
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">AI Colored</h3>
                <div className="relative aspect-square bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                    <img src={coloredImage} alt="AI Colored" className="max-w-full max-h-full object-contain"/>
                    {isColoring && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <LoadingSpinner message="Recoloring..." />
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-center items-center gap-4">
                    <button
                        onClick={onTryAgain}
                        disabled={isColoring}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Try coloring again"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span>Recolor</span>
                    </button>
                    <button
                        onClick={onDownload}
                        disabled={isColoring || !coloredImage}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Download colored image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Download</span>
                    </button>
                </div>
            </div>
        ) : (
             <div className="w-full flex-1 min-w-[280px]">
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">AI Colored</h3>
                <div className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-inner overflow-hidden flex items-center justify-center">
                    {isColoring ? (
                         <LoadingSpinner message="Coloring..." />
                    ) : (
                         <div className="text-center text-gray-500 px-4">
                            {paletteSelected ? (
                              <p>Ready to go! Press "Color My Image" on the left.</p>
                            ) : (
                              <p>Select a palette on the left to get started.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ColoringDemonstration;

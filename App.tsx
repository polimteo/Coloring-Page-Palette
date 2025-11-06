import React, { useState, useCallback } from 'react';
import { ColorPalette, UploadedImage } from './types';
import { generateColorPalettes, colorImageWithPalette } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ColorPaletteDisplay from './components/ColorPaletteDisplay';
import ColoringDemonstration from './components/ColoringDemonstration';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [coloredImage, setColoredImage] = useState<string | null>(null);
  const [withTextures, setWithTextures] = useState(false);
  
  const [isLoadingPalettes, setIsLoadingPalettes] = useState(false);
  const [isRegeneratingPalettes, setIsRegeneratingPalettes] = useState(false);
  const [isColoring, setIsColoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setOriginalImage(null);
    setPalettes([]);
    setSelectedPalette(null);
    setColoredImage(null);
    setWithTextures(false);
    setIsLoadingPalettes(false);
    setIsRegeneratingPalettes(false);
    setIsColoring(false);
    setError(null);
  };

  const handleImageUpload = useCallback(async (image: UploadedImage) => {
    resetState();
    setOriginalImage(image);
    setIsLoadingPalettes(true);
    setError(null);

    try {
      const generatedPalettes = await generateColorPalettes({
        base64: image.base64,
        mimeType: image.file.type,
      });
      setPalettes(generatedPalettes);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't generate color palettes for this image. Please try another one.");
    } finally {
      setIsLoadingPalettes(false);
    }
  }, []);
  
  const handleRegeneratePalettes = useCallback(async () => {
    if (!originalImage) return;

    setIsRegeneratingPalettes(true);
    setError(null);
    setSelectedPalette(null); // Reset selection
    setColoredImage(null); // Reset colored image

    try {
      const generatedPalettes = await generateColorPalettes({
        base64: originalImage.base64,
        mimeType: originalImage.file.type,
      });
      setPalettes(generatedPalettes);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't generate new palettes. Please try again.");
    } finally {
      setIsRegeneratingPalettes(false);
    }
  }, [originalImage]);


  const handleColoring = useCallback(async () => {
    if (!selectedPalette || !originalImage) {
      return;
    }

    setIsColoring(true);
    setError(null);
    try {
      const newColoredImage = await colorImageWithPalette(
        {
          base64: originalImage.base64,
          mimeType: originalImage.file.type,
        },
        selectedPalette,
        { blending: true, shadows: true, highlights: true, textures: withTextures }
      );
      setColoredImage(newColoredImage);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't color the image. Please try again.");
    } finally {
      setIsColoring(false);
    }
  }, [originalImage, selectedPalette, withTextures]);

  const handlePaletteSelect = (palette: ColorPalette) => {
    if (isColoring || isRegeneratingPalettes) return;
    if (selectedPalette?.name !== palette.name) {
      setColoredImage(null);
      setSelectedPalette(palette);
    }
  };
  
  const handleDownload = useCallback(() => {
    if (!coloredImage || !originalImage) return;

    const link = document.createElement('a');
    link.href = coloredImage;
    
    const mimeType = coloredImage.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1];
    const originalFileName = originalImage.file.name;
    const nameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    link.download = `${nameWithoutExtension}-colored.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [coloredImage, originalImage]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!originalImage && (
          <div className="text-center">
            <ImageUploader onImageUpload={handleImageUpload} disabled={isLoadingPalettes} />
          </div>
        )}

        {isLoadingPalettes && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner message="Analyzing your image and crafting palettes..." />
          </div>
        )}

        {error && (
            <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
                <p>{error}</p>
                <button onClick={resetState} className="mt-2 text-sm font-semibold text-red-800 underline">Start Over</button>
            </div>
        )}

        {originalImage && !isLoadingPalettes && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Controls */}
            <aside className="lg:col-span-1 flex flex-col gap-10">
              {/* Step 1 */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">1. Choose a Palette</h2>
                <p className="text-gray-600 mb-4">Select a style to bring your image to life.</p>
                <div className="grid grid-cols-1 gap-4">
                  {palettes.map((palette, index) => (
                    <ColorPaletteDisplay
                      key={index}
                      palette={palette}
                      onSelect={() => handlePaletteSelect(palette)}
                      isSelected={selectedPalette?.name === palette.name}
                      disabled={isColoring || isRegeneratingPalettes}
                    />
                  ))}
                </div>
                 <div className="mt-4">
                  <button
                      onClick={handleRegeneratePalettes}
                      disabled={isColoring || isLoadingPalettes || isRegeneratingPalettes}
                      className="w-full px-3 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      title="Get a new set of palettes"
                  >
                    {isRegeneratingPalettes ? (
                      <>
                          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Swapping...</span>
                      </>
                    ) : (
                      <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          <span>Swap Palettes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Step 2 */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">2. Fine-Tune Style</h2>
                <p className="text-gray-600 mb-4">Optionally add more detail for a richer result.</p>
                <div className="flex justify-center items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <label htmlFor="textures-toggle" className={`flex items-center w-full ${isColoring || !selectedPalette ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="textures-toggle"
                                className="sr-only peer"
                                checked={withTextures}
                                onChange={() => setWithTextures(!withTextures)}
                                disabled={isColoring || !selectedPalette}
                            />
                            <div className="block bg-gray-200 w-14 h-8 rounded-full peer-checked:bg-indigo-200 transition"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-full peer-checked:bg-indigo-600"></div>
                        </div>
                        <div className={`ml-3 text-gray-700 font-medium flex-1 ${isColoring || !selectedPalette ? 'opacity-50' : ''}`}>
                            Add Natural Textures
                        </div>
                    </label>
                </div>
                { !selectedPalette && <p className="text-xs text-gray-500 mt-2">Please select a palette first to enable this option.</p> }
              </div>

              {/* Step 3 */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">3. Color It!</h2>
                <p className="text-gray-600 mb-4">Ready to see your creation? Press the button below.</p>
                <button
                  onClick={handleColoring}
                  disabled={!selectedPalette || isColoring}
                  className="w-full px-8 py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isColoring ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Coloring...
                    </span>
                  ) : (
                    <span>Color My Image</span>
                  )}
                </button>
                {!selectedPalette && <p className="text-xs text-gray-500 mt-2">Please select a palette first to enable this button.</p>}
              </div>
              
              <div className="border-t border-gray-200 mt-auto pt-6">
                  <button 
                      onClick={resetState} 
                      className="w-full px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                      Upload Another Image
                  </button>
              </div>
            </aside>

            {/* Right Column: Image Display */}
            <section className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-center mb-4">Your Creation</h2>
                <ColoringDemonstration 
                  originalImage={originalImage.base64} 
                  coloredImage={coloredImage} 
                  isColoring={isColoring} 
                  onTryAgain={handleColoring}
                  onDownload={handleDownload}
                  paletteSelected={!!selectedPalette}
                />
            </section>
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-gray-400 border-t border-gray-200">
        <p>Powered by Google Gemini. Created with love for colorists everywhere.</p>
      </footer>
    </div>
  );
};

export default App;

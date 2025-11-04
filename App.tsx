import React, { useState, useCallback, useEffect } from 'react';
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
  const [isColoring, setIsColoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setOriginalImage(null);
    setPalettes([]);
    setSelectedPalette(null);
    setColoredImage(null);
    setWithTextures(false);
    setIsLoadingPalettes(false);
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

  useEffect(() => {
    if (selectedPalette && originalImage) {
      handleColoring();
    }
  }, [selectedPalette, originalImage, withTextures, handleColoring]);


  const handlePaletteSelect = (palette: ColorPalette) => {
    if (isColoring) return;
    setSelectedPalette(palette);
  };
  
  const handleDownload = useCallback(() => {
    if (!coloredImage || !originalImage) return;

    const link = document.createElement('a');
    link.href = coloredImage;
    
    // Create a filename based on the original, e.g., "my-drawing-colored.png"
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
          <>
            {/* STEP 1 */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-2">1. Choose a Palette</h2>
              <p className="text-center text-gray-600 mb-6">This is the first step to bring your image to life.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {palettes.map((palette, index) => (
                  <ColorPaletteDisplay
                    key={index}
                    palette={palette}
                    onSelect={() => handlePaletteSelect(palette)}
                    isSelected={selectedPalette?.name === palette.name}
                    disabled={isColoring}
                  />
                ))}
              </div>
            </div>
            
            {/* STEP 2 */}
            <div className="max-w-4xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-center mb-2">2. Fine-Tune Style</h2>
                <p className="text-center text-gray-600 mb-6">Optionally add more detail. The image will update automatically.</p>
                <div className="flex justify-center items-center p-4 bg-white rounded-lg border border-gray-200 max-w-sm mx-auto shadow-sm">
                    <label htmlFor="textures-toggle" className={`flex items-center ${isColoring || !selectedPalette ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
                        <div className={`ml-3 text-gray-700 font-medium ${isColoring || !selectedPalette ? 'opacity-50' : ''}`}>
                            Add Natural Textures & Patterns
                        </div>
                    </label>
                </div>
                { !selectedPalette && <p className="text-center text-xs text-gray-500 mt-2">Please select a palette first to enable this option.</p> }
            </div>

            {/* STEP 3 */}
            <div className="max-w-5xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-center mb-4">3. See the Result</h2>
                <ColoringDemonstration 
                  originalImage={originalImage.base64} 
                  coloredImage={coloredImage} 
                  isColoring={isColoring} 
                  onTryAgain={handleColoring}
                  onDownload={handleDownload}
                />
            </div>
            
            <div className="text-center mt-12">
                <button 
                    onClick={resetState} 
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Upload Another Image
                </button>
            </div>
          </>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-sm text-gray-400 border-t border-gray-200">
        <p>Powered by Google Gemini. Created with love for colorists everywhere.</p>
      </footer>
    </div>
  );
};

export default App;
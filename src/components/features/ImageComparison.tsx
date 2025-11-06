import React, { useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useImageColoring } from '../../hooks/index';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';

export const ImageComparison: React.FC = () => {
  const { state } = useAppContext();
  const { colorImage } = useImageColoring();

  const handleRecolor = useCallback(async () => {
    if (!state.selectedPalette) return;
    await colorImage(state.selectedPalette, {
      blending: true,
      shadows: true,
      highlights: true,
      textures: state.withTextures,
    });
  }, [state.selectedPalette, state.withTextures, colorImage]);

  const handleDownload = useCallback(() => {
    if (!state.coloredImage || !state.originalImage) return;

    const link = document.createElement('a');
    link.href = state.coloredImage;

    const mimeType = state.coloredImage.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1];
    const originalFileName = state.originalImage.file.name;
    const nameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    link.download = `${nameWithoutExtension}-colored.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.coloredImage, state.originalImage]);

  if (!state.originalImage) return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-4">Your Creation</h2>
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8">
        <div className="w-full flex-1 min-w-[280px]">
          <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">Original</h3>
          <div className="relative aspect-square bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
            <img src={state.originalImage.base64} alt="Original" className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        {state.coloredImage ? (
          <div className="w-full flex-1 min-w-[280px]">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">AI Colored</h3>
            <div className="relative aspect-square bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
              <img src={state.coloredImage} alt="AI Colored" className="max-w-full max-h-full object-contain" />
              {state.isColoring && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <LoadingSpinner message="Recoloring..." size="md" />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center items-center gap-4 flex-wrap">
              <Button
                onClick={handleRecolor}
                variant="secondary"
                size="md"
                disabled={state.isColoring}
              >
                Recolor
              </Button>
              <Button
                onClick={handleDownload}
                variant="primary"
                size="md"
                disabled={state.isColoring || !state.coloredImage}
              >
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 min-w-[280px]">
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-2">AI Colored</h3>
            <div className="relative aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-inner overflow-hidden flex items-center justify-center">
              {state.isColoring ? (
                <LoadingSpinner message="Coloring..." size="md" />
              ) : (
                <div className="text-center text-gray-500 px-4">
                  {state.selectedPalette ? (
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

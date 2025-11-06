import React, { useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useImageColoring } from '../../hooks/index';
import { Button } from '../common/Button';
import { DEFAULT_COLORING_OPTIONS } from '../../constants/index';

export const ColoringControls: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { colorImage } = useImageColoring();

  const handleColorImage = useCallback(async () => {
    if (!state.selectedPalette) return;

    await colorImage(state.selectedPalette, {
      blending: true,
      shadows: true,
      highlights: true,
      textures: state.withTextures,
    });
  }, [state.selectedPalette, state.withTextures, colorImage]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">2. Fine-Tune Style</h2>
      <p className="text-gray-600 mb-4">Optionally add more detail for a richer result.</p>

      <div className="flex justify-center items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <label htmlFor="textures-toggle" className={`flex items-center w-full ${state.isColoring || !state.selectedPalette ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <div className="relative">
            <input
              type="checkbox"
              id="textures-toggle"
              className="sr-only peer"
              checked={state.withTextures}
              onChange={() => dispatch({ type: 'SET_WITH_TEXTURES', payload: !state.withTextures })}
              disabled={state.isColoring || !state.selectedPalette}
            />
            <div className="block bg-gray-200 w-14 h-8 rounded-full peer-checked:bg-blue-200 transition"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-full peer-checked:bg-blue-600"></div>
          </div>
          <div className={`ml-3 text-gray-700 font-medium flex-1 ${state.isColoring || !state.selectedPalette ? 'opacity-50' : ''}`}>
            Add Natural Textures
          </div>
        </label>
      </div>
      {!state.selectedPalette && <p className="text-xs text-gray-500 mb-4">Please select a palette first to enable this option.</p>}

      <h2 className="text-xl font-bold text-gray-800 mb-1">3. Color It!</h2>
      <p className="text-gray-600 mb-4">Ready to see your creation? Press the button below.</p>

      <Button
        onClick={handleColorImage}
        variant="primary"
        size="lg"
        disabled={!state.selectedPalette || state.isColoring}
        isLoading={state.isColoring}
        loadingText="Coloring..."
        className="w-full"
      >
        Color My Image
      </Button>
      {!state.selectedPalette && <p className="text-xs text-gray-500 mt-2">Please select a palette first.</p>}
    </div>
  );
};

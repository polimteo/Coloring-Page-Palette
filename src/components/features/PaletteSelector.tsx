import React, { useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { usePaletteGeneration } from '../../hooks/index';
import { ColorPalette } from '../../types/index';
import { Button } from '../common/Button';

interface PaletteSelectorProps {
  onPaletteSelect: (palette: ColorPalette) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({ onPaletteSelect }) => {
  const { state } = useAppContext();
  const { regeneratePalettes } = usePaletteGeneration();

  const handlePaletteClick = useCallback((palette: ColorPalette) => {
    if (!state.isColoring && !state.isRegeneratingPalettes) {
      onPaletteSelect(palette);
    }
  }, [state.isColoring, state.isRegeneratingPalettes, onPaletteSelect]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">1. Choose a Palette</h2>
      <p className="text-gray-600 mb-4">Select a style to bring your image to life.</p>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {state.palettes.map((palette, index) => (
          <div
            key={index}
            onClick={() => handlePaletteClick(palette)}
            className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
              state.selectedPalette?.name === palette.name
                ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            } ${(state.isColoring || state.isRegeneratingPalettes) ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <h3 className="font-semibold text-gray-800 text-center mb-3">{palette.name}</h3>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {palette.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={regeneratePalettes}
        variant="secondary"
        size="md"
        disabled={state.isColoring || state.isLoadingPalettes || state.isRegeneratingPalettes}
        isLoading={state.isRegeneratingPalettes}
        loadingText="Regenerating..."
        className="w-full"
      >
        Regenerate Palettes
      </Button>
    </div>
  );
};

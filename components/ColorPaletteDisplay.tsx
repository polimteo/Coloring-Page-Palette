
import React from 'react';
import { ColorPalette } from '../types';

interface ColorPaletteProps {
  palette: ColorPalette;
  onSelect: () => void;
  isSelected: boolean;
  disabled: boolean;
}

const ColorPaletteDisplay: React.FC<ColorPaletteProps> = ({ palette, onSelect, isSelected, disabled }) => {
  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`p-4 border rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-300 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <h3 className="font-semibold text-gray-800 text-center mb-3">{palette.name}</h3>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full border border-gray-300 shadow-inner"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteDisplay;

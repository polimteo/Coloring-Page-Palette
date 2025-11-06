import React, { useState, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useImageUpload } from '../../hooks/index';
import { usePaletteGeneration } from '../../hooks/index';

export const ImageUploadSection: React.FC = () => {
  const { state } = useAppContext();
  const { uploadImage } = useImageUpload();
  const { generatePalettes } = usePaletteGeneration();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const image = await uploadImage(files[0]);
      if (image) {
        await generatePalettes(image);
      }
    }
  }, [uploadImage, generatePalettes]);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.isLoadingPalettes) setIsDragging(true);
  }, [state.isLoadingPalettes]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!state.isLoadingPalettes) {
      handleFileChange(e.dataTransfer.files);
    }
  }, [state.isLoadingPalettes, handleFileChange]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${state.isLoadingPalettes ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG, or WebP</p>
        </div>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={state.isLoadingPalettes}
        />
      </div>
    </div>
  );
};

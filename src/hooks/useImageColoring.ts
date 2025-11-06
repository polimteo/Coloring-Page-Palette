import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ColorPalette, ColoringOptions, AppError } from '../types/index';
import { colorImageWithPalette } from '../services/geminiService';

export function useImageColoring() {
  const { state, dispatch } = useAppContext();

  const colorImage = useCallback(async (palette: ColorPalette, options: ColoringOptions) => {
    if (!state.originalImage) return;

    dispatch({ type: 'SET_IS_COLORING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const coloredImage = await colorImageWithPalette(
        {
          base64: state.originalImage.base64,
          mimeType: state.originalImage.file.type,
        },
        palette,
        options
      );
      dispatch({ type: 'SET_COLORED_IMAGE', payload: coloredImage });
    } catch (error) {
      const appError: AppError = {
        code: 'IMAGE_COLORING_FAILED',
        message: "Sorry, I couldn't color the image. Please try again.",
        details: error instanceof Error ? error.message : 'Unknown error',
      };
      dispatch({ type: 'SET_ERROR', payload: appError });
    } finally {
      dispatch({ type: 'SET_IS_COLORING', payload: false });
    }
  }, [state.originalImage, dispatch]);

  return { colorImage };
}

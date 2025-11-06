import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UploadedImage, ColorPalette, AppError } from '../types/index';
import { generateColorPalettes } from '../services/geminiService';

export function usePaletteGeneration() {
  const { state, dispatch } = useAppContext();

  const generatePalettes = useCallback(async (image: UploadedImage) => {
    dispatch({ type: 'SET_IS_LOADING_PALETTES', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const palettes = await generateColorPalettes({
        base64: image.base64,
        mimeType: image.file.type,
      });
      dispatch({ type: 'SET_PALETTES', payload: palettes });
    } catch (error) {
      const appError: AppError = {
        code: 'PALETTE_GENERATION_FAILED',
        message: "Sorry, I couldn't generate color palettes for this image. Please try another one.",
        details: error instanceof Error ? error.message : 'Unknown error',
      };
      dispatch({ type: 'SET_ERROR', payload: appError });
    } finally {
      dispatch({ type: 'SET_IS_LOADING_PALETTES', payload: false });
    }
  }, [dispatch]);

  const regeneratePalettes = useCallback(async () => {
    if (!state.originalImage) return;

    dispatch({ type: 'SET_IS_REGENERATING_PALETTES', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SELECT_PALETTE', payload: null as any });
    dispatch({ type: 'SET_COLORED_IMAGE', payload: null as any });

    try {
      const palettes = await generateColorPalettes({
        base64: state.originalImage.base64,
        mimeType: state.originalImage.file.type,
      });
      dispatch({ type: 'SET_PALETTES', payload: palettes });
    } catch (error) {
      const appError: AppError = {
        code: 'PALETTE_GENERATION_FAILED',
        message: "Sorry, I couldn't generate new palettes. Please try again.",
        details: error instanceof Error ? error.message : 'Unknown error',
      };
      dispatch({ type: 'SET_ERROR', payload: appError });
    } finally {
      dispatch({ type: 'SET_IS_REGENERATING_PALETTES', payload: false });
    }
  }, [state.originalImage, dispatch]);

  return { generatePalettes, regeneratePalettes };
}

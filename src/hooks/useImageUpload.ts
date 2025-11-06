import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UploadedImage, AppError } from '../types/index';
import { FILE_SIZE_LIMIT, ALLOWED_IMAGE_TYPES } from '../constants/index';

export function useImageUpload() {
  const { dispatch } = useAppContext();

  const uploadImage = useCallback(async (file: File): Promise<UploadedImage | null> => {
    dispatch({ type: 'SET_ERROR', payload: null });

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      const error: AppError = {
        code: 'INVALID_FILE_TYPE',
        message: 'Please upload a JPEG, PNG, or WebP image.',
      };
      dispatch({ type: 'SET_ERROR', payload: error });
      return null;
    }

    if (file.size > FILE_SIZE_LIMIT) {
      const error: AppError = {
        code: 'FILE_TOO_LARGE',
        message: 'File size must be less than 10MB.',
      };
      dispatch({ type: 'SET_ERROR', payload: error });
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const uploadedImage: UploadedImage = { file, base64 };
        dispatch({ type: 'SET_ORIGINAL_IMAGE', payload: uploadedImage });
        dispatch({ type: 'SET_PALETTES', payload: [] });
        dispatch({ type: 'SELECT_PALETTE', payload: null as any });
        resolve(uploadedImage);
      };
      reader.onerror = () => {
        const error: AppError = {
          code: 'IMAGE_UPLOAD_FAILED',
          message: 'Failed to read the image file.',
        };
        dispatch({ type: 'SET_ERROR', payload: error });
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }, [dispatch]);

  return { uploadImage };
}

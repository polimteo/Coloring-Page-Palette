import React, { createContext, useReducer, ReactNode, useCallback } from 'react';
import { ColorPalette, UploadedImage, ColoringOptions, AppError, AppErrorType } from '../types/index';

export interface AppState {
  originalImage: UploadedImage | null;
  palettes: ColorPalette[];
  selectedPalette: ColorPalette | null;
  coloredImage: string | null;
  withTextures: boolean;

  isLoadingPalettes: boolean;
  isRegeneratingPalettes: boolean;
  isColoring: boolean;

  error: AppError | null;
}

export type AppAction =
  | { type: 'SET_ORIGINAL_IMAGE'; payload: UploadedImage }
  | { type: 'SET_PALETTES'; payload: ColorPalette[] }
  | { type: 'SELECT_PALETTE'; payload: ColorPalette }
  | { type: 'SET_COLORED_IMAGE'; payload: string }
  | { type: 'SET_WITH_TEXTURES'; payload: boolean }
  | { type: 'SET_IS_LOADING_PALETTES'; payload: boolean }
  | { type: 'SET_IS_REGENERATING_PALETTES'; payload: boolean }
  | { type: 'SET_IS_COLORING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'RESET' };

const initialState: AppState = {
  originalImage: null,
  palettes: [],
  selectedPalette: null,
  coloredImage: null,
  withTextures: false,
  isLoadingPalettes: false,
  isRegeneratingPalettes: false,
  isColoring: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ORIGINAL_IMAGE':
      return { ...state, originalImage: action.payload };
    case 'SET_PALETTES':
      return { ...state, palettes: action.payload };
    case 'SELECT_PALETTE':
      return { ...state, selectedPalette: action.payload, coloredImage: null };
    case 'SET_COLORED_IMAGE':
      return { ...state, coloredImage: action.payload };
    case 'SET_WITH_TEXTURES':
      return { ...state, withTextures: action.payload };
    case 'SET_IS_LOADING_PALETTES':
      return { ...state, isLoadingPalettes: action.payload };
    case 'SET_IS_REGENERATING_PALETTES':
      return { ...state, isRegeneratingPalettes: action.payload };
    case 'SET_IS_COLORING':
      return { ...state, isColoring: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  resetApp: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, resetApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

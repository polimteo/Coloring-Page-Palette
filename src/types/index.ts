export interface ColorPalette {
  name: string;
  colors: string[];
}

export interface UploadedImage {
  file: File;
  base64: string;
}

export interface ColoringOptions {
  blending: boolean;
  shadows: boolean;
  highlights: boolean;
  textures: boolean;
}

export interface AppError {
  code: string;
  message: string;
  details?: string;
}

export type AppErrorType =
  | 'IMAGE_UPLOAD_FAILED'
  | 'PALETTE_GENERATION_FAILED'
  | 'IMAGE_COLORING_FAILED'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR';

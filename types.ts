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
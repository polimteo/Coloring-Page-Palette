import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ColorPalette, ColoringOptions } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType,
    },
  };
};

export const generateColorPalettes = async (image: { base64: string, mimeType: string }): Promise<ColorPalette[]> => {
  const imagePart = fileToGenerativePart(image.base64, image.mimeType);
  const prompt = `You are a creative color assistant. Analyze the provided coloring page image. Generate 3 distinct and appealing color palettes for it. For each palette, provide a thematic name (e.g., 'Enchanted Forest', 'Tropical Sunset') and an array of 6 complementary hex color codes.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The thematic name of the color palette."
            },
            colors: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A hex color code."
              }
            }
          },
          required: ["name", "colors"]
        }
      }
    }
  });

  const jsonString = response.text.trim();
  const palettes = JSON.parse(jsonString);
  return palettes as ColorPalette[];
};

export const colorImageWithPalette = async (
  image: { base64: string, mimeType: string },
  palette: ColorPalette,
  options: ColoringOptions
): Promise<string> => {
  const imagePart = fileToGenerativePart(image.base64, image.mimeType);
  
  let prompt = `Colorize this coloring page. Use only the colors from this palette: ${palette.colors.join(', ')}. Fill the regions of the coloring page naturally and beautifully with these colors.`;

  const instructions: string[] = [];
  if (options.blending) {
    instructions.push("apply smooth blending between colors");
  }
  if (options.shadows) {
    instructions.push("add realistic shadows for depth");
  }
  if (options.highlights) {
    instructions.push("add subtle highlights to make the image pop");
  }
  if (options.textures) {
    instructions.push("incorporate gentle, suitable textures and patterns to add more detail and realism. For instance, you could add a soft fabric texture, a light wood grain, or faint leafy patterns where appropriate");
  }

  if (instructions.length > 0) {
    prompt += ` Also, please ${instructions.join(', ')}.`;
  }

  prompt += ` Do not add any new elements, text, or change the original line art. The final image should only be the colored version of the original line art.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, { text: prompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("No colored image was generated.");
};
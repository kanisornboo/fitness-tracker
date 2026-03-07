import { GenerateContentConfig, GoogleGenAI } from "@google/genai";
import fs from "fs";

enum ThinkingLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export const analyzeImage = async (filePath: string) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: "Extract the food name and estimated calories from the image. Return the result in JSON format.",
      },
    ];

    const config = {
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      responseJsonSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          calories: {
            type: "number",
          },
        },
      },
    } satisfies GenerateContentConfig;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config,
    });

    const result = JSON.parse(response.text);
    console.log({ result });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

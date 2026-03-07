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

    // why do we need to convert the image to base64?
    // because the GoogleGenAI API expects the image to be in base64 format
    // and we can't pass the image file directly to the API
    // so we need to convert the image to base64 format
    // and then pass the base64 string to the API
    // and then the API will convert the base64 string back to the image file
    // then the API will analyze the image
    // then the API will return the result
    // then we can parse the result to get the food name and calories

    // why do we use fs to read the image file? because we need to read the image file from the file system and convert it to base64 format.
    // fs is a Node.js module that allows us to read files from the file system.
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
      // thinkingConfig: {
      //   thinkingLevel: ThinkingLevel.HIGH,
      // },
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
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    // response.text is a JSON string, so we need to parse it
    const result = JSON.parse(response.text);
    console.log({ result });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

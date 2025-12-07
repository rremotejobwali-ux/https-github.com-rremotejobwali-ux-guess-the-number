import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GuessResult, AIResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "A short, witty comment about the player's guess.",
    },
    mood: {
      type: Type.STRING,
      enum: ['sassy', 'encouraging', 'celebratory', 'neutral'],
      description: "The emotional tone of the response.",
    },
  },
  required: ["text", "mood"],
};

export const generateGameCommentary = async (
  target: number,
  guess: number,
  result: GuessResult,
  attempts: number
): Promise<AIResponse> => {
  try {
    const prompt = `
      You are a witty game show host for a "Guess the Number" game.
      The secret number is ${target}.
      The player guessed ${guess}.
      The result is: ${result.toUpperCase()}.
      This is attempt number ${attempts}.

      Generate a very short (max 15 words) reaction.
      If they won, be celebratory.
      If they are close (within 2), be encouraging or suspenseful.
      If they are far off, be slightly sassy or helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction: "You are a charismatic game host. Keep it brief and fun.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponse;
    }
    
    return getFallbackResponse(result);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackResponse(result);
  }
};

const getFallbackResponse = (result: GuessResult): AIResponse => {
  switch (result) {
    case 'correct':
      return { text: "You got it! Amazing guess!", mood: 'celebratory' };
    case 'high':
      return { text: "Too high! Try a smaller number.", mood: 'neutral' };
    case 'low':
      return { text: "Too low! Go bigger!", mood: 'neutral' };
  }
};

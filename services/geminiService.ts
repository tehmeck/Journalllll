import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiInsight } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInsight = async (context: string): Promise<GeminiInsight> => {
  try {
    const prompt = `
      Based on the following journal context (or general helpfulness if empty), provide a short, insightful response.
      The response should be strictly JSON format with keys: "type" (one of: 'question', 'musing', 'idea') and "content" (string).
      
      Context: "${context.substring(0, 500)}..."
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiInsight;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      type: 'musing',
      content: "Take a moment to breathe and reflect on your day."
    };
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert Blob to Base64
    const base64Data = await blobToBase64(audioBlob);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Flash is fast for transcription
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || 'audio/webm',
              data: base64Data
            }
          },
          {
            text: "Transcribe this audio exactly as spoken. Return only the text."
          }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    throw error;
  }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:audio/webm;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
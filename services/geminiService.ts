
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export class GeminiService {
  /**
   * Analyzes PDF content using Gemini API.
   * Initializes a new GoogleGenAI instance for each call to ensure the latest API key is used.
   */
  async analyzePdf(prompt: string, history: ChatMessage[] = []) {
    try {
      // Always initialize within the method using process.env.API_KEY.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Convert UI message history to Gemini API format.
      // Note: Gemini history must start with a 'user' message.
      const geminiHistory = history
        .filter((msg, index) => !(index === 0 && msg.role === 'model'))
        .map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: msg.text }]
        }));

      // Use gemini-3-pro-preview for complex PDF analysis tasks.
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: 'You are a helpful AI assistant integrated into a PDF flipbook viewer. You analyze the contents of the book and help the user summarize, extract insights, or clarify complex topics. Be concise and professional.',
        },
        history: geminiHistory,
      });

      // Send the prompt and get the response text via the .text property.
      const response = await chat.sendMessage({ message: prompt });
      return response.text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

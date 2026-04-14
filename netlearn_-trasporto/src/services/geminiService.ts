import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askGemini(prompt: string, systemInstruction: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Spiacente, non ho ricevuto una risposta valida.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Spiacente, si è verificato un errore nella comunicazione con l'IA. Riprova più tardi.";
  }
}

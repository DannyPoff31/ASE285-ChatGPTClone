import { GoogleGenAI } from "@google/genai";
import fs from "fs";

let aiClient = null;
const MODEL = "gemini-2.5-flash";

const photo = "testPhoto.jpg"

const reader = new FileReader();

/**
 * Ensure the GenAI client is ready.  Returns true on success.
 */
export const initializeAI = async () => {
  try {
    const isElectron =
      typeof window !== "undefined" &&
      window.electron &&
      typeof window.electron.getApiKey === "function";

    const apiKey = isElectron
      ? await window.electron.getApiKey()
      : import.meta.env.VITE_GEMINI_API_KEY; // you can rename env var if you like

    if (!apiKey) {
      console.error("Missing API key");
      return false;
    }

    aiClient = new GoogleGenAI({ apiKey });
    return true;
  } catch (err) {
    console.error("Failed to initialize GenAI client:", err);
    return false;
  }
};

/**
 * messages -- array of {role: 'user'|'assistant', content: string}
 * returns generated text.
 */
export const sendMessageToAI = async (messages) => {
  console.log("Sending messages to AI:", messages);
  if (!aiClient) {
    throw new Error("AI client not initialized");
  }

  try {

    // Convert messages array to GenAI format
    // GenAI expects: [{role: 'user'|'model', parts: [{text: 'content'}]}]
    const contents = messages.map((m) => {
      const parts = [];

      if (m.imgContent) {
        parts.push({
          inlineData: {
            data: m.imgContent.data,
            mimeType: m.imgContent.mimeType,
          },
        });
      }

      if (m.content) {
        parts.push({
          text: m.content,
        });
      }

      return {
        role: m.aiMessage ? "model" : "user",
        parts,
      };
    });
    console.log("Formatted contents for GenAI:", contents);

    const resp = await aiClient.models.generateContent({
      model: MODEL,
      contents: contents,
    });

    // genai shape: resp.data.choices[0].content
    return resp.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("GenAI API error:", err.message);
    throw err;
  }
}
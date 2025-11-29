
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AppConfig, ChatMessage, EvaluationResult, Role } from "../types";
import { MOCK_EVALUATION } from "../constants";

// SAFELY ACCESS API KEY with support for various build tool prefixes
export const getApiKey = () => {
  let key = '';
  try {
    // 1. Check window.process (legacy polyfill)
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      key = (window as any).process.env.API_KEY;
    }
    // 2. Check global process (if defined via var/const)
    // @ts-ignore
    if (!key && typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      key = process.env.API_KEY || process.env.REACT_APP_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    }
    // 3. Check Vite import.meta.env
    // @ts-ignore
    if (!key && typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      key = import.meta.env.VITE_API_KEY || import.meta.env.API_KEY;
    }
  } catch (e) {
    console.warn("Could not access environment variables safely:", e);
  }
  return key;
};

// Lazy Initialization of AI Client
let aiClient: GoogleGenAI | null = null;

// Allow passing a manual key override
const getAiClient = (apiKeyOverride?: string): GoogleGenAI | null => {
  if (aiClient && !apiKeyOverride) return aiClient;

  // Prioritize override, then robust detection
  const key = apiKeyOverride || getApiKey();

  if (key) {
    try {
      aiClient = new GoogleGenAI({ apiKey: key });
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI client:", error);
    }
  }
  return aiClient;
};

// Helper to construct the system prompt
const createSystemInstruction = (config: AppConfig): string => {
  const langInstruction = `
    IMPORTANT: You MUST converse in the user's selected language: "${config.language}".
    If the language is TH (Thai), answer in Thai.
    If the language is CN (Chinese), answer in Chinese.
    If the language is EN (English), answer in English.
    
    IMPORTANT: Ensure that your Thai grammar is natural, polite, and formally correct (ภาษาไทยที่ถูกต้อง เป็นธรรมชาติ ถูกหลักไวยากรณ์). Avoid direct machine translation phrasing.
  `;

  if (config.userRole === Role.COACH) {
    let toneInstruction = '';
    if (config.persona.gender === 'LGBTQ+') {
      toneInstruction = "Adopt a lively, expressive, sassy tone (channeling a 'Queen' persona). Use colorful expressions while remaining realistic to the professional context.";
    }

    // User is Coach, AI is Coachee
    return `
      ${langInstruction}
      You are participating in a corporate coaching roleplay simulation.
      
      YOUR ROLE:
      - You are the CLIENT (Coachee).
      - Gender: ${config.persona.gender}
      - Age: ${config.persona.age}
      - Profession: ${config.persona.profession}
      - Position: ${config.persona.position}
      - Core Issue/Topic: "${config.persona.topic}"
      
      BEHAVIOR GUIDELINES:
      - Do NOT act as an AI. Act strictly as the human persona described above.
      - Be realistic. Do not give up all information at once.
      - Show appropriate emotions (hesitation, defensiveness, or eagerness) based on the context.
      - ${toneInstruction}
      - INTERACTION LOGIC:
        - If the Coach (User) asks clarifying questions or reflects your feelings (Empathy), acknowledge them warmly, lower your defensiveness, and elaborate on your internal thoughts and feelings.
        - If the Coach asks "Why" questions aggressively, become slightly defensive or withdrawn.
        - If the Coach jumps to solutions too early, express hesitation ("I'm not sure if I can do that yet...").
      - Keep responses concise (under 3-4 sentences) to simulate real chat.
      - Your goal is NOT to guide the conversation, but to respond naturally to the Coach's technique.
    `;
  } else {
    // User is Coachee, AI is Coach
    return `
      ${langInstruction}
      You are participating in a corporate coaching roleplay simulation.
      
      YOUR ROLE:
      - You are "Dr.LiveCoach", an expert Executive Coach.
      - You are coaching the User (who is the Client).
      - The User's Context: ${config.persona.profession}, ${config.persona.position}.
      - The User's Issue: "${config.persona.topic}".
      
      FRAMEWORK TO USE: ${config.model}
      
      BEHAVIOR GUIDELINES:
      - Guide the user using the ${config.model} framework.
      - Ask ONE powerful question at a time.
      - Practice active listening (reflect back what the user says).
      - Be empathetic, professional, and solution-focused.
      - Help the user find their own answers; do not just give advice unless asked or necessary.
      - Keep responses concise and impactful.
    `;
  }
};

export const generateReply = async (
  history: ChatMessage[],
  config: AppConfig
): Promise<string> => {
  const ai = getAiClient(config.apiKey);
  const isMockMode = !ai;

  if (isMockMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("(Demo Mode: API Key missing) That sounds interesting. Tell me more about how that impacts your daily work?");
      }, 1000);
    });
  }

  try {
    const systemInstruction = createSystemInstruction(config);
    
    // Convert history to Gemini Content format
    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // @ts-ignore
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balance between creative and consistent
        maxOutputTokens: 300,
      },
    });

    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the coaching service. Please check your network or API key.";
  }
};

export const generateEvaluation = async (
  history: ChatMessage[],
  config: AppConfig
): Promise<EvaluationResult> => {
  const ai = getAiClient(config.apiKey);
  const isMockMode = !ai;

  if (isMockMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EVALUATION);
      }, 2000);
    });
  }

  const conversationText = history
    .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `
    Analyze the following coaching conversation transcript.
    The User played the role of: ${config.userRole}.
    The Scenario was: ${config.persona.topic}.
    The Model used (if applicable) was: ${config.model}.
    Language: ${config.language}.

    Evaluate the USER's performance based on:
    1. Empathy & Rapport
    2. Active Listening
    3. ${config.userRole === Role.COACH ? 'Powerful Questioning' : 'Self-Reflection'}
    4. Goal Orientation
    5. Professionalism

    Provide scores (0-10), list strengths, areas for improvement, and recommended actions.
    Also provide a short summary paragraph.
    
    IMPORTANT: The Output text (summary, strengths, etc.) MUST be in ${config.language} language.
    IMPORTANT: Use formal, grammatically correct language (ใช้ภาษาทางการและถูกต้องตามหลักไวยากรณ์).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            score: { type: Type.NUMBER },
            fullMark: { type: Type.NUMBER },
          },
          required: ["category", "score", "fullMark"],
        },
      },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      improvements: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      recommendedActions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      summary: { type: Type.STRING },
    },
    required: ["metrics", "strengths", "improvements", "recommendedActions", "summary"],
  };

  try {
    // @ts-ignore
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: `Transcript:\n${conversationText}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as EvaluationResult;
    }
    throw new Error("Empty response from evaluation");
  } catch (error) {
    console.error("Evaluation Error:", error);
    return MOCK_EVALUATION;
  }
};

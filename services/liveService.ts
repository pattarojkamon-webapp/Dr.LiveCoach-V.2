
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { AppConfig, Role, ChatMessage } from '../types';

// Constants for Audio
const SAMPLE_RATE_INPUT = 16000;
const SAMPLE_RATE_OUTPUT = 24000;

export interface LiveSessionController {
  connect: () => Promise<void>;
  disconnect: () => void;
  getTranscript: () => ChatMessage[];
}

interface Callbacks {
  onStatusChange: (status: 'connecting' | 'connected' | 'error' | 'disconnected', error?: string) => void;
  onAudioActivity: (isUserSpeaking: boolean) => void;
}

// Safely get API Key
const getApiKey = () => {
  try {
    // 1. Check window.process (browser polyfill)
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
    // 2. Check global process (if defined via var/const)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore
  }
  return '';
};

export const createLiveSession = (
  config: AppConfig,
  callbacks: Callbacks
): LiveSessionController => {
  const apiKey = getApiKey();
  
  // We check API key inside connect to allow cleaner error handling flow
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  let sessionPromise: Promise<any> | null = null;
  let audioContext: AudioContext | null = null;
  let inputSource: MediaStreamAudioSourceNode | null = null;
  let processor: ScriptProcessorNode | null = null;
  
  // Audio Playback
  let nextStartTime = 0;
  const sources = new Set<AudioBufferSourceNode>();

  // Transcription State
  let currentInputTranscription = '';
  let currentOutputTranscription = '';
  const transcriptHistory: ChatMessage[] = [];

  // Helper: Decode B64 to ArrayBuffer
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper: Encode Uint8Array to B64
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Helper: Convert Float32 from mic to PCM Int16
  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = Math.max(-1, Math.min(1, data[i])) * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  // Helper: Decode server PCM to AudioBuffer
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, SAMPLE_RATE_OUTPUT);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const connect = async () => {
    callbacks.onStatusChange('connecting');

    if (!apiKey || !ai) {
      console.error("API Key is missing for Live Mode");
      callbacks.onStatusChange('error', 'API Key is missing. Please check your configuration or environment variables.');
      return;
    }

    try {
      // 1. Setup Audio Context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: SAMPLE_RATE_OUTPUT,
      });

      // 2. Determine Voice and Tone
      let voiceName = 'Kore';
      let toneInstruction = '';

      if (config.userRole === Role.COACH) {
        // AI is Coachee: Match the selected Persona Gender
        switch (config.persona.gender) {
          case 'Male':
            voiceName = 'Fenrir'; // Deep, masculine
            break;
          case 'Female':
            voiceName = 'Kore'; // Standard female
            break;
          case 'LGBTQ+':
          case 'Non-binary':
            voiceName = 'Puck'; // Playful, higher range
            // Specific instruction for LGBTQ+ "Gay queen" persona
            toneInstruction = "Adopt a lively, expressive, sassy tone (channeling a 'Queen' persona). Use colorful expressions while remaining realistic to the professional context.";
            break;
          default:
            voiceName = 'Kore';
        }
      } else {
        // AI is Coach (Dr.LiveCoach)
        // Default to a professional voice
        voiceName = 'Kore';
      }

      // 3. Setup System Instruction
      const langInstruction = `Speak in ${config.language}.`;
      let systemInstruction = '';
      
      if (config.userRole === Role.COACH) {
         systemInstruction = `
            ${langInstruction}
            You are the Coachee. 
            Role: ${config.persona.gender}, ${config.persona.age}, ${config.persona.profession}.
            Topic: ${config.persona.topic}.
            ${toneInstruction}
            Act realistic, emotional, and concise. Do not talk too much.
         `;
      } else {
         systemInstruction = `
            ${langInstruction}
            You are Dr.LiveCoach.
            Coach the user on: ${config.persona.topic} using the ${config.model}.
            Be professional, warm, and ask one powerful question at a time.
         `;
      }

      // 4. Connect to Gemini Live
      sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: systemInstruction,
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: async () => {
            console.log("Live Session Open");
            
            // Critical: Resume audio context if suspended (common in browsers)
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            callbacks.onStatusChange('connected');
            
            try {
              // Start Mic Stream
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              if (!audioContext) return;
              
              inputSource = audioContext.createMediaStreamSource(stream);
              processor = audioContext.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise?.then(session => session.sendRealtimeInput({ media: pcmBlob }))
                  .catch(err => console.error("Error sending input:", err));
              };

              inputSource.connect(processor);
              processor.connect(audioContext.destination);
            } catch (mediaErr) {
              console.error("Microphone Access Error:", mediaErr);
              callbacks.onStatusChange('error', 'Microphone access denied. Please allow microphone permissions.');
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
             // 1. Handle Audio Output
             const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && audioContext) {
                callbacks.onAudioActivity(false); // Model is speaking
                
                nextStartTime = Math.max(nextStartTime, audioContext.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext);
                
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.addEventListener('ended', () => {
                   sources.delete(source);
                   if (sources.size === 0) callbacks.onAudioActivity(true); // User turn
                });
                
                source.start(nextStartTime);
                nextStartTime += audioBuffer.duration;
                sources.add(source);
             }

             // 2. Handle Interruption
             if (msg.serverContent?.interrupted) {
                sources.forEach(s => s.stop());
                sources.clear();
                nextStartTime = 0;
                callbacks.onAudioActivity(true);
             }

             // 3. Handle Transcription
             if (msg.serverContent?.outputTranscription?.text) {
               currentOutputTranscription += msg.serverContent.outputTranscription.text;
             }
             if (msg.serverContent?.inputTranscription?.text) {
               currentInputTranscription += msg.serverContent.inputTranscription.text;
             }

             if (msg.serverContent?.turnComplete) {
                if (currentInputTranscription.trim()) {
                  transcriptHistory.push({
                    id: Date.now().toString(),
                    role: 'user',
                    text: currentInputTranscription,
                    timestamp: new Date()
                  });
                  currentInputTranscription = '';
                }
                if (currentOutputTranscription.trim()) {
                  transcriptHistory.push({
                     id: (Date.now()+1).toString(),
                     role: 'model',
                     text: currentOutputTranscription,
                     timestamp: new Date()
                  });
                  currentOutputTranscription = '';
                }
             }
          },
          onclose: () => {
            console.log("Live Session Closed");
            // If we closed it manually, we might have already set state to disconnected.
            // But if server closes it, we need to know.
          },
          onerror: (err) => {
            console.error("Live Session Error", err);
            let message = "Connection to AI server failed.";
            if (err instanceof Error) message = err.message;
            callbacks.onStatusChange('error', message);
          }
        }
      });
      
    } catch (e: any) {
      console.error("Failed to init live session", e);
      callbacks.onStatusChange('error', e.message || "Failed to initialize session.");
    }
  };

  const disconnect = () => {
    if (processor) {
      processor.disconnect();
      processor.onaudioprocess = null;
    }
    if (inputSource) inputSource.disconnect();
    if (audioContext) audioContext.close();
    
    sessionPromise?.then(session => {
        // @ts-ignore
        if (session.close) session.close(); 
    }).catch(e => console.error("Error closing session:", e));
    
    callbacks.onStatusChange('disconnected');
  };

  return {
    connect,
    disconnect,
    getTranscript: () => transcriptHistory
  };
};

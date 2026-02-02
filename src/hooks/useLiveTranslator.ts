/**
 * useLiveTranslator.ts
 * 
 * CORE DOMAIN LOGIC HOOK
 * 
 * This hook is the brain of the interpretation system. It manages the full lifecycle 
 * of a Gemini Live session, bridging the gap between browser hardware and AI inference.
 * 
 * KEY ARCHITECTURAL FEATURES:
 * 1. REAL-TIME STREAMING:
 *    Orchestrates a bidirectional WebSocket connection using @google/genai.
 *    - Inbound: Transcribed text chunks and PCM audio bytes.
 *    - Outbound: PCM audio recorded from the user's microphone.
 * 
 * 2. MULTI-MODEL STRATEGY:
 *    - Gemini 2.5 Flash Native Audio (LIVE): Used for simultaneous interpretation.
 *    - Gemini 3 Flash (STATIC): Used for text corrections and one-shot document translations.
 * 
 * 3. STALE CLOSURE MANAGEMENT:
 *    Uses `currentItemRef` to track the active translation turn within asynchronous 
 *    WebSocket callbacks, ensuring state updates always target the correct chat bubble.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState, TranslationLogItem } from '../types';
import { detectLanguage } from '../utils/languageUtils';
import { AudioRecorder } from '../utils/audioRecorder';
import { AudioStreamPlayer } from '../utils/audioStreamPlayer';
import { Language } from '../constants/languages';
import { generateSystemInstruction } from '../utils/promptUtils';

// Model definitions as per Google Coding Guidelines.
const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
const FLASH_MODEL = 'gemini-3-flash-preview';

export const useLiveTranslator = () => {
  // --- UI & CONNECTION STATE ---
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [items, setItems] = useState<TranslationLogItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // --- SESSION CONFIGURATION ---
  const [sessionLanguages, setSessionLanguages] = useState<{ langA: Language, langB: Language } | null>(null);
  const [sessionContext, setSessionContext] = useState<string>('general');
  const [isLiveOutputEnabled, setIsLiveOutputEnabled] = useState(true);

  // --- REFS (Volatile hardware & session handlers) ---
  const currentItemRef = useRef<TranslationLogItem | null>(null);
  const activeSessionRef = useRef<unknown>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioPlayerRef = useRef<AudioStreamPlayer | null>(null);
  
  /**
   * CLEANUP LOGIC:
   * Gracefully shuts down the WebSocket, releases microphone tracks, 
   * and closes AudioContexts.
   */
  const disconnect = useCallback(async () => {
    if (activeSessionRef.current) {
      try {
        await (activeSessionRef.current as { close: () => Promise<void> }).close();
      } catch (e) {
        console.warn("Error closing session:", e);
      }
      activeSessionRef.current = null;
    }

    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stop();
      audioPlayerRef.current = null;
    }

    setActiveStream(null);
    setIsPaused(false);
    setConnectionState('disconnected');
    currentItemRef.current = null;
    
    // Convert any "in-progress" items to "final" status.
    setItems(prev => prev.map(item => ({ ...item, isFinal: true })));
  }, []);

  // Ensure cleanup on unmount.
  useEffect(() => {
    return () => { disconnect(); };
  }, [disconnect]);

  /**
   * PAUSE LOGIC:
   * Suspends the AudioContext to stop hardware input without breaking 
   * the persistent conversational state in the AI model.
   */
  const togglePause = useCallback(async () => {
    if (!audioRecorderRef.current) return;
    if (isPaused) {
      await audioRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      await audioRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  /**
   * SPEECH TOGGLE:
   * Enables or disables the AI's vocal interpretation playback.
   */
  const toggleLiveOutput = useCallback(() => {
    setIsLiveOutputEnabled(prev => {
      const newState = !prev;
      if (audioPlayerRef.current) audioPlayerRef.current.setEnabled(newState);
      return newState;
    });
  }, []);

  /**
   * STATIC TRANSLATION PIPELINE (Gemini Flash):
   * Used for processing text input or PDF files.
   * This is a "one-shot" request that bypasses the Live WebSocket.
   */
  const translateStaticContent = useCallback(async (content: string, attachment?: { mimeType: string, data: string }) => {
    if ((!content && !attachment) || !sessionLanguages) return;

    const tempId = crypto.randomUUID();
    const isPdf = attachment?.mimeType === 'application/pdf';
    
    const newItem: TranslationLogItem = {
      id: tempId,
      sourceText: isPdf ? `[PDF Document] ${content}` : content,
      translatedText: '',
      sourceLanguage: 'unknown',
      isFinal: false,
      isUpdating: true,
      timestamp: new Date()
    };
    
    setItems(prev => [...prev, newItem]);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const prompt = generateSystemInstruction(sessionLanguages.langA, sessionLanguages.langB, sessionContext);
      
      const contents = [];
      if (attachment) contents.push({ inlineData: attachment });
      if (isPdf && !content.trim()) {
        contents.push({ text: "Translate this document." });
      } else {
        contents.push({ text: content });
      }

      const response = await ai.models.generateContent({
        model: FLASH_MODEL,
        contents: contents,
        config: { systemInstruction: prompt },
      });

      const fullText = response.text || '';
      let cleanText = fullText;
      
      // Parse out the [SRC=xx] tag used for language detection.
      let detectedSource = 'unknown';
      const srcMatch = cleanText.match(/\[SRC=([a-z]+)\]/);
      if (srcMatch) detectedSource = srcMatch[1];
      
      cleanText = cleanText.replace(/\[SRC=[a-z]+\]/g, '').trim();
      const parts = cleanText.split('====');
      const translatedText = parts[0].trim();
      const transliteration = parts.length > 1 ? parts[1].trim() : undefined;

      setItems(prev => prev.map(item => {
        if (item.id === tempId) {
          return { 
            ...item, 
            translatedText,
            transliteration,
            sourceLanguage: detectedSource,
            isFinal: true,
            isUpdating: false 
          };
        }
        return item;
      }));
    } catch (err) {
      console.error("Static translation failed", err);
      setItems(prev => prev.map(item => {
        if (item.id === tempId) return { ...item, translatedText: "Error processing translation.", isFinal: true, isUpdating: false };
        return item;
      }));
    }
  }, [sessionLanguages, sessionContext]);

  /**
   * LOG EDITING PIPELINE:
   * Re-translates a specific turn if the user manually edits the transcript.
   */
  const updateLogItem = useCallback(async (id: string, newSourceText: string) => {
    if (!newSourceText.trim() || !sessionLanguages) return;

    const simpleDetected = detectLanguage(newSourceText);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          sourceText: newSourceText,
          sourceLanguage: (simpleDetected === sessionLanguages.langA.code || simpleDetected === sessionLanguages.langB.code) 
            ? simpleDetected : item.sourceLanguage,
          isUpdating: true 
        };
      }
      return item;
    }));

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const prompt = generateSystemInstruction(sessionLanguages.langA, sessionLanguages.langB, sessionContext);
      const response = await ai.models.generateContent({
        model: FLASH_MODEL,
        contents: newSourceText,
        config: { systemInstruction: prompt },
      });

      const fullText = response.text || '';
      const cleanText = fullText.replace(/\[SRC=[a-z]+\]/g, '').trim();
      const parts = cleanText.split('====');
      const translatedText = parts[0].trim();
      const transliteration = parts.length > 1 ? parts[1].trim() : undefined;

      setItems(prev => prev.map(item => {
        if (item.id === id) return { ...item, translatedText, transliteration, isUpdating: false };
        return item;
      }));
    } catch (err) {
      console.error("Re-translation failed", err);
      setItems(prev => prev.map(item => (item.id === id ? { ...item, isUpdating: false } : item)));
    }
  }, [sessionLanguages, sessionContext]);

  /**
   * SESSION INITIATION (Live API):
   * Orchestrates the WebSocket setup and callback handlers.
   */
  const connect = useCallback(async (langA: Language, langB: Language, contextId: string = 'general') => {
    if (!import.meta.env.VITE_API_KEY) {
      setError("API Key is missing.");
      setConnectionState('error');
      return;
    }

    setConnectionState('connecting');
    setError(null);
    setIsPaused(false);
    setSessionLanguages({ langA, langB });
    setSessionContext(contextId);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
      const dynamicPrompt = generateSystemInstruction(langA, langB, contextId);

      // Initialize the audio playback engine.
      audioPlayerRef.current = new AudioStreamPlayer();
      audioPlayerRef.current.setEnabled(isLiveOutputEnabled);

      const session = await ai.live.connect({
        model: LIVE_MODEL,
        callbacks: {
          onopen: async () => {
            setConnectionState('connected');
            // Connect microphone hardware to the session.
            audioRecorderRef.current = new AudioRecorder(
              (base64Data) => {
                session.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: base64Data } });
              },
              (stream) => { setActiveStream(stream); }
            );
            
            try {
              await audioRecorderRef.current.start();
            } catch {
              setError("Microphone access failed.");
              disconnect();
            }
          },
          onmessage: (message: LiveServerMessage) => {
            // 1. AUDIO: Simultaneous interpretation playback.
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioPlayerRef.current) audioPlayerRef.current.playChunk(audioData);

            // 2. INPUT TRANSCRIPTION: Real-time user speech text.
            if (message.serverContent?.inputTranscription) {
               const text = message.serverContent.inputTranscription.text;
               if (text) {
                 if (!currentItemRef.current) {
                   const newItem: TranslationLogItem = {
                     id: crypto.randomUUID(),
                     sourceText: '', translatedText: '', rawTranslatedText: '',
                     sourceLanguage: 'unknown', isFinal: false, timestamp: new Date()
                   };
                   currentItemRef.current = newItem;
                   setItems(prev => [...prev, newItem]);
                 }
                 setItems(prev => prev.map(item => (item.id === currentItemRef.current?.id ? { ...item, sourceText: item.sourceText + text } : item)));
               }
            }

            // 3. OUTPUT TRANSCRIPTION: Real-time AI translation text.
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) {
                setItems(prev => prev.map(item => {
                   if (item.id === currentItemRef.current?.id) {
                     const newRaw = (item.rawTranslatedText || '') + text;
                     let detectedSource = item.sourceLanguage;
                     // Extract source tag once it appears in the stream.
                     const srcMatch = newRaw.match(/\[SRC=([a-z]+)\]/);
                     if (srcMatch) detectedSource = srcMatch[1];

                     const displayRaw = newRaw.replace(/\[SRC=[a-z]+\]/g, '').trimStart();
                     const parts = displayRaw.split('====');
                     return { 
                       ...item, 
                       translatedText: parts[0], transliteration: parts.length > 1 ? parts[1] : undefined,
                       rawTranslatedText: newRaw, sourceLanguage: detectedSource
                     };
                   }
                   return item;
                }));
              }
            }

            // 4. TURN COMPLETE: Signaling the end of a spoken phrase.
            if (message.serverContent?.turnComplete) {
              if (currentItemRef.current) {
                setItems(prev => prev.map(item => (item.id === currentItemRef.current?.id ? { ...item, isFinal: true } : item)));
                currentItemRef.current = null;
              }
            }
          },
          onclose: () => { disconnect(); },
          onerror: (_err) => { setError("Connection Error. Please retry."); disconnect(); }
        },
        config: {
           responseModalities: [Modality.AUDIO], 
           systemInstruction: dynamicPrompt,
           inputAudioTranscription: {}, 
           outputAudioTranscription: {},
           generationConfig: {
             temperature: 1.0
           }
        }
      });
      activeSessionRef.current = session;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to connect");
      setConnectionState('error');
    }
  }, [disconnect, isLiveOutputEnabled]);

  return {
    connect, disconnect, updateLogItem, translateStaticContent,
    connectionState, items, error, activeStream, isPaused, togglePause,
    isLiveOutputEnabled, toggleLiveOutput, sessionLanguages, sessionContext, setSessionContext
  };
};
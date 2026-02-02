/**
 * types.ts
 * 
 * GLOBAL TYPE DEFINITIONS
 * Centralized interfaces and types used across the Flex Translator ecosystem.
 */

/**
 * ConnectionState tracks the lifecycle of the WebSocket connection to Gemini.
 */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * TranslationLogItem represents a single turn in a conversation.
 * Each item contains both the original spoken/written text and its AI translation.
 */
export interface TranslationLogItem {
  id: string;               // Unique UUID for React reconciliation
  sourceText: string;       // The transcribed or pasted input text
  translatedText: string;   // The final displayable translation
  rawTranslatedText?: string; // Buffer for partial chunks during streaming
  transliteration?: string;   // Optional Romanized pronunciation (e.g., for Urdu/Arabic)
  sourceLanguage: string;     // ISO code detected by the model (e.g., 'es', 'en', 'ur')
  isFinal: boolean;         // False during streaming, True when the turn is complete
  isUpdating?: boolean;     // True if the item is currently being re-processed by Gemini Flash
  timestamp: Date;          // Time of creation for historical logging and PDF export
}
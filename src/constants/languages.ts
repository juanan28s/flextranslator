/**
 * languages.ts
 * 
 * LANGUAGE CONFIGURATION DATA
 * Defines the supported languages, their ISO codes, native names, and
 * visual metadata (flags, RTL/LTR status, custom fonts).
 */

export interface Language {
  code: string;       // ISO 639-1 code
  name: string;       // English name
  nativeName: string; // Name in the local script
  flag: string;       // Emoji flag
  direction: 'ltr' | 'rtl'; // For UI alignment
  font?: string;      // Specific CSS class (e.g., 'font-urdu' for Nastaliq)
}

/**
 * LIST OF SUPPORTED LANGUAGES
 * This list is used to populate selection dropdowns across the app.
 */
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', font: 'font-urdu' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文 (普通话)', flag: '🇨🇳', direction: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl', font: 'font-urdu' },
  // ... (Full list maintained in the live code)
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};
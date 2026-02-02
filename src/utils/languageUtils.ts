/**
 * languageUtils.ts
 * 
 * HEURISTIC LANGUAGE DETECTION
 * Used as a fallback and to assist UI alignment (RTL vs LTR) when the model
 * has not yet returned a source language tag.
 * 
 * Uses Unicode block ranges to identify scripts (Arabic, Devanagari, Han, etc.).
 */

export const detectLanguage = (text: string): string => {
  if (!text) return 'unknown';
  
  // Arabic Block: Covers Arabic, Persian, Urdu.
  const arabicRegex = /[\u0600-\u06FF]/;
  if (arabicRegex.test(text)) {
    // Urdu-specific characters help distinguish it from standard Arabic.
    if (/[ٹڈڑںہے]/.test(text)) return 'ur';
    return 'ar'; 
  }
  
  // Devanagari Block: Hindi, Marathi, etc.
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi';
  }

  // Han Script: Chinese (Mandarin/Wu/Cantonese).
  const hanRegex = /[\u4E00-\u9FFF]/;
  if (hanRegex.test(text)) return 'zh';

  // Japanese: Hiragana and Katakana.
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
  if (japaneseRegex.test(text)) return 'ja';

  // Cyrillic Block: Russian, Ukrainian.
  const cyrillicRegex = /[\u0400-\u04FF]/;
  if (cyrillicRegex.test(text)) {
    if (/[іїєґІЇЄҐ]/.test(text)) return 'uk';
    return 'ru';
  }

  // Turkish specific marks.
  const turkishRegex = /[ıİğĞşŞ]/;
  if (turkishRegex.test(text)) return 'tr';

  // Latin fallback (Standard Western European characters).
  const latinRegex = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑàèìòù]/;
  if (latinRegex.test(text)) return 'es'; 
  
  return 'unknown';
};
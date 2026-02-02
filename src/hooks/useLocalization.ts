/**
 * useLocalization.ts
 * 
 * UI LOCALIZATION HOOK
 * Automatically detects the user's browser language and selects the
 * corresponding translation dictionary for the app interface.
 * 
 * Falls back to English if the browser language is not explicitly supported.
 */

import { useState } from 'react';
import { UI_TRANSLATIONS, TranslationDictionary } from '../utils/uiTranslations';

export const useLocalization = () => {
  // Initialize state based on browser language immediately
  const [langCode] = useState(() => {
    const browserLang = typeof navigator !== 'undefined' 
      ? navigator.language.split('-')[0].toLowerCase() 
      : 'en';
    return UI_TRANSLATIONS[browserLang] ? browserLang : 'en';
  });

  // Return the selected dictionary (t) and the current code.
  const t: TranslationDictionary = UI_TRANSLATIONS[langCode] || UI_TRANSLATIONS['en'];
  
  return { t, langCode };
};
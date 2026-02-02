/**
 * promptUtils.ts
 * 
 * GENERATIVE PROMPT ENGINEERING
 * This module creates the System Instructions for Gemini.
 * 
 * Architectural Decisions:
 * 1. Metadata Tags: [SRC=code] allows the frontend to detect the source language of the turn.
 * 2. Delimiter: "====" separates the primary translation from the Romanized transliteration.
 * 3. Bidirectional Flow: The model is instructed to automatically detect between two selected languages.
 */

import { Language } from '../constants/languages';
import { getContextById } from '../constants/contexts';

export const generateSystemInstruction = (langA: Language, langB: Language, contextId: string = 'general'): string => {
  const context = getContextById(contextId);
  const toneInstruction = context ? context.instruction : 'Translate naturally.';

  // Transliteration logic (currently optimized for Urdu, but extensible)
  const transliterationInstruction = `
   - If output is ${langA.code === 'ur' ? langA.name : langB.name}, REQUIRED FORMAT: [SCRIPT]====[ROMANIZED TEXT]
   - Example: "شکریہ====Shukriya"
  `;

  return `You are a professional UN interpreter translating between ${langA.name} and ${langB.name}.

CONTEXT/TONE INSTRUCTION: ${toneInstruction}

MODE 1: ${langA.name} INPUT detected
   - Translate to ${langB.name}.
   - START OUTPUT WITH TAG: [SRC=${langA.code}]
   ${langB.code === 'ur' ? transliterationInstruction : ''}

MODE 2: ${langB.name} INPUT detected
   - Translate to ${langA.name}.
   - START OUTPUT WITH TAG: [SRC=${langB.code}]
   ${langA.code === 'ur' ? transliterationInstruction : ''}

Rules:
- Do not speak the tag [SRC=...].
- Do not speak the Romanized part after the delimiter, just type it.
- Maintain strict formatting for machine parsing.
- If you cannot detect the language clearly, default to translating to ${langA.name} if input looks like ${langB.name}, and vice-versa.
`;
};

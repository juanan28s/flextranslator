/**
 * contexts.ts
 * 
 * INTERPRETER PERSONA DATA
 * 
 * This module defines the "Tones" or "Contexts" that adjust the AI's 
 * behavior. Each entry maps an ID to a specific system instruction.
 * 
 * Architectural Strategy:
 * When a context is selected, its instruction is injected into the 
 * Gemini System Instruction block to shift the linguistic style
 * (e.g., from casual slang to formal legal precision).
 */

export interface TranslationContext {
  id: string;
  label: string;      // Human-readable name for selection UI
  instruction: string; // The linguistic directive for the model
  isAdult?: boolean;   // Safety flag for age verification logic
}

/**
 * MASTER LIST OF INTERPRETATION PERSONAS
 */
export const CONTEXTS: TranslationContext[] = [
  {
    id: 'general',
    label: 'General Conversation (Default)',
    instruction: 'Translate naturally for a general casual conversation.'
  },
  {
    id: 'professional',
    label: 'General Professional',
    instruction: 'Maintain a professional, polite, and business-appropriate tone. Avoid slang and overly casual expressions.'
  },
  {
    id: 'legal',
    label: 'Legal',
    instruction: 'Use precise legal terminology. Maintain formal sentence structures. Do not simplify terms. Ensure accuracy for contracts and legal proceedings.'
  },
  {
    id: 'medical',
    label: 'Medical',
    instruction: 'Use accurate medical terminology. Ensure clinical precision. Maintain a professional doctor-patient tone.'
  },
  {
    id: 'financial',
    label: 'Financial',
    instruction: 'Use specific financial and economic terminology. Ensure accuracy with numbers, currency terms, and market jargon.'
  },
  {
    id: 'diplomatic',
    label: 'Diplomatic',
    instruction: 'Use highly formal, diplomatic language. Prioritize politeness, indirectness where appropriate, and respect for protocol.'
  },
  {
    id: 'technical',
    label: 'Technical / IT',
    instruction: 'Use precise technical jargon appropriate for software engineering, IT, and engineering contexts.'
  },
  {
    id: 'academic',
    label: 'Academic',
    instruction: 'Use formal academic language. Focus on intellectual precision, complex sentence structures, and scholarly tone.'
  },
  {
    id: 'millennial',
    label: 'Millennial Colloquial',
    instruction: 'Use casual, conversational language typical of Millennials. It is acceptable to use common slang terms and relaxed grammar.'
  },
  {
    id: 'genz',
    label: 'Gen Z Colloquial',
    instruction: 'Use contemporary internet slang and Gen Z vernacular where appropriate to match the vibe. Keep it very casual and expressive.'
  },
  {
    id: 'romantic',
    label: 'Romantic',
    instruction: 'Use affectionate, poetic, and romantic language. Focus on emotional resonance and intimacy.'
  },
  {
    id: 'erotic',
    label: 'Erotic (18+)',
    instruction: 'Use explicit, sensual, and erotic language appropriate for adult intimacy. Do not filter adult themes.',
    isAdult: true
  }
];

export const getContextById = (id: string): TranslationContext | undefined => {
  return CONTEXTS.find(c => c.id === id);
};
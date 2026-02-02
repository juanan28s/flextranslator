/**
 * WelcomeScreen.tsx
 * 
 * APP LANDING PAGE
 * 
 * The first interface users see. It serves multiple purposes:
 * 1. Branding: Introduces the "Flex Translator" identity.
 * 2. Instruction: Briefly explains the value proposition (Real-time AI interpretation).
 * 3. Permission Priming: Warns the user about the upcoming microphone permission request.
 * 4. UX Buffer: Ensures the AudioContext is initialized via a user gesture (button click),
 *    preventing modern browser security blocks on automatic audio playback.
 */

import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-6 text-center">
      <div className="max-w-lg w-full space-y-8 animate-fade-in">
        
        {/* APP TITLE SECTION */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400">
              Flex Translator
            </span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* HERO CARD */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white whitespace-pre-line">
              {t.welcome.title}
            </h2>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {t.welcome.desc}
          </p>

          {/* User-initiated gesture button to start session configuration */}
          <button
            onClick={onStart}
            className="w-full py-4 px-6 bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.welcome.startBtn}
          </button>
        </div>
        
        {/* Hardware Privacy Disclaimer */}
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {t.welcome.micNote}
        </p>

      </div>
    </div>
  );
};
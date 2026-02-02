/**
 * LanguageSelectionScreen.tsx
 * 
 * SESSION CONFIGURATION INTERFACE
 * 
 * Allows users to define the parameters of their translation session:
 * 1. Bidirectional Language Selection: Choose any two supported languages.
 * 2. Swapping: Quickly switch the 'dominant' and 'secondary' roles.
 * 3. Tone/Persona Selection: Define the AI's professional or casual style.
 * 4. Safety/Age Check: Implements a gate for adult/erotic contexts.
 * 
 * This screen acts as the final setup gate before hardware (microphone) is activated.
 */

import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, Language } from '../constants/languages';
import { CONTEXTS } from '../constants/contexts';
import { useLocalization } from '../hooks/useLocalization';

interface LanguageSelectionScreenProps {
  onStart: (langA: Language, langB: Language, contextId: string) => void;
  onBack: () => void;
  initialLangA?: Language;
  initialLangB?: Language;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ 
  onStart, 
  onBack, 
  initialLangA, 
  initialLangB 
}) => {
  const { t } = useLocalization();

  // STATE: Active language pair. Defaults to Spanish and Urdu if not provided.
  const [langA, setLangA] = useState<Language>(
    initialLangA || SUPPORTED_LANGUAGES.find(l => l.code === 'es') || SUPPORTED_LANGUAGES[0]
  );
  const [langB, setLangB] = useState<Language>(
    initialLangB || SUPPORTED_LANGUAGES.find(l => l.code === 'ur') || SUPPORTED_LANGUAGES[1]
  );
  
  const [contextId, setContextId] = useState<string>('general');
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [pendingContextId, setPendingContextId] = useState<string | null>(null);

  /**
   * Validates selections before signaling the session start.
   */
  const handleStart = () => {
    if (langA.code === langB.code) {
      alert("Please select two different languages.");
      return;
    }
    onStart(langA, langB, contextId);
  };

  /**
   * Reverses the order of languages in the pair.
   */
  const handleSwap = () => {
    const temp = langA;
    setLangA(langB);
    setLangB(temp);
  };

  /**
   * Manages tone selection and triggers age verification for adult contexts.
   */
  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const context = CONTEXTS.find(c => c.id === newId);

    if (context?.isAdult) {
      setPendingContextId(newId);
      setShowAgeModal(true);
    } else {
      setContextId(newId);
    }
  };

  /**
   * Finalizes an adult context selection after user confirmation.
   */
  const confirmAge = () => {
    if (pendingContextId) {
      setContextId(pendingContextId);
    }
    setShowAgeModal(false);
    setPendingContextId(null);
  };

  const cancelAge = () => {
    setShowAgeModal(false);
    setPendingContextId(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-6 animate-fade-in py-10">
      <div className="max-w-md w-full space-y-8">
        {/* Screen Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">{t.config.title}</h2>
          <p className="text-slate-400">{t.config.desc}</p>
        </div>

        {/* Configuration Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl relative">
          
          {/* Language Input A */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">{t.config.lang1}</label>
            <select 
              value={langA.code}
              onChange={(e) => {
                const selected = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (selected) setLangA(selected);
              }}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button: Floating circle positioned between the two language dropdowns */}
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              onClick={handleSwap}
              className="flex items-center justify-center w-16 h-16 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-full transition-all transform hover:scale-105 shadow-lg border-4 border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Swap Languages"
              aria-label="Swap Languages"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
               </svg>
            </button>
          </div>

          {/* Language Input B */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">{t.config.lang2}</label>
            <select 
              value={langB.code}
              onChange={(e) => {
                const selected = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (selected) setLangB(selected);
              }}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-700 my-4"></div>

          {/* Tone Selector: Defines the persona instruction sent to the model */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">{t.config.tone}</label>
            <select 
              value={contextId}
              onChange={handleContextChange}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {CONTEXTS.map(ctx => (
                <option key={ctx.id} value={ctx.id}>
                  {ctx.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 italic">
               {CONTEXTS.find(c => c.id === contextId)?.instruction.substring(0, 100)}...
            </p>
          </div>

        </div>

        {/* Primary Controls */}
        <div className="flex gap-4">
           <button
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors"
          >
            {t.config.back}
          </button>
          <button
            onClick={handleStart}
            className="flex-2 w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            {t.config.start}
          </button>
        </div>
      </div>

      {/* COMPONENT: Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-rose-900/50 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.config.ageTitle}</h3>
            <p className="text-slate-300 mb-6">
              {t.config.ageDesc}
            </p>
            <div className="flex gap-3">
              <button onClick={cancelAge} className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">{t.config.cancel}</button>
              <button onClick={confirmAge} className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors">{t.config.confirmAge}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
/**
 * TranslationLog.tsx
 * 
 * LOG CONTAINER COMPONENT
 * Renders the list of translation items and manages auto-scrolling to the latest entry.
 * It also handles the "Empty State" UI and triggers the AudioVisualizer.
 */

import React, { useEffect, useRef } from 'react';
import { TranslationLogItem } from '../types';
import { TranslationItem } from './TranslationItem';
import { AudioVisualizer } from './AudioVisualizer';
import { Language } from '../constants/languages';
import { useLocalization } from '../hooks/useLocalization';

interface TranslationLogProps {
  items: TranslationLogItem[];
  connectionState: string;
  onUpdateItem: (id: string, newText: string) => void;
  activeStream?: MediaStream | null;
  isPaused: boolean;
  languages?: { langA: Language, langB: Language } | null;
}

export const TranslationLog: React.FC<TranslationLogProps> = ({ items, connectionState, onUpdateItem, activeStream, isPaused, languages }) => {
  const { t } = useLocalization();
  const bottomRef = useRef<HTMLDivElement>(null);

  // AUTO-SCROLL: Ensures the user always sees the most recent transcription chunks.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items.length, items[items.length - 1]?.translatedText]);

  // EMPTY STATE: Displayed when no translations exist.
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner relative overflow-hidden">
           {connectionState === 'connected' && activeStream ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <AudioVisualizer stream={activeStream} isPaused={isPaused} />
             </div>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
           )}
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">
           {connectionState === 'connected' ? (isPaused ? t.log.paused : t.controls.listening) : t.log.ready}
        </h3>
        <p className="max-w-xs mx-auto text-slate-500">
           {connectionState === 'connected' ? (isPaused ? t.controls.tapToResume : t.log.goAhead) : t.log.pressMic}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {items.map((item) => {
        // TTS TARGET RESOLUTION:
        // We calculate the target language code for Text-to-Speech by checking which language 
        // in the pair was NOT the detected source.
        let targetCode = 'en'; 
        if (languages) {
           if (item.sourceLanguage === languages.langA.code) {
             targetCode = languages.langB.code;
           } else if (item.sourceLanguage === languages.langB.code) {
             targetCode = languages.langA.code;
           } else {
             targetCode = languages.langB.code; // Default fallback
           }
        }

        return (
          <TranslationItem 
            key={item.id} 
            item={item} 
            onUpdate={onUpdateItem}
            targetLanguageCode={targetCode}
          />
        );
      })}
      
      {/* ACTIVE LISTENING INDICATOR: Shows visualizer at the bottom while connected */}
      {connectionState === 'connected' && (
        <div className="flex flex-col items-center justify-center pt-4 opacity-70">
           {activeStream ? (
             <AudioVisualizer stream={activeStream} isPaused={isPaused} />
           ) : (
              <div className="flex gap-1 h-8 items-center">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
           )}
           <p className={`text-xs mt-2 font-medium tracking-wide uppercase ${isPaused ? 'text-amber-500' : 'text-slate-500'}`}>
             {isPaused ? t.log.paused : t.log.listening}
           </p>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};
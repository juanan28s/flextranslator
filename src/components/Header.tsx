/**
 * Header.tsx
 * 
 * NAVIGATION & BRANDING COMPONENT
 * 
 * Provides the top-level interface for:
 * 1. App Identity (Flex Translator branding).
 * 2. Tone/Context Selection: Opens a modal to change the AI's persona.
 * 3. Language Overview & Switcher: Displays current language pair and allows quick swapping or resetting.
 * 4. Export Action: Triggers the PDF generation modal.
 * 
 * Uses responsive design to hide labels on small screens while maintaining accessibility through tooltips.
 */

import React from 'react';
import { Language } from '../constants/languages';
import { getContextById } from '../constants/contexts';
import { useLocalization } from '../hooks/useLocalization';

interface HeaderProps {
  onExport: () => void;
  hasItems: boolean;
  languages?: { langA: Language, langB: Language } | null;
  onChangeLanguages: () => void;
  contextId?: string;
  onChangeContext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onExport, 
  hasItems, 
  languages, 
  onChangeLanguages, 
  contextId, 
  onChangeContext 
}) => {
  // Localization hook handles UI text in the user's browser language.
  const { t } = useLocalization();
  
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-10 gap-4 sm:gap-0 shadow-sm">
      {/* Branding Section */}
      <div className="flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400">
            Flex Translator
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-medium">{t.subtitle}</p>
      </div>
      
      {/* Action Bar */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
        {languages && (
          <>
            {/* Tone Selector: Displays a truncated version of the current AI Persona */}
            <button
              onClick={onChangeContext}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 border border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
              title={t.config.tone}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
               <span className="max-w-[100px] truncate hidden xs:inline">
                 {getContextById(contextId || 'general')?.label.split('(')[0].trim()}
               </span>
               <span className="xs:hidden">{t.header.tone}</span>
            </button>

            {/* Language Switcher: Visualization of the active bidirectional pair */}
            <button
              onClick={onChangeLanguages}
              className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-slate-400 border border-slate-800 bg-slate-800/50 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all group"
              title={t.header.switch}
            >
              <span className="flex items-center gap-1.5" title={languages.langA.name}>
                <span className="text-lg">{languages.langA.flag}</span> <span className="hidden sm:inline">{languages.langA.code.toUpperCase()}</span>
              </span>
              <span className="text-slate-600 group-hover:text-slate-400 transition-colors">⇄</span>
              <span className="flex items-center gap-1.5" title={languages.langB.name}>
                <span className="text-lg">{languages.langB.flag}</span> <span className="hidden sm:inline">{languages.langB.code.toUpperCase()}</span>
              </span>
            </button>
          </>
        )}

        {/* Export Button: Enabled only if there's conversation history to save */}
        <button
          onClick={onExport}
          disabled={!hasItems}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
            ${hasItems 
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600' 
              : 'bg-slate-800/50 border-transparent text-slate-600 cursor-not-allowed'
            }`}
          title={t.export.title}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">{t.header.export}</span>
        </button>
      </div>
    </header>
  );
};
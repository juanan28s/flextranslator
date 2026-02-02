/**
 * TranslationItem.tsx
 * 
 * CHAT BUBBLE COMPONENT
 * Renders an individual conversation turn.
 * Features:
 * 1. Manual editing of source text.
 * 2. Automatic re-translation on edit.
 * 3. Text-to-Speech (TTS) for the translated text.
 * 4. Clipboard copy functionality.
 * 5. RTL/LTR dynamic layout based on source language.
 */

import React, { useState } from 'react';
import { TranslationLogItem } from '../types';
import { getLanguageByCode } from '../constants/languages';
import { useLocalization } from '../hooks/useLocalization';

interface TranslationItemProps {
  item: TranslationLogItem;
  onUpdate: (id: string, newText: string) => void;
  targetLanguageCode?: string;
}

export const TranslationItem: React.FC<TranslationItemProps> = ({ item, onUpdate }) => {
  const { t } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.sourceText);
  const [prevSourceText, setPrevSourceText] = useState(item.sourceText);
  
  const [_showSourceCopied, _setShowSourceCopied] = useState(false);
  const [_showTransCopied, _setShowTransCopied] = useState(false);

  // Sync local state with prop updates (e.g., during live streaming)
  if (item.sourceText !== prevSourceText) {
    setPrevSourceText(item.sourceText);
    if (!isEditing) setEditText(item.sourceText);
  }

  const handleSave = () => {
    if (editText.trim() !== item.sourceText) onUpdate(item.id, editText);
    setIsEditing(false);
  };

  /*
  const _handlePlayTTS = () => {
    if (!item.translatedText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.translatedText);
    if (targetLanguageCode) utterance.lang = targetLanguageCode;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  */

  // --- DYNAMIC STYLING ---
  const sourceLangConfig = getLanguageByCode(item.sourceLanguage);
  // const targetLangConfig = targetLanguageCode ? getLanguageByCode(targetLanguageCode) : undefined;
  
  // RTL Detection: Determines if bubble is on Right or Left.
  const isRTL = sourceLangConfig?.direction === 'rtl';
  const alignRight = isRTL; 

  const bubbleColor = alignRight ? 'bg-slate-800 border-emerald-900/50' : 'bg-slate-800 border-blue-900/50';
  const headerBg = alignRight ? 'bg-emerald-900/20' : 'bg-blue-900/20';
  const bodyBg = alignRight ? 'bg-blue-900/10' : 'bg-emerald-900/10';
  
  return (
    <div className={`flex w-full ${alignRight ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        relative max-w-[90%] sm:max-w-[80%] rounded-2xl shadow-lg border overflow-hidden transition-all
        ${alignRight ? 'rounded-tr-none' : 'rounded-tl-none'}
        ${bubbleColor}
        border-slate-700
      `}>
        
        {/* SOURCE TEXT BLOCK */}
        <div className={`p-3 sm:p-4 border-b border-slate-700/50 ${headerBg}`}>
           <div className="flex items-center justify-between gap-4 mb-2">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
               {sourceLangConfig?.flag} {t.log.original} ({sourceLangConfig?.name || 'Unknown'})
             </span>
             {/* Action Buttons: Copy, Edit */}
           </div>

           {isEditing ? (
             <div className="flex flex-col gap-2">
               <textarea 
                 value={editText}
                 onChange={(e) => setEditText(e.target.value)}
                 className="w-full p-2 text-sm rounded bg-slate-900 border border-slate-600 text-slate-200 outline-none"
                 rows={Math.max(2, Math.ceil(editText.length / 50))}
                 autoFocus
               />
               <div className="flex justify-end gap-2">
                 <button onClick={() => setIsEditing(false)} className="text-xs px-2 py-1 text-slate-400">Cancel</button>
                 <button onClick={handleSave} className="text-xs px-2 py-1 text-white bg-blue-600 rounded">Save</button>
               </div>
             </div>
           ) : (
             <p className={`text-base leading-relaxed ${isRTL ? 'text-right' : 'text-left'} ${sourceLangConfig?.font || ''}`}>
               {item.sourceText || '...'}
             </p>
           )}
        </div>

        {/* TRANSLATION BLOCK */}
        <div className={`p-3 sm:p-4 relative ${bodyBg}`}>
           {/* Translation Header, Play/Copy Buttons */}
           <div className="relative">
             <p className={`text-lg font-medium leading-relaxed ${isRTL ? 'text-left' : 'text-right'}`}>
               {item.translatedText || '...'}
             </p>
             {/* Transliteration: Shows Romanized text if available */}
             {item.transliteration && (
               <div className="mt-2 pt-2 border-t border-slate-700/50 text-amber-300 italic text-sm">
                 {item.transliteration}
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};
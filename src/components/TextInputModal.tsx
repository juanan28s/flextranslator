/**
 * TextInputModal.tsx
 * 
 * MANUAL TEXT TRANSLATION MODAL
 * 
 * Provides an interface for translating large blocks of text that are
 * already written (e.g., from an email or article).
 * 
 * Unlike the Live session, this uses a single-shot REST API call to 
 * Gemini Flash to process the request immediately and add it to the 
 * conversation log.
 */

import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useLocalization();
  const [text, setText] = useState('');

  if (!isOpen) return null;

  /**
   * Submits the text for translation.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onConfirm(text);
      setText(''); // Clear input for next use
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-scale-in">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">{t.textInput.title}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-40 resize-none placeholder-slate-500"
              placeholder={t.textInput.placeholder}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white font-medium hover:bg-slate-700 rounded-lg transition-colors"
            >
              {t.textInput.cancel}
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              {t.textInput.translate}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
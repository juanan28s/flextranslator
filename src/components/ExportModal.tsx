/**
 * ExportModal.tsx
 * 
 * SESSION ARCHIVING MODAL
 * 
 * Allows users to:
 * 1. Name their export file.
 * 2. Initiate the PDF generation process.
 * 3. Monitor generation status (loading states).
 * 
 * Uses the modern File System Access API (where available) to suggest a filename
 * while maintaining compatibility with standard browser downloads.
 */

import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
  isGenerating: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm, isGenerating }) => {
  const { t } = useLocalization();
  // Default filename is pre-populated with today's date for user convenience.
  const [filename, setFilename] = useState(`translation-history-${new Date().toISOString().split('T')[0]}`);

  if (!isOpen) return null;

  /**
   * Validates and submits the export request.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filename.trim()) {
      onConfirm(filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden scale-100 opacity-100 transition-all">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{t.export.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{t.export.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="filename" className="block text-sm font-medium text-slate-700 mb-2">
              {t.export.filename}
            </label>
            {/* Input field for filename with extension suffix */}
            <div className="relative">
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12 text-slate-700"
                placeholder={t.export.enterFilename}
                autoFocus
                disabled={isGenerating}
              />
              <span className="absolute right-4 top-3.5 text-slate-400 select-none">.pdf</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {t.export.note}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t.export.cancel}
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md shadow-blue-200 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  {/* Generation Spinner */}
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.export.saving}
                </>
              ) : (
                t.export.confirm
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
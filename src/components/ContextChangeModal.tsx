/**
 * ContextChangeModal.tsx
 * 
 * IN-SESSION PERSONA SWITCHER
 * 
 * Allows users to change the interpreter's tone without starting a new session.
 * 
 * Workflow:
 * 1. User selects a new context.
 * 2. If adult context is chosen, age verification is triggered.
 * 3. On confirmation, the parent App component disconnects and reconnects 
 *    the Live session with the updated instruction set.
 */

import React, { useState } from 'react';
import { CONTEXTS } from '../constants/contexts';
import { useLocalization } from '../hooks/useLocalization';

interface ContextChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContextId: string;
  onConfirm: (contextId: string) => void;
}

export const ContextChangeModal: React.FC<ContextChangeModalProps> = ({ isOpen, onClose, currentContextId, onConfirm }) => {
  const { t } = useLocalization();
  // LOCAL STATE: Tracks the user's selection before final confirmation.
  const [selectedId, setSelectedId] = useState(currentContextId);
  const [showAgeCheck, setShowAgeCheck] = useState(false);

  if (!isOpen) return null;

  /**
   * Handles individual item clicks, gating adult content behind a second check.
   */
  const handleSelect = (id: string) => {
    const context = CONTEXTS.find(c => c.id === id);
    if (context?.isAdult) {
        setSelectedId(id);
        setShowAgeCheck(true);
    } else {
        setSelectedId(id);
        setShowAgeCheck(false);
    }
  };

  const handleConfirm = () => {
    if (showAgeCheck) return; 
    onConfirm(selectedId);
    onClose();
  };
  
  const confirmAge = () => {
      onConfirm(selectedId);
      onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col max-h-[80vh] animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-800">
           <h2 className="text-lg font-bold text-white">{t.contextModal.title}</h2>
           <p className="text-sm text-slate-400">{t.contextModal.subtitle}</p>
        </div>

        {/* Modal Body: Scrollable list of persona options */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           {showAgeCheck ? (
               /* AGE VERIFICATION VIEW: Triggered if an adult context is selected */
               <div className="text-center py-6 animate-fade-in">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.config.ageTitle}</h3>
                    <p className="text-slate-300 mb-6 px-4">
                        {t.config.ageDesc}
                    </p>
                    <div className="flex gap-3 px-4">
                        <button onClick={() => setShowAgeCheck(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-colors">{t.config.cancel}</button>
                        <button onClick={confirmAge} className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors">{t.config.confirmAge}</button>
                    </div>
               </div>
           ) : (
               /* LIST VIEW: Displays all available tones with descriptions */
               <div className="space-y-2">
                   {CONTEXTS.map(ctx => (
                       <button
                         key={ctx.id}
                         onClick={() => handleSelect(ctx.id)}
                         className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                             selectedId === ctx.id 
                             ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 ring-1 ring-blue-500/50' 
                             : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                         }`}
                       >
                           <div className="font-semibold flex items-center gap-2">
                               {ctx.label}
                               {ctx.isAdult && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded">18+</span>}
                           </div>
                           <div className="text-xs opacity-60 mt-1 line-clamp-2 leading-relaxed">{ctx.instruction}</div>
                       </button>
                   ))}
               </div>
           )}
        </div>

        {/* Modal Footer: Confirmation actions */}
        {!showAgeCheck && (
            <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">{t.contextModal.cancel}</button>
                <button onClick={handleConfirm} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all">{t.contextModal.apply}</button>
            </div>
        )}
      </div>
    </div>
  );
};
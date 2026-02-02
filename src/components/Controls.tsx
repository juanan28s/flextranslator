/**
 * Controls.tsx
 * 
 * INTERACTION CONTROL PANEL
 * 
 * The primary dashboard for managing translation activity:
 * 1. Start/Stop Session: Orchestrates the WebSocket connection.
 * 2. Pause/Resume: Suspends audio processing while maintaining the AI context.
 * 3. Speech Toggle: Mutes/unmutes the AI's vocal interpretation.
 * 4. Multi-modal Input:
 *    - PDF: Upload documents for one-shot batch translation.
 *    - Paste: Manual text entry for translation.
 * 5. Error Handling: Displays contextual API and hardware errors.
 * 
 * Situated at the bottom for ergonomic mobile access.
 */

import React, { useRef } from 'react';
import { ConnectionState } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface ControlsProps {
  connectionState: ConnectionState;
  onConnect: () => void;
  onDisconnect: () => void;
  error: string | null;
  isPaused: boolean;
  onTogglePause: () => void;
  onPasteText: () => void;
  onUploadPdf: (file: File) => void;
  isLiveOutputEnabled?: boolean;
  onToggleLiveOutput?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  connectionState, 
  onConnect, 
  onDisconnect, 
  error, 
  isPaused, 
  onTogglePause,
  onPasteText,
  onUploadPdf,
  isLiveOutputEnabled,
  onToggleLiveOutput
}) => {
  const { t } = useLocalization();
  // Reference used to reset the file input so the same file can be uploaded twice if needed.
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting';

  /**
   * Forwards the selected PDF file to the parent controller for Base64 processing.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadPdf(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-6 pb-8 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
        
        {/* Error Notification Bar */}
        {error && (
           <div className="w-full bg-red-900/20 border border-red-900/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 justify-center mb-2 animate-pulse">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
             {error}
           </div>
        )}

        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
          
          {/* STATIC TEXT INPUT: Allows users to paste long text for translation */}
          <button
            onClick={onPasteText}
            disabled={!isConnected && !error && connectionState !== 'disconnected'}
            className="flex flex-col items-center justify-center gap-1 group w-16"
            title={t.controls.pasteText}
          >
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/50 group-hover:bg-slate-700/50 flex items-center justify-center transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300">Text</span>
          </button>

          <div className="flex items-center gap-4">
             {/* AI VOICE TOGGLE: Disables vocal synthesis playback while keeping text transcription live */}
            {isConnected && onToggleLiveOutput && (
                <button
                onClick={onToggleLiveOutput}
                className={`
                    flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 border-2
                    ${isLiveOutputEnabled 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                `}
                title={isLiveOutputEnabled ? t.controls.muteLive : t.controls.unmuteLive}
                >
                {isLiveOutputEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
                </button>
            )}

             {/* PAUSE CONTROL: Suspends the microphone input stream while connected */}
            {isConnected && (
                <button
                onClick={onTogglePause}
                className={`
                    flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 border-2
                    ${isPaused 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }
                `}
                aria-label={isPaused ? "Resume Translation" : "Pause Translation"}
                title={isPaused ? t.controls.tapToResume : t.controls.paused}
                >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                </button>
            )}

          </div>
        </div>

        {/* PRIMARY SESSION BUTTON: Starts the interpretation logic or stops it completely */}
        <div className="w-full flex justify-center">
          {connectionState === 'disconnected' ? (
            <button
              onClick={onConnect}
              className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-rose-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              {t.controls.tapToStart}
            </button>
          ) : (
            <button
              onClick={onDisconnect}
              disabled={isConnecting}
              className={`
                w-full sm:w-auto px-8 py-4 text-white text-lg font-bold rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3
                ${isConnecting ? 'bg-slate-700 cursor-wait' : 'bg-slate-700 hover:bg-slate-600 shadow-slate-900/20'}
              `}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.controls.connecting}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Stop Session
                </>
              )}
            </button>
          )}
        </div>
        
        {/* DOCUMENT UPLOAD: Hidden input triggered by the button above when connected */}
        <div className="text-center">
             <input 
               type="file" 
               accept="application/pdf"
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden" 
             />
             <p className="text-xs text-slate-500">
                {isConnected ? (
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="hover:text-blue-400 transition-colors underline decoration-slate-700 underline-offset-2"
                   >
                     {t.controls.uploadPdf}
                   </button>
                ) : (
                   t.log.pressMic
                )}
             </p>
        </div>

      </div>
    </div>
  );
};
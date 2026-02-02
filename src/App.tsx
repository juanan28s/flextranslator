/**
 * App.tsx
 * 
 * MAIN APPLICATION CONTAINER & ORCHESTRATOR
 * 
 * This component serves as the central hub for the Flex Translator application.
 * Its primary responsibilities include:
 * 
 * 1. PERSISTENT STATE MANAGEMENT:
 *    Coordinates transitions between the Welcome screen, Language Selection, and the Main Session UI.
 * 
 * 2. LIVE TRANSLATOR INTEGRATION:
 *    Interfaces with the `useLiveTranslator` hook to manage real-time audio interpretation sessions.
 * 
 * 3. MULTI-MODAL INPUT HANDLING:
 *    - Static Text: Handles pasted text translation via one-shot Gemini Flash calls.
 *    - PDF Documents: Manages file reading and Base64 conversion for AI document analysis.
 * 
 * 4. SESSION ACTIONS:
 *    - Tone Switching: Orchestrates session teardown and reconstruction when the AI persona is changed.
 *    - Exporting: Triggers the sophisticated html2canvas -> jsPDF generation pipeline.
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TranslationLog } from './components/TranslationLog';
import { Controls } from './components/Controls';
import { ExportModal } from './components/ExportModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LanguageSelectionScreen } from './components/LanguageSelectionScreen';
import { ContextChangeModal } from './components/ContextChangeModal';
import { TextInputModal } from './components/TextInputModal';
import { useLiveTranslator } from './hooks/useLiveTranslator';
import { Language } from './constants/languages';

const App: React.FC = () => {
  // CORE LOGIC HOOK: Encapsulates all WebSocket and Audio hardware management.
  const { 
    connect, disconnect, updateLogItem, translateStaticContent,
    connectionState, items, error, activeStream, isPaused, togglePause, 
    sessionLanguages, sessionContext, setSessionContext
  } = useLiveTranslator();
  
  // MODAL STATES: Controls visibility of secondary interface overlays.
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isTextInputModalOpen, setIsTextInputModalOpen] = useState(false);
  
  // NAVIGATION STATE: Determines which major screen to render.
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLangSelect, setShowLangSelect] = useState(false);

  /**
   * Transitions from splash screen to configuration.
   */
  const handleStartWelcome = () => {
    setShowWelcome(false);
    setShowLangSelect(true);
  };

  /**
   * Initializes hardware and opens the WebSocket stream.
   * Triggered after user selects their languages and persona.
   */
  const handleStartSession = (langA: Language, langB: Language, contextId: string) => {
    setShowLangSelect(false);
    connect(langA, langB, contextId);
  };

  /**
   * Returns to the splash screen.
   */
  const handleBackToWelcome = () => {
    setShowLangSelect(false);
    setShowWelcome(true);
  };

  /**
   * Forces a session stop and returns to language selection.
   */
  const handleChangeLanguages = () => {
    disconnect();
    setShowLangSelect(true);
  };

  /**
   * Updates the AI persona mid-session.
   * NOTE: To ensure the system instruction is updated, we cycle the connection.
   */
  const handleContextChange = (newContextId: string) => {
    setSessionContext(newContextId);
    if (connectionState === 'connected' && sessionLanguages) {
      disconnect();
      // Brief delay ensures hardware is released before re-allocation.
      setTimeout(() => {
        connect(sessionLanguages.langA, sessionLanguages.langB, newContextId);
      }, 300);
    }
  };

  /**
   * Triggers the export dialog.
   */
  const handleExportClick = () => { setIsExportModalOpen(true); };

  /**
   * Executes the PDF generation utility via dynamic import to keep initial bundle size small.
   */
  const handleExportConfirm = async (filename: string) => {
    setIsGeneratingPdf(true);
    // 100ms delay ensures the UI has painted the "Generating..." state before CPU spike.
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const { generatePDF } = await import('./utils/pdfUtils');
      await generatePDF(items, filename);
    } catch (err) {
      console.error("Failed to load PDF engine:", err);
    }

    setIsGeneratingPdf(false);
    setIsExportModalOpen(false);
  };

  /**
   * Opens the manual text entry modal.
   */
  const handlePasteText = () => { setIsTextInputModalOpen(true); };

  /**
   * Delegates static text to the Gemini Flash processing pipeline.
   */
  const handleConfirmPasteText = (text: string) => { translateStaticContent(text); };

  /**
   * FILE UPLOAD PIPELINE:
   * Reads PDF files as Data URLs and extracts Base64 content for the Gemini API.
   */
  const handleUploadPdf = (file: File) => {
    if (!sessionLanguages || !file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(',')[1];
      // Send empty text with document attachment to trigger file translation logic.
      translateStaticContent("", { mimeType: 'application/pdf', data: base64Content });
    };
    reader.readAsDataURL(file);
  };

  // --- RENDER CONDITIONALS ---

  if (showWelcome) return <WelcomeScreen onStart={handleStartWelcome} />;

  if (showLangSelect) return <LanguageSelectionScreen 
      onStart={handleStartSession} onBack={handleBackToWelcome} 
      initialLangA={sessionLanguages?.langA} initialLangB={sessionLanguages?.langB}
  />;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* HEADER: Context, Language Pair, Export Actions */}
      <Header 
        onExport={handleExportClick} hasItems={items.length > 0} languages={sessionLanguages}
        onChangeLanguages={handleChangeLanguages} contextId={sessionContext}
        onChangeContext={() => setIsContextModalOpen(true)}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden max-w-5xl mx-auto w-full bg-slate-900">
        {/* LOG: Displays historical and live turns */}
        <TranslationLog 
          items={items} connectionState={connectionState} onUpdateItem={updateLogItem}
          activeStream={activeStream} isPaused={isPaused} languages={sessionLanguages}
        />
        
        {/* CONTROLS: Persistent interaction bar at bottom */}
        <Controls 
          connectionState={connectionState} 
          onConnect={() => { if (sessionLanguages) connect(sessionLanguages.langA, sessionLanguages.langB, sessionContext); }} 
          onDisconnect={disconnect} 
          error={error} 
          isPaused={isPaused} 
          onTogglePause={togglePause}
          onPasteText={handlePasteText} 
          onUploadPdf={handleUploadPdf}
        />
      </main>

      {/* OVERLAY MODALS */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onConfirm={handleExportConfirm} isGenerating={isGeneratingPdf} />
      <ContextChangeModal isOpen={isContextModalOpen} onClose={() => setIsContextModalOpen(false)} currentContextId={sessionContext} onConfirm={handleContextChange} />
      <TextInputModal isOpen={isTextInputModalOpen} onClose={() => setIsTextInputModalOpen(false)} onConfirm={handleConfirmPasteText} />
    </div>
  );
};

export default App;
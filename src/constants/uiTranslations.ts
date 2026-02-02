/**
 * constants/uiTranslations.ts (Redundant Reference)
 * 
 * This file contains the localization dictionaries for the application interface.
 * 
 * DEV NOTE: This file is currently duplicated in /utils/uiTranslations.ts. 
 * Ensure any updates to the UI text are mirrored in both or consolidated in the next refactor.
 */

export interface TranslationDictionary {
  subtitle: string;
  welcome: {
    title: string;
    desc: string;
    startBtn: string;
    micNote: string;
  };
  config: {
    title: string;
    desc: string;
    lang1: string;
    lang2: string;
    tone: string;
    back: string;
    start: string;
    ageTitle: string;
    ageDesc: string;
    cancel: string;
    confirmAge: string;
  };
  header: {
    tone: string;
    export: string;
    switch: string;
  };
  controls: {
    connecting: string;
    listening: string;
    paused: string;
    tapToStart: string;
    tapToResume: string;
    pasteText: string;
    uploadPdf: string;
    muteLive: string;
    unmuteLive: string;
  };
  log: {
    ready: string;
    pressMic: string;
    goAhead: string;
    original: string;
    translation: string;
    edit: string;
    save: string;
    cancel: string;
    listening: string;
    paused: string;
    copy: string;
    copied: string;
    processingPdf: string;
  };
  export: {
    title: string;
    subtitle: string;
    filename: string;
    enterFilename: string;
    note: string;
    cancel: string;
    confirm: string;
    saving: string;
  };
  contextModal: {
    title: string;
    subtitle: string;
    cancel: string;
    apply: string;
  };
  textInput: {
    title: string;
    placeholder: string;
    cancel: string;
    translate: string;
  };
}

// ... (Rest of dictionaries: en, es, pl, fr, de, it, pt, nl, ca)

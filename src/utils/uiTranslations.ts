/**
 * uiTranslations.ts
 * 
 * LOCALIZATION DICTIONARIES
 * 
 * Provides translations for all static UI elements (labels, buttons, tooltips).
 * 
 * Supported UI Languages:
 * - English (en) - Default
 * - Spanish (es)
 * - Polish (pl)
 * - French (fr)
 * - German (de)
 * - Italian (it)
 * - Portuguese (pt)
 * - Dutch (nl)
 * - Catalan (ca)
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

const baseEn: TranslationDictionary = {
  subtitle: "App by Juan Antonio powered by Gemini@",
  welcome: {
    title: "Welcome to\nFlex Translator",
    desc: "Experience real-time, bidirectional simultaneous translation across 30+ supported languages. Powered by the Gemini 2.5 Native Audio API, this tool acts as your professional personal interpreter—providing precise written transcripts and native Text-to-Speech playback.",
    startBtn: "Start Translation Session",
    micNote: "Ensure your microphone is enabled. Audio is processed in real-time."
  },
  config: {
    title: "Configure Session",
    desc: "Choose languages and interpretation tone.",
    lang1: "Language 1",
    lang2: "Language 2",
    tone: "Context / Tone",
    back: "Back",
    start: "Start Session",
    ageTitle: "Age Verification Required",
    ageDesc: "The \"Erotic\" context allows explicit content. You must be 18 years or older to use this feature.",
    cancel: "Cancel",
    confirmAge: "I am 18+"
  },
  header: {
    tone: "Tone",
    export: "PDF",
    switch: "Switch"
  },
  controls: {
    connecting: "Connecting to Secure Interpreter...",
    listening: "Listening & Translating...",
    paused: "Session Paused",
    tapToStart: "Tap to Start Translation",
    tapToResume: "Tap Resume to continue.",
    pasteText: "Paste Text",
    uploadPdf: "Upload PDF",
    muteLive: "Mute Live Speech",
    unmuteLive: "Enable Live Speech"
  },
  log: {
    ready: "Ready to Translate",
    pressMic: "Press the microphone button below to start the simultaneous translation session.",
    goAhead: "Go ahead, speak.",
    original: "ORIGINAL",
    translation: "TRANSLATION",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    listening: "Listening",
    paused: "Paused",
    copy: "Copy",
    copied: "Copied",
    processingPdf: "Processing PDF Document..."
  },
  export: {
    title: "Export History",
    subtitle: "Save conversation as PDF",
    filename: "File Name",
    enterFilename: "Enter filename",
    note: "You will be asked where to save the file.",
    cancel: "Cancel",
    confirm: "Export PDF",
    saving: "Saving..."
  },
  contextModal: {
    title: "Select Tone / Context",
    subtitle: "Choose the persona for the interpreter.",
    cancel: "Cancel",
    apply: "Apply Tone"
  },
  textInput: {
    title: "Translate Text",
    placeholder: "Type or paste text here...",
    cancel: "Cancel",
    translate: "Translate"
  }
};

const es: TranslationDictionary = {
  subtitle: "App de Juan Antonio potenciada por Gemini@",
  welcome: {
    title: "Bienvenido a\nFlex Translator",
    desc: "Traducción simultánea bidireccional en tiempo real. Impulsada por la API de Audio Nativo Gemini 2.5, esta herramienta actúa como su intérprete profesional personal.",
    startBtn: "Iniciar Sesión",
    micNote: "Asegúrese de que su micrófono esté habilitado."
  },
  config: {
    title: "Configurar Sesión",
    desc: "Elija idiomas y tono.",
    lang1: "Idioma 1",
    lang2: "Idioma 2",
    tone: "Contexto",
    back: "Atrás",
    start: "Comenzar",
    ageTitle: "Edad Requerida",
    ageDesc: "Contenido para adultos.",
    cancel: "Cancelar",
    confirmAge: "Soy mayor de 18"
  },
  header: {
    tone: "Tono",
    export: "PDF",
    switch: "Cambiar"
  },
  controls: {
    connecting: "Conectando al Intérprete...",
    listening: "Escuchando...",
    paused: "Pausada",
    tapToStart: "Iniciar",
    tapToResume: "Reanudar",
    pasteText: "Pegar",
    uploadPdf: "PDF",
    muteLive: "Silenciar",
    unmuteLive: "Voz"
  },
  log: {
    ready: "Listo",
    pressMic: "Presione el micrófono para iniciar.",
    goAhead: "Hable.",
    original: "ORIGINAL",
    translation: "TRADUCCIÓN",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    listening: "Escuchando",
    paused: "Pausado",
    copy: "Copiar",
    copied: "Copiado",
    processingPdf: "Procesando..."
  },
  export: {
    title: "Exportar",
    subtitle: "Guardar PDF",
    filename: "Nombre",
    enterFilename: "Ingrese nombre",
    note: "Elija carpeta.",
    cancel: "Cancelar",
    confirm: "Exportar",
    saving: "Guardando..."
  },
  contextModal: {
    title: "Tono",
    subtitle: "Elija personalidad.",
    cancel: "Cancelar",
    apply: "Aplicar"
  },
  textInput: {
    title: "Traducir Texto",
    placeholder: "Escriba aquí...",
    cancel: "Cancelar",
    translate: "Traducir"
  }
};

const pl: TranslationDictionary = {
  subtitle: "Aplikacja Juana Antonio wspierana przez Gemini@",
  welcome: {
    title: "Witaj w\nFlex Translator",
    desc: "Tłumaczenie symultaniczne w czasie rzeczywistym. Narzędzie oparte na Gemini 2.5 Native Audio API.",
    startBtn: "Rozpocznij Sesję",
    micNote: "Upewnij się, że mikrofon jest włączony."
  },
  config: {
    title: "Skonfiguruj Sesję",
    desc: "Wybierz języki i ton.",
    lang1: "Język 1",
    lang2: "Język 2",
    tone: "Kontekst",
    back: "Wstecz",
    start: "Rozpocznij",
    ageTitle: "Weryfikacja Wieku",
    ageDesc: "Treści dla dorosłych.",
    cancel: "Anuluj",
    confirmAge: "Mam 18+ lat"
  },
  header: {
    tone: "Ton",
    export: "PDF",
    switch: "Zmień"
  },
  controls: {
    connecting: "Łączenie z tłumaczem...",
    listening: "Słuchanie...",
    paused: "Wstrzymana",
    tapToStart: "Start",
    tapToResume: "Wznów",
    pasteText: "Wklej",
    uploadPdf: "PDF",
    muteLive: "Wycisz",
    unmuteLive: "Włącz"
  },
  log: {
    ready: "Gotowy",
    pressMic: "Naciśnij mikrofon, aby zacząć.",
    goAhead: "Mów teraz.",
    original: "ORYGINAŁ",
    translation: "TŁUMACZENIE",
    edit: "Edytuj",
    save: "Zapisz",
    cancel: "Anuluj",
    listening: "Słuchanie",
    paused: "Wstrzymano",
    copy: "Kopiuj",
    copied: "Skopiowano",
    processingPdf: "Przetwarzanie..."
  },
  export: {
    title: "Eksportuj",
    subtitle: "Zapisz PDF",
    filename: "Nazwa",
    enterFilename: "Wpisz nazwę",
    note: "Wybierz miejsce zapisu.",
    cancel: "Anuluj",
    confirm: "Eksportuj",
    saving: "Zapisywanie..."
  },
  contextModal: {
    title: "Wybierz Ton",
    subtitle: "Wybierz personę.",
    cancel: "Anuluj",
    apply: "Zastosuj"
  },
  textInput: {
    title: "Tłumacz Tekst",
    placeholder: "Wpisz tekst...",
    cancel: "Anuluj",
    translate: "Tłumacz"
  }
};

const fr: TranslationDictionary = {
  ...baseEn,
  subtitle: "App par Juan Antonio propulsée par Gemini@",
  welcome: { ...baseEn.welcome, title: "Bienvenue sur\nFlex Translator", startBtn: "Démarrer" },
  config: { ...baseEn.config, title: "Configurer", start: "Commencer" },
  log: { ...baseEn.log, original: "ORIGINAL", translation: "TRADUCTION", edit: "Modifier", save: "Enregistrer" },
  controls: { ...baseEn.controls, pasteText: "Coller", uploadPdf: "PDF" }
};

const de: TranslationDictionary = {
  ...baseEn,
  subtitle: "App von Juan Antonio powered by Gemini@",
  welcome: { ...baseEn.welcome, title: "Willkommen bei\nFlex Translator", startBtn: "Starten" },
  config: { ...baseEn.config, title: "Sitzung konfigurieren", start: "Starten" },
  log: { ...baseEn.log, original: "ORIGINAL", translation: "ÜBERSETZUNG", edit: "Bearbeiten" },
  controls: { ...baseEn.controls, pasteText: "Einfügen", uploadPdf: "PDF" }
};

const it: TranslationDictionary = {
  ...baseEn,
  subtitle: "App di Juan Antonio powered by Gemini@",
  welcome: { ...baseEn.welcome, title: "Benvenuto su\nFlex Translator", startBtn: "Inizia" },
  config: { ...baseEn.config, title: "Configura", start: "Inizia" },
  log: { ...baseEn.log, original: "ORIGINALE", translation: "TRADUZIONE", edit: "Modifica" },
  controls: { ...baseEn.controls, pasteText: "Incolla", uploadPdf: "PDF" }
};

const pt: TranslationDictionary = {
  ...baseEn,
  subtitle: "App por Juan Antonio powered by Gemini@",
  welcome: { ...baseEn.welcome, title: "Bem-vindo ao\nFlex Translator", startBtn: "Iniciar" },
  config: { ...baseEn.config, title: "Configurar", start: "Começar" },
  log: { ...baseEn.log, original: "ORIGINAL", translation: "TRADUÇÃO", edit: "Editar" },
  controls: { ...baseEn.controls, pasteText: "Colar", uploadPdf: "PDF" }
};

const nl: TranslationDictionary = {
  ...baseEn,
  welcome: { ...baseEn.welcome, title: "Welkom bij\nFlex Translator", startBtn: "Sessie Starten" },
  log: { ...baseEn.log, translation: "VERTALING" }
};

const ca: TranslationDictionary = {
  ...baseEn,
  welcome: { ...baseEn.welcome, title: "Benvingut a\nFlex Translator", startBtn: "Iniciar" },
  log: { ...baseEn.log, translation: "TRADUCCIÓ" }
};

export const UI_TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: baseEn,
  es: es,
  pl: pl,
  fr: fr,
  de: de,
  it: it,
  pt: pt,
  nl: nl,
  ca: ca
};
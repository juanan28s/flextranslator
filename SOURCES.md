# Project Sources

## Official Data Sources
- **Icons**: Lucide React (https://lucide.dev)
- **Fonts**: Google Fonts - Inter (https://fonts.google.com/specimen/Inter) & Noto Nastaliq Urdu (https://fonts.google.com/specimen/Noto+Nastaliq+Urdu)
- **Styling**: Tailwind CSS v4 (https://tailwindcss.com)
- **AI Engine**: Google Gemini API (https://ai.google.dev) - `@google/genai` SDK
- **PDF Generation**: jsPDF (https://github.com/parallax/jsPDF) & html2canvas (https://html2canvas.hertzen.com)
- **Technical Standards**: Web Audio API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Language Standards**: ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

## Project File Index (Alphabetized)
- .env.local
- BLUEPRINT.md
- eslint.config.js
- firebase.json
- package.json
- README.md
- REPEATING_ERRORS.md
- scripts/check_tslint.js
- scripts/sync-version.js
- SOURCES.md
- src/App.tsx
- src/components/AudioVisualizer.tsx
- src/components/ContextChangeModal.tsx
- src/components/Controls.tsx
- src/components/ExportModal.tsx
- src/components/Header.tsx
- src/components/LanguageSelectionScreen.tsx
- src/components/TextInputModal.tsx
- src/components/TranslationItem.tsx
- src/components/TranslationLog.tsx
- src/components/WelcomeScreen.tsx
- src/constants/contexts.ts
- src/constants/languages.ts
- src/constants/uiTranslations.ts
- src/hooks/useLiveTranslator.ts
- src/hooks/useLocalization.ts
- src/lib/firebase.ts
- src/main.tsx
- src/types.ts
- src/utils/audioRecorder.ts
- src/utils/audioStreamPlayer.ts
- src/utils/audioUtils.ts
- src/utils/capture.worklet.ts
- src/utils/languageUtils.ts
- src/utils/pdfUtils.ts
- src/utils/promptUtils.ts
- src/utils/uiTranslations.ts
- tsconfig.json
- UNFINISHED.md

## Categorized File Index

### 1. UI Components (src/components)
- **AudioVisualizer.tsx**: Real-time canvas frequency renderer.
- **ContextChangeModal.tsx**: Mid-session persona switching.
- **Controls.tsx**: Primary action bar (Start/Stop/Pause/Upload).
- **ExportModal.tsx**: PDF filename and configuration.
- **Header.tsx**: Session status and language pair display.
- **LanguageSelectionScreen.tsx**: Initial configuration gate.
- **TextInputModal.tsx**: Manual text entry for static translation.
- **TranslationItem.tsx**: Individual chat bubbles with editing and RTL support.
- **TranslationLog.tsx**: Scrollable list container for the conversation.
- **WelcomeScreen.tsx**: Landing splash screen.

### 2. Domain Logic & Hooks (src/hooks)
- **useLiveTranslator.ts**: Orchestrates WebSocket connection and model lifecycle.
- **useLocalization.ts**: Handles app interface translation based on browser locale.

### 3. Core Audio & Utilities (src/utils)
- **audioRecorder.ts**: Manages hardware microphone and Worklet registration.
- **audioStreamPlayer.ts**: Buffer queue for smooth AI vocal playback.
- **audioUtils.ts**: Low-level PCM encoding and downsampling algorithms.
- **capture.worklet.ts**: High-performance audio processing thread.
- **languageUtils.ts**: Heuristics for source language identification.
- **pdfUtils.ts**: Phantom DOM to jsPDF generation pipeline.
- **promptUtils.ts**: Dynamic system instruction generator.
- **uiTranslations.ts**: Localization dictionaries for the app UI.

### 4. Application Shell & Config
- **App.tsx**: Main orchestrator and navigation state.
- **main.tsx**: Entry point and React mounting.
- **types.ts**: Global TypeScript interfaces and enums.
- **firebase.ts**: SDK initialization for Cloud features.

### 5. Infrastructure & Scripts
- **check_tslint.js**: Build integrity and linting CI script.
- **sync-version.js**: Automated versioning utility.
- **eslint.config.js**: Modern 2026 Flat Config rules.
- **firebase.json**: Hosting and rewrites configuration.
- **package.json**: Dependency and script management.
- **tsconfig.json**: Strict TypeScript compiler options.

### 6. Documentation
- **README.md**: Project overview and setup.
- **BLUEPRINT.md**: Technical architecture and mermaid diagrams.
- **SOURCES.md**: This file (Data sources and index).
- **REPEATING_ERRORS.md**: Log of resolved technical challenges.
- **UNFINISHED.md**: Known bugs and pending features.
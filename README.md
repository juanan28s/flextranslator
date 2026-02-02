# FlexTranslator (v1.4.0)
# Flex Translator

A professional-grade real-time simultaneous translation application leveraging the **Gemini 2.5 Native Audio (Live API)**. Designed to function as a digital UN interpreter, Flex Translator facilitates fluid, context-aware conversations across 30+ languages.

## Project Status
*   **Current Version**: 1.4.0
*   **Engine**: Gemini 2.5 Native Audio (Live) & Gemini 3.0 Flash (Static)
*   **Stability**: Stable Prototype / Beta (2026 Modernized)

## Feature Status Table

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Simultaneous Translation** | ✅ Implemented | High-fidelity real-time audio-to-text-to-audio translation. |
| **AudioWorklet Architecture** | ✅ Implemented | High-performance, non-blocking audio capture on a dedicated thread. |
| **Context/Tone Selection** | ⚠️ Partial | UI selection and dynamic prompt generation working. **Pending**: Persistence. |
| **Manual Correction** | ✅ Implemented | Edit transcript to trigger intelligent re-translation via Gemini Flash. |
| **Multi-Language Support** | ✅ Implemented | Support for 32 languages including RTL (Urdu/Arabic) and Romanization. |
| **Audio Visualizer** | ✅ Implemented | Real-time Canvas-based frequency visualizer with active/idle states. |
| **PDF Export** | ✅ Implemented | High-quality PDF generation with RTL support via native npm packages. |
| **Static Processing** | ✅ Implemented | Paste text or upload PDFs for immediate translation. |
| **Firebase Integration** | ⚠️ Initialized | SDK configured; Cloud Functions and Hosting ready for deployment. |
| **Session Persistence** | ❌ Pending | History does not persist across browser refreshes. |

## Detailed Roadmap: Next Phase (v1.4.0)
To reach production readiness, the following engineering tasks are prioritized:
1.  **Persistent Tone Config**: Save the user's preferred context and language pair in `localStorage`.
2.  **Firebase Auth**: Enable secure user sessions and translation history syncing.
3.  **Advanced PDF Styles**: Allow users to customize brand colors in the exported PDF.
4.  **Multi-Speaker Diarization**: Attempt to differentiate between two speakers on a single channel (Model-side improvement).

## Setup & Usage
1.  **Environment**: Requires `import.meta.env.VITE_API_KEY` (Gemini API). Place in `.env.local`.
2.  **Audio**: Requires Microphone permissions (see `metadata.json`).
3.  **Integrity**: Run `node scripts/check_tslint.js` to verify build and linting health.
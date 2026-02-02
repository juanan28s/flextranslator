# Application Overhaul Roadmap

This directory tracks significant architectural changes and refactors intended to move the application from a "Native Audio Sandbox" to a production-ready communication platform.

## High Priority Overhauls

### 1. Audio Engine Refactor
- **Issue**: `ScriptProcessorNode` is deprecated and runs on the main UI thread, potentially causing audio glitches.
- **Goal**: Migrate to `AudioWorklet`.
- **Files Affected**: `utils/audioRecorder.ts`.

### 2. State Management Transition
- **Issue**: Session data is passed via deep prop drilling or local hooks.
- **Goal**: Implement a `SessionProvider` using React Context or a lightweight state library (Zustand) to manage active translation items and connection state globally.
- **Files Affected**: `App.tsx`, `hooks/useLiveTranslator.ts`.

### 3. Firebase Integration
- **Issue**: API keys are client-side and data is volatile.
- **Goal**: Full migration as per `260128_Firebase_Migration.md`.
- **Files Affected**: Entire project.

### 4. Design System Implementation
- **Issue**: Tailwind classes are repeated and complex.
- **Goal**: Standardize UI components (Buttons, Modals, Bubbles) into a dedicated library within the `components/` directory using a consistent design token system.

## Performance Goals
- **Latency**: Reduce total round-trip time (Audio -> API -> UI) to under 800ms.
- **Memory**: Ensure `AudioContext` is properly disposed of during session switches to prevent memory leaks in long sessions.

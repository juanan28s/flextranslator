# Unfinished Tasks & Roadmap

## Implementation Gaps (In Progress)
1.  **Context Persistence**: The context selector (e.g., "Legal", "Medical") resets on page reload.
    *   *Requirement*: Sync `sessionContext` with `localStorage`.
2.  **Audio Quality Robustness**: Browser backgrounding can suspend the `AudioContext`.
    *   *Requirement*: Implement page-visibility-API listeners to resume audio gracefully.
3.  **Language-Specific Logic**: Transliteration currently only emphasizes Urdu.
    *   *Requirement*: Expand `promptUtils.ts` to support Romanization for Arabic and Chinese (Pinyin).

## Future Enhancements
*   [ ] **Presentation Mode**: Full-screen view for large tablet/projector display.
*   [ ] **Multi-Channel Input**: If using a stereo mic, assign Left to Lang A and Right to Lang B.
*   [ ] **Advanced Summarization**: "End Session" button that generates a summary of the whole conversation.
*   [ ] **Firebase Phase 2**: Move Gemini API calls to Server-Side functions to secure the API Key.
*   [ ] **UI Localization**: Expand `uiTranslations.ts` to include full support for the top 10 languages (currently fully translated only for EN, ES, PL).

# Repeating Errors Log

*   **Transcription Configuration Error (Fixed)**: 
    *   *Issue*: Connection to Live API failed with "Connection error detected" when passing `{ model: ... }` to `inputAudioTranscription` and `outputAudioTranscription`.
    *   *Fix*: Changed configuration to pass empty objects `{}` for these properties, as the SDK/API infers the model from the session or expects no arguments for enabling.
*   **AudioContext not allowed to start**:
    *   *Note*: A common potential issue with Live API is "AudioContext not allowed to start" if not triggered by a user action. The `Controls` component handles this by ensuring `connect` is called on button click.
    *   *Note*: `ScriptProcessorNode` is deprecated but used here for ease of single-file implementation without external AudioWorklet file loading complexities in this format. Future migration should use `AudioWorklet`.
*   **Invalid Realtime Input Signature (Fixed)**:
    *   *Issue*: Audio was being sent as an array `[{ mimeType: ..., data: ... }]` to `session.sendRealtimeInput`. The server ignored this, resulting in silence and no translations.
    *   *Fix*: Corrected payload to match SDK requirement: `session.sendRealtimeInput({ media: { mimeType: ..., data: ... } })`.
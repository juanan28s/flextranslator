
# Firebase Migration Guide: Flex Translator

This guide provides a senior-level architectural roadmap for migrating the **Flex Translator** application from a local development environment (or AI Studio sandbox) to a production-grade **Google Firebase** infrastructure.

---

## Strategic Objectives
1.  **Security**: Move the Gemini API Key from the client-side to a secure backend environment.
2.  **Persistence**: Enable users to save, view, and share their translation session history.
3.  **Authentication**: Restrict access to registered users via Google OAuth.
4.  **Scalability**: Leverage Firebase Hosting for global low-latency delivery.

---

## Phase 1: Firebase Project Initialization

### 1. Create the Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **Add Project** and name it `flex-translator`.

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
```
*   Select: `Hosting`, `Firestore`, `Functions`, `Authentication`.

---

## Phase 2: Security Architecture (The API Key)

**CRITICAL:** Currently, `process.env.API_KEY` is exposed in the frontend. In a Firebase production environment, you must proxy these requests or use Secret Manager.

---

## Phase 3: Authentication Implementation

Enable Google Provider in the Firebase Console. Use `onAuthStateChanged` in `App.tsx` to manage session life-cycles.

---

## Phase 4: Firestore (Data Persistence)

Store session metadata and transcript arrays in the `sessions` collection. Ensure security rules restrict access to the owner's `userId`.

---
**Senior Engineer Note:** Prioritize Vertex AI for Firebase for native API key protection.

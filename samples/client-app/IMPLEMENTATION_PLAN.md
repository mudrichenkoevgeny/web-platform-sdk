# Sample Client App — Implementation Plan

This document outlines the step-by-step implementation plan for the `samples/client-app` reference host application in the Web Platform SDK. It maps the architectural concepts from the Kotlin Multiplatform `sampleclient:composeApp` to a modern Web ecosystem (TypeScript, React, Vite, Zustand, Tailwind CSS).

## 🧠 Context & Overview

**Purpose:**
Demonstrates how to wire `@web-platform-sdk/feature-clientuser` and core SDK modules into a standalone client-facing React web application running independently on port **`3002`**.

**Tech Stack & Wiring:**
* **Host Runtime:** Vite + React 19 (`vite.config.ts` running on `http://localhost:3002`).
* **DI Container (`ClientAppComponent`):** Central manual DI aggregator linking:
  - `CommonComponent` (HTTP client, WebSockets)
  - `CoreSecurityComponent` (MFA, password policies)
  - `CoreSettingsComponent` (Global settings)
  - `ClientUserComponent` (Auth state, login flows, user profile)
* **Startup Sequence (`SyncDataUseCase`):**
  - Attaches HTTP plugins & registers error parsers (`UserErrorParser`, `SecurityErrorParser`, `CommonErrorParser`).
  - Installs WebSocket event handlers.
  - Refreshes user configuration & settings on launch.
* **UI Architecture (`RootContent` & Screens):**
  - `InitialLoader`: Displayed during startup initialization and bootstrapping.
  - `ClientLoginRootContainer`: Renders client auth flows when unauthenticated.
  - `MainProfileScreen`: Renders profile oversight and session controls when authenticated.

---

## 🏗️ Implementation Phases

### Phase 1: Package Infrastructure & Host Configuration
- [x] Create `package.json` with dependencies on workspace packages (`@web-platform-sdk/core-common`, `core-security`, `core-settings`, `feature-user`, `feature-clientuser`).
- [x] Create `vite.config.ts` configured for port `3002` with React plugin and path aliases.
- [x] Create `tsconfig.json` extending base workspace configuration.
- [x] Create `index.html` entry page.

### Phase 2: Dependency Injection & Use Case Modules
- [x] Implement `ClientAppUseCaseModule` (aggregating sync, config refresh, and session state use cases).
- [x] Implement `ClientAppComponent` (central DI container mirroring KMP `ClientAppComponent`).
- [x] Implement `ClientAppComponentMock` for testing and offline preview modes.

### Phase 3: Initialization & Synchronization Logic
- [x] Implement `SyncDataUseCase` orchestrating startup config refresh and WebSocket initialization.

### Phase 4: Root UI & Navigation Flows
- [x] Implement `InitialLoader` for startup loading state.
- [x] Implement `MainScreen` / `MainScreenDestination` for authenticated/unauthenticated navigation with `useHashRouter`.
- [x] Implement `RootContent` wrapping the application in `SdkProvider` and `ThemeProvider`.
- [x] Implement `src/main.tsx` entry point mounting `RootContent` to the DOM.

### Phase 5: Verification & Run Validation
- [x] Run `pnpm typecheck` to verify strict TypeScript compliance.
- [x] Run `pnpm build` to verify production bundle build.
- [x] Verify standalone dev server execution on `http://localhost:3002`.

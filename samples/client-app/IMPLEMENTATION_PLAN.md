# Sample Client App — Implementation Plan

This document outlines the step-by-step implementation plan for the `samples/client-app` reference host application in the Web Platform SDK. It maps the architectural concepts from the Kotlin Multiplatform `sampleclient:composeApp` to a modern Web ecosystem (TypeScript, React, Vite, Zustand, Tailwind CSS).

## 🧠 Context & Overview

**Purpose:**
Demonstrates how to wire `@web-platform-sdk/feature-clientuser` and core SDK modules into a standalone client-facing React web application running independently on port **`3000`**.

**Tech Stack & Wiring:**
* **Host Runtime:** Vite + React 19 (`vite.config.ts` running on `http://localhost:3000`).
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
  - `SplashScreen`: Displayed during startup initialization.
  - `ClientLoginRootContainer`: Renders client auth flows when unauthenticated.
  - `MainProfileScreen`: Renders profile oversight and session controls when authenticated.

---

## 🏗️ Implementation Phases

### Phase 1: Package Infrastructure & Host Configuration
- [ ] Create `package.json` with dependencies on workspace packages (`@web-platform-sdk/core-common`, `core-security`, `core-settings`, `feature-user`, `feature-clientuser`).
- [ ] Create `vite.config.ts` configured for port `3000` with React plugin and path aliases.
- [ ] Create `tsconfig.json` extending base workspace configuration.
- [ ] Create `index.html` entry page.

### Phase 2: Dependency Injection & Use Case Modules
- [ ] Implement `ClientAppUseCaseModule` (aggregating sync, config refresh, and session state use cases).
- [ ] Implement `ClientAppComponent` (central DI container mirroring KMP `ClientAppComponent`).
- [ ] Implement `ClientAppComponentMock` for testing and offline preview modes.

### Phase 3: Initialization & Synchronization Logic
- [ ] Implement `SyncDataUseCase` orchestrating startup config refresh and WebSocket initialization.

### Phase 4: Root UI & Navigation Flows
- [ ] Implement `SplashScreen` for startup loading state.
- [ ] Implement `MainScreen` / `MainScreenDestination` for authenticated/unauthenticated navigation.
- [ ] Implement `RootContent` wrapping the application in `SdkProvider` and `ThemeProvider`.
- [ ] Implement `src/main.tsx` entry point mounting `RootContent` to the DOM.

### Phase 5: Verification & Run Validation
- [ ] Run `pnpm typecheck` to verify strict TypeScript compliance.
- [ ] Run `pnpm build` to verify production bundle build.
- [ ] Verify standalone dev server execution on `http://localhost:3000`.

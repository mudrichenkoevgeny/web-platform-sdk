# Sample Management App — Implementation Plan

This document outlines the step-by-step implementation plan for the `samples/management-app` reference host application in the Web Platform SDK. It maps the architectural concepts from the Kotlin Multiplatform `samplemanagement:composeApp` to a modern Web ecosystem (TypeScript, React, Vite, Zustand, Tailwind CSS).

## 🧠 Context & Overview

**Purpose:**
Demonstrates how to wire `@web-platform-sdk/feature-managementuser` and core SDK modules into a standalone administrative staff web application running independently on port **`3001`**.

**Tech Stack & Wiring:**
* **Host Runtime:** Vite + React 19 (`vite.config.ts` running on `http://localhost:3001`).
* **DI Container (`ManagementAppComponent`):** Central manual DI aggregator linking:
  - `CommonComponent` (HTTP client, WebSockets)
  - `CoreSecurityComponent` (Security policies, MFA)
  - `CoreSettingsComponent` (Global settings oversight)
  - `ManagementUserComponent` (Administrative user management, session oversight, audit logging)
* **Startup Sequence (`SyncManagementDataUseCase`):**
  - Attaches HTTP plugins & registers administrative error parsers (`UserErrorParser`, `SecurityErrorParser`, `CommonErrorParser`).
  - Installs management WebSocket event handlers.
  - Refreshes administrative configuration & settings on launch.
* **UI Architecture (`RootContent` & Screens):**
  - `SplashScreen`: Displayed during administrative startup initialization.
  - `ManagementLoginRootScreen`: Renders staff authentication when unauthenticated.
  - `ManagementRootScreen`: Renders administrative dashboard (users, sessions, identifiers, audit events, settings) when authenticated.

---

## 🏗️ Implementation Phases

### Phase 1: Package Infrastructure & Host Configuration
- [ ] Create `package.json` with dependencies on workspace packages (`@web-platform-sdk/core-common`, `core-security`, `core-settings`, `feature-user`, `feature-managementuser`).
- [ ] Create `vite.config.ts` configured for port `3001` with React plugin and path aliases.
- [ ] Create `tsconfig.json` extending base workspace configuration.
- [ ] Create `index.html` entry page.

### Phase 2: Dependency Injection & Use Case Modules
- [ ] Implement `ManagementAppUseCaseModule` (aggregating management sync, configuration refresh, and user management use cases).
- [ ] Implement `ManagementAppComponent` (central DI container mirroring KMP `ManagementAppComponent`).
- [ ] Implement `ManagementAppComponentMock` for testing and offline preview modes.

### Phase 3: Initialization & Synchronization Logic
- [ ] Implement `SyncManagementDataUseCase` orchestrating administrative startup config refresh and WebSocket initialization.

### Phase 4: Root UI & Navigation Flows
- [ ] Implement `SplashScreen` for startup loading state.
- [ ] Implement `MainScreen` / `MainScreenDestination` for staff navigation.
- [ ] Implement `RootContent` wrapping the application in `SdkProvider` and `ThemeProvider`.
- [ ] Implement `src/main.tsx` entry point mounting `RootContent` to the DOM.

### Phase 5: Verification & Run Validation
- [ ] Run `pnpm typecheck` to verify strict TypeScript compliance.
- [ ] Run `pnpm build` to verify production bundle build.
- [ ] Verify standalone dev server execution on `http://localhost:3001`.

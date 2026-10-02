# Core Settings — Implementation Plan

This document outlines the step-by-step implementation plan for the `core-settings` module in the Web Platform SDK. It maps the global application settings, encrypted persistence, REST fetching, and real-time WebSocket synchronization from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, WebCrypto, native Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in `HttpClient` from `@mudrichenkoevgeny/web-platform-sdk-core-common`.
*   **Encrypted Storage** -> `EncryptedSettings` from `@mudrichenkoevgeny/web-platform-sdk-core-common`.
*   **Flow / Coroutines** -> `Promise`, `async/await`, and reactive listeners or Zustand state.
*   **WebSocket Handler** -> `SettingsWebSocketMessageHandler` handling `GLOBAL_SETTINGS_UPDATED` frames.

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `ErrorId`) must use `toXxxIdOrThrow()` conversions.
*   Unit tests (`*.test.ts`) required for all repositories, use cases, storage, and API components.

---

## 🏗️ Implementation Phases

### Phase 1: Encrypted Storage Layer
- [x] Implement `OpenGlobalSettingsStorage` interface.
- [x] Implement `EncryptedOpenGlobalSettingsStorage` (persisting global configuration encrypted via `EncryptedSettings` from `core-common`).
- [x] Write unit tests for `EncryptedOpenGlobalSettingsStorage`.

### Phase 2: Network Layer (REST & WebSockets)
- [x] Implement `OpenGlobalSettingsApi` interface.
- [x] Implement `FetchOpenGlobalSettingsApi` (HTTP REST client using `HttpClient`).
- [x] Implement `SettingsWebSocketMessageHandler` (handling `GLOBAL_SETTINGS_UPDATED` WebSocket frames).
- [x] Write unit tests for API client and WebSocket message handler.

### Phase 3: Repository Layer
- [x] Implement `OpenGlobalSettingsRepository` interface.
- [x] Implement `OpenGlobalSettingsRepositoryImpl` (coordinating REST API, Encrypted Storage, and reactive WebSocket updates).
- [x] Write unit tests for `OpenGlobalSettingsRepositoryImpl`.

### Phase 4: Domain Use Cases
- [x] Implement `GetOpenGlobalSettingsUseCase` (retrieving global settings from repository).
- [x] Implement `RefreshOpenGlobalSettingsUseCase` (forcing network REST refresh and updating persistence).
- [x] Write unit tests for Use Cases.

### Phase 5: Dependency Injection & Mocks
- [x] Implement DI modules (`SettingsStorageModule`, `SettingsRepositoryModule`, `SettingsUseCaseModule`, `SettingsNetworkModule`, `SettingsWebSocketsModule`).
- [x] Implement `SettingsComponent` container.
- [x] Create mock implementations (`SettingsComponentMock`, `OpenGlobalSettingsRepositoryMock`, `OpenGlobalSettingsStorageMock`, `OpenGlobalSettingsApiMock`, `GlobalSettingsMock`, `GlobalSettingsPayloadMock`).
- [x] Write unit tests for `SettingsComponent`.

### Phase 6: Final Review & Export
- [x] Export all public interfaces, classes, use cases, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/core-settings`.

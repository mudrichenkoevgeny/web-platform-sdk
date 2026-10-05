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

### Phase 6: File Naming Normalization Refactoring
- [x] Rename directory `src/network/globalsettings/` to `src/network/global-settings/` and update imports.
- [x] Rename directory `src/network/websockets/` to `src/network/websocket/` and update imports.
- [x] Rename directory `src/storage/globalsettings/` to `src/storage/global-settings/` and update imports.
- [x] `src/di/SettingsComponent.test.ts` is correct (renamed to `settings-component.test.ts`).
- [x] `src/di/SettingsComponent.ts` is correct (renamed to `settings-component.ts`).
- [x] `src/domain/model/OpenGlobalSettings.ts` is correct (renamed to `open-global-settings.ts`).
- [x] `src/index.ts` is correct.
- [x] `src/mock/di/SettingsComponentMock.ts` is correct (renamed to `settings-component-mock.ts`).
- [x] `src/mock/domain/model/OpenGlobalSettingsMock.ts` is correct (renamed to `open-global-settings-mock.ts`).
- [x] `src/mock/network/OpenGlobalSettingsApiMock.ts` is correct (renamed to `open-global-settings-api-mock.ts`).
- [x] `src/mock/network/model/OpenGlobalSettingsPayloadMock.ts` is correct (renamed to `open-global-settings-payload-mock.ts`).
- [x] `src/mock/repository/OpenGlobalSettingsRepositoryMock.ts` is correct (renamed to `open-global-settings-repository-mock.ts`).
- [x] `src/mock/storage/OpenGlobalSettingsStorageMock.ts` is correct (renamed to `open-global-settings-storage-mock.ts`).
- [x] `src/network/contract/SettingsWebSocketEventTypes.ts` is correct (renamed to `settings-web-socket-event-types.ts`).
- [x] `src/network/globalsettings/FetchOpenGlobalSettingsApi.test.ts` is correct (renamed to `fetch-open-global-settings-api.test.ts`).
- [x] `src/network/globalsettings/FetchOpenGlobalSettingsApi.ts` is correct (renamed to `fetch-open-global-settings-api.ts`).
- [x] `src/network/globalsettings/OpenGlobalSettingsApi.ts` is correct (renamed to `open-global-settings-api.ts`).
- [x] `src/network/websockets/messagehandler/SettingsWebSocketMessageHandler.test.ts` is correct (renamed to `settings-web-socket-message-handler.test.ts`).
- [x] `src/network/websockets/messagehandler/SettingsWebSocketMessageHandler.ts` is correct (renamed to `settings-web-socket-message-handler.ts`).
- [x] `src/repository/OpenGlobalSettingsRepository.ts` is correct (renamed to `open-global-settings-repository.ts`).
- [x] `src/repository/OpenGlobalSettingsRepositoryImpl.test.ts` is correct (renamed to `open-global-settings-repository-impl.test.ts`).
- [x] `src/repository/OpenGlobalSettingsRepositoryImpl.ts` is correct (renamed to `open-global-settings-repository-impl.ts`).
- [x] `src/storage/globalsettings/EncryptedOpenGlobalSettingsStorage.test.ts` is correct (renamed to `encrypted-open-global-settings-storage.test.ts`).
- [x] `src/storage/globalsettings/EncryptedOpenGlobalSettingsStorage.ts` is correct (renamed to `encrypted-open-global-settings-storage.ts`).
- [x] `src/storage/globalsettings/OpenGlobalSettingsStorage.ts` is correct (renamed to `open-global-settings-storage.ts`).
- [x] `src/usecase/GetOpenGlobalSettingsUseCase.ts` is correct (renamed to `get-open-global-settings-use-case.ts`).
- [x] `src/usecase/RefreshOpenGlobalSettingsUseCase.ts` is correct (renamed to `refresh-open-global-settings-use-case.ts`).
- [x] `src/usecase/SettingsUseCases.test.ts` is correct (renamed to `settings-use-cases.test.ts`).

### Phase 7: Final Review & Export
- [x] Export all public interfaces, classes, use cases, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/core-settings`.

# Core Security — Implementation Plan

This document outlines the step-by-step implementation plan for the `core-security` module in the Web Platform SDK. It maps the security settings, password policy validation, encrypted persistence, and real-time WebSocket infrastructure from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, WebCrypto, native Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in `HttpClient` from `@mudrichenkoevgeny/web-platform-sdk-core-common`.
*   **Encrypted Storage** -> `EncryptedSettings` from `@mudrichenkoevgeny/web-platform-sdk-core-common`.
*   **Flow / Coroutines** -> `Promise`, `async/await`, and reactive listeners or Zustand state.
*   **Password Policy Validation** -> Shared `PasswordPolicyValidator` from `@mudrichenkoevgeny/shared-foundation`.
*   **Error Parsing** -> `SecurityErrorParser` registered as a specific parser in `AppErrorParserBuilder`.

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `ErrorId`) must use `toXxxIdOrThrow()` conversions.
*   Unit tests (`*.test.ts`) required for all repositories, use cases, parsers, and storage components.

---

## 🏗️ Implementation Phases

### Phase 1: Localizations & Error Modeling (CoR)
- [x] Create localized string dictionaries (`CoreSecurityStrings`, `enSecurityStrings`, `ruSecurityStrings`).
- [ ] Implement `ClientSecurityErrorCodes` constants.
- [ ] Implement `SecurityError` hierarchy (extending `AppError`, handling MFA, TOTP, OTP rate-limiting, Password Policy violations, IP restrictions).
- [ ] Implement `SecurityErrorParser` (extending `AppErrorParser` for security-specific error code parsing).
- [ ] Write unit tests for `SecurityErrorParser`.

### Phase 2: Storage Layer
- [ ] Implement `OpenSecuritySettingsStorage` interface.
- [ ] Implement `EncryptedOpenSecuritySettingsStorage` (backed by `EncryptedSettings`).
- [ ] Write unit tests for `EncryptedOpenSecuritySettingsStorage`.

### Phase 3: Network Layer (REST & WebSockets)
- [ ] Implement `OpenSecuritySettingsApi` interface.
- [ ] Implement `FetchOpenSecuritySettingsApi` (HTTP REST client using `HttpClient`).
- [ ] Implement `SecurityWebSocketMessageHandler` (handling `SECURITY_SETTINGS_UPDATED` WebSocket frames).
- [ ] Write unit tests for API client and WebSocket message handler.

### Phase 4: Repository Layer
- [ ] Implement `OpenSecuritySettingsRepository` interface.
- [ ] Implement `OpenSecuritySettingsRepositoryImpl` (coordinating API, Encrypted Storage, and reactive WebSocket updates).
- [ ] Write unit tests for `OpenSecuritySettingsRepositoryImpl`.

### Phase 5: Domain Use Cases & Password Validation
- [ ] Implement `ValidatePasswordUseCase` (validating candidate passwords against active `PasswordPolicy` from `@mudrichenkoevgeny/shared-foundation` and returning `AppResult<void, SecurityError>`).
- [ ] Implement `RefreshOpenSecuritySettingsUseCase` (fetching and caching latest security settings).
- [ ] Write unit tests for Use Cases.

### Phase 6: Dependency Injection & Mocks
- [ ] Implement DI modules (`SecurityStorageModule`, `SecurityRepositoryModule`, `SecurityUseCaseModule`, `SecurityNetworkModule`, `SecurityWebSocketModule`).
- [ ] Implement `SecurityComponent` container.
- [ ] Create mock implementations (`SecurityComponentMock`, `OpenSecuritySettingsRepositoryMock`, `OpenSecuritySettingsStorageMock`, `OpenSecuritySettingsApiMock`, `ValidatePasswordUseCaseMock`, and domain/network payload mocks).
- [ ] Write unit tests for `SecurityComponent`.

### Phase 7: Final Review & Export
- [ ] Export all public interfaces, classes, use cases, and mocks in `src/index.ts`.
- [ ] Validate `tsc --noEmit` and `vite build` complete successfully.

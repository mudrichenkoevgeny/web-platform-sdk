# todo delete later and add readme
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
- [x] Implement `ClientSecurityErrorCodes` constants.
- [x] Implement `SecurityError` hierarchy (extending `AppError`, handling MFA, TOTP, OTP rate-limiting, Password Policy violations, IP restrictions).
- [x] Implement `SecurityErrorParser` (extending `AppErrorParser` for security-specific error code parsing).
- [x] Write unit tests for `SecurityErrorParser`.

### Phase 2: Storage Layer
- [x] Implement `OpenSecuritySettingsStorage` interface.
- [x] Implement `EncryptedOpenSecuritySettingsStorage` (backed by `EncryptedSettings`).
- [x] Write unit tests for `EncryptedOpenSecuritySettingsStorage`.

### Phase 3: Network Layer (REST & WebSockets)
- [x] Implement `OpenSecuritySettingsApi` interface.
- [x] Implement `FetchOpenSecuritySettingsApi` (HTTP REST client using `HttpClient`).
- [x] Implement `SecurityWebSocketMessageHandler` (handling `SECURITY_SETTINGS_UPDATED` WebSocket frames).
- [x] Write unit tests for API client and WebSocket message handler.

### Phase 4: Repository Layer
- [x] Implement `OpenSecuritySettingsRepository` interface.
- [x] Implement `OpenSecuritySettingsRepositoryImpl` (coordinating API, Encrypted Storage, and reactive WebSocket updates).
- [x] Write unit tests for `OpenSecuritySettingsRepositoryImpl`.

### Phase 5: Domain Use Cases & Password Validation
- [x] Implement `ValidatePasswordUseCase` (validating candidate passwords against active `PasswordPolicy` from `@mudrichenkoevgeny/shared-foundation` and returning `AppResult<void, SecurityError>`).
- [x] Implement `RefreshOpenSecuritySettingsUseCase` (fetching and caching latest security settings).
- [x] Write unit tests for Use Cases.

### Phase 6: Dependency Injection & Mocks
- [x] Implement DI modules (`SecurityStorageModule`, `SecurityRepositoryModule`, `SecurityUseCaseModule`, `SecurityNetworkModule`, `SecurityWebSocketModule`).
- [x] Implement `SecurityComponent` container.
- [x] Create mock implementations (`SecurityComponentMock`, `OpenSecuritySettingsRepositoryMock`, `OpenSecuritySettingsStorageMock`, `OpenSecuritySettingsApiMock`, `ValidatePasswordUseCaseMock`, and domain/network payload mocks).
- [x] Write unit tests for `SecurityComponent`.

### Phase 7: Final Review & Export
- [x] Export all public interfaces, classes, use cases, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully.

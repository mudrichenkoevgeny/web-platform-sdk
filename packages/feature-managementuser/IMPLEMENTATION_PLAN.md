# Feature ManagementUser — Implementation Plan

This document outlines the step-by-step implementation plan for the `feature-managementuser` module in the Web Platform SDK. It provides administrative identity solutions, system oversight, global configuration management, security & auth settings editing, audit event logging, user management, and administrative React UI components from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, React, Zustand, Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in `HttpClient` with administrative endpoints.
*   **Encrypted Storage** -> `EncryptedSettings` for administrative auth and setting overrides.
*   **Decompose Navigation** -> React state machines / Zustand stores / router flows (`ManagementRootComponent`).
*   **Compose UI** -> React (`.tsx`) + Tailwind CSS components.

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `UserSessionId`) must use `toXxxIdOrThrow()` conversions.
*   Every `.tsx` component must have a `.test.tsx` and `.stories.tsx`.

---

## 🏗️ Implementation Phases

### Phase 1: Management Storage & Network APIs
- [x] Implement Encrypted Storage wrappers (`EncryptedManagementAuthSettingsStorage`, `EncryptedManagementGlobalSettingsStorage`, `EncryptedManagementSecuritySettingsStorage`).
- [x] Implement Management APIs (`ManagementAuditApi`, `SelfManagementLoginApi`, `ManagementAuthSettingsApi`, `SelfManagementUnlockApi`, `ManagementUserConfigurationApi`, `ManagementGlobalSettingsApi`, `ManagementIdentifierApi`, `SelfManagementIdentifiersApi`, `ManagementSecuritySettingsApi`, `ManagementSessionApi`, `SelfManagementSessionApi`, `ManagementUserApi`, `SelfManagementUserApi`, `ManagementUserSecurityApi`).
- [x] Write unit tests for Management APIs and Storage.

### Phase 2: Management Repositories
- [x] Implement `ManagementAuditRepositoryImpl`.
- [x] Implement Management Auth Repositories (`SelfManagementLoginRepositoryImpl`, `SelfManagementRefreshTokenRepositoryImpl`, `SelfManagementResetPasswordRepositoryImpl`, `ManagementAuthSettingsRepositoryImpl`, `SelfManagementUnlockRepositoryImpl`).
- [x] Implement `ManagementGlobalSettingsRepositoryImpl`, `ManagementIdentifierRepositoryImpl`, `SelfManagementIdentifierRepositoryImpl`, `ManagementSecuritySettingsRepositoryImpl`, `ManagementSessionRepositoryImpl`, `SelfManagementSessionRepositoryImpl`, `ManagementUserRepositoryImpl`, `SelfManagementUserRepositoryImpl`, `ManagementUserSecurityRepositoryImpl`, `SelfManagementUserSecurityRepositoryImpl`.
- [x] Write unit tests for Management Repositories.

### Phase 3: Domain Use Cases
- [ ] Implement Audit Use Cases (`GetAuditEventsUseCase`, `GetAuditEventUseCase`).
- [ ] Implement Management Auth Settings Use Cases (`GetManagementAuthSettingsUseCase`, `ObserveManagementAuthSettingsUseCase`, `RefreshManagementAuthSettingsUseCase`, `ResetRemoteAuthSettingsUseCase`, `SaveRemoteAuthSettingsUseCase`).
- [ ] Implement Configuration Use Cases (`RefreshManagementUserConfigurationUseCase`).
- [ ] Implement Management Global Settings Use Cases (`GetManagementGlobalSettingsUseCase`, `ObserveManagementGlobalSettingsUseCase`, `RefreshManagementGlobalSettingsUseCase`, `ResetRemoteGlobalSettingsUseCase`, `SaveRemoteGlobalSettingsUseCase`).
- [ ] Implement Management Identifier Use Cases (`ManagementGetIdentifiersUseCase`, `ManagementGetIdentifierUseCase`, `ManagementDeleteIdentifierUseCase`, `ManagementDeleteIdentifierPasswordUseCase`).
- [ ] Implement Management Security Settings Use Cases (`GetManagementSecuritySettingsUseCase`, `ObserveManagementSecuritySettingsUseCase`, `RefreshManagementSecuritySettingsUseCase`, `ResetRemoteSecuritySettingsUseCase`, `SaveRemoteSecuritySettingsUseCase`).
- [ ] Implement Management Session Use Cases (`ManagementGetSessionsUseCase`, `ManagementGetSessionUseCase`, `ManagementDeleteSessionUseCase`, `ManagementDeleteAllUserSessionsUseCase`).
- [ ] Implement Management User Use Cases (`GetUsersUseCase`, `GetUserUseCase`, `CreateUserUseCase`, `UpdateUserUseCase`, `DeleteUserUseCase`, `ManagementDisableTotpUseCase`).
- [ ] Write unit tests for Use Cases.

### Phase 4: Management UI Components & Screens
- [ ] Implement Reusable Items (`AuditItem`, `UserItem`).
- [ ] Implement Auth Login Screens (`ManagementLoginDestination`, `ManagementLoginRootComponent`, `ManagementLoginRootComponentImpl`, `ManagementLoginRootScreen`).
- [ ] Implement Management Screen Stack (`ManagementDestination`, `ManagementRootComponent`, `MainManagementComponent`).
- [ ] Implement Audit Screens (`AuditEventListComponent`, `AuditEventDetailComponent`).
- [ ] Implement Global Identifier & Session Screens (`GlobalIdentifierListComponent`, `UserIdentifierListComponent`, `GlobalSessionListComponent`, `UserSessionListComponent`).
- [ ] Implement Settings Editing Screens (`EditAuthSettingsComponent`, `EditGlobalSettingsComponent`, `EditSecuritySettingsComponent`).
- [ ] Implement User Administration Screens (`GlobalUserListComponent`, `UserDetailComponent`, `CreateUserComponent`).
- [ ] Write `.test.tsx` and `.stories.tsx` for all Management UI components and screens.

### Phase 5: Dependency Injection & Mocks
- [ ] Implement DI Modules (`ManagementUserComponent`, `AuditApiComponent`, `ManagementUserNetworkModule`, `ManagementUserRepositoryModule`, `ManagementUserUseCaseModule`, `ManagementUserWebSocketModule`).
- [ ] Implement Management Mocks (`ManagementUserComponentMock`, Audit mocks, API mocks, Repository mocks, Storage mocks, UI Component mocks).
- [ ] Write unit tests for `ManagementUserComponent`.

### Phase 6: Final Review & Export
- [ ] Export all public contracts, components, use cases, and mocks in `src/index.ts`.
- [ ] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-managementuser`.

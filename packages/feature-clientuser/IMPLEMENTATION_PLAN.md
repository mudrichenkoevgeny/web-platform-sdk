# Feature ClientUser — Implementation Plan

This document outlines the step-by-step implementation plan for the `feature-clientuser` module in the Web Platform SDK. It provides the identity solution, public authentication flows (Email, Phone OTP, Google), open REST API boundaries, and client user UI components from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, React, Zustand, Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in `HttpClient` with client-specific open endpoints.
*   **Encrypted Storage** -> Shared `AuthStorage` & `UserStorage` from `@mudrichenkoevgeny/web-platform-sdk-feature-user`.
*   **Decompose Navigation** -> React state machines / Zustand stores / router flows (`ClientLoginRootComponent`).
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

### Phase 1: Network API Layer (Client Boundaries)
- [ ] Implement Open APIs for client users (`OpenLoginApi`, `OpenRegistrationApi`, `OpenAuthSettingsApi`, `OpenUnlockApi`, `OpenIdentifiersApi`, `OpenSessionApi`, `OpenUserApi`, `OpenUserSecurityApi`).
- [ ] Implement Fetch / HTTP wrappers (`KtorOpenLoginApi`, `KtorRegistrationApi`, `KtorResetPasswordApi`, `KtorOpenAuthSettingsApi`, `KtorOpenUnlockApi`, `KtorOpenIdentifiersApi`, `KtorOpenSessionApi`, `KtorOpenUserApi`, `KtorOpenUserUserSecurityApi`).
- [ ] Write unit tests for Client APIs.

### Phase 2: Repositories
- [ ] Implement Open Repositories (`OpenLoginRepositoryImpl`, `OpenRefreshTokenRepositoryImpl`, `OpenRegistrationRepositoryImpl`, `OpenResetPasswordRepositoryImpl`, `OpenAuthSettingsRepositoryImpl`, `OpenUnlockRepositoryImpl`).
- [ ] Implement `OpenIdentifierRepositoryImpl`, `OpenSessionRepositoryImpl`, `OpenUserRepositoryImpl`, `OpenUserSecurityRepositoryImpl`.
- [ ] Write unit tests for Open Repositories.

### Phase 3: Domain Use Cases
- [ ] Implement `RefreshOpenAuthSettingsUseCase`.
- [ ] Implement `RefreshClientUserConfigurationUseCase`.
- [ ] Write unit tests for Use Cases.

### Phase 4: Client Login & Registration UI Flow
- [ ] Implement `ClientLoginDestination` & router flow.
- [ ] Implement `LoginByPhoneComponent`, `LoginByPhoneComponentImpl`, `LoginByPhoneScreen`, `LoginByPhoneScreenState`.
- [ ] Implement `ClientLoginRootComponent`, `ClientLoginRootComponentImpl`, `ClientLoginRootScreen`.
- [ ] Implement `RegistrationByEmailComponent`, `RegistrationByEmailComponentImpl`, `RegistrationByEmailScreen`, `RegistrationByEmailScreenState`.
- [ ] Write `.test.tsx` and `.stories.tsx` for all Client UI components.

### Phase 5: Dependency Injection & Mocks
- [ ] Implement DI modules (`ClientUserComponent`, `ClientUserNetworkModule`, `ClientUserRepositoryModule`, `ClientUserUseCaseModule`, `ClientUserWebSocketModule`).
- [ ] Implement Client Mocks (`ClientUserComponentMock`, `OpenLoginApiMock`, `OpenRegistrationApiMock`, `OpenAuthSettingsApiMock`, `OpenUnlockApiMock`, `OpenIdentifiersApiMock`, `OpenUserApiMock`, `ClientLoginRootComponentMock`, `LoginByPhoneComponentMock`, `RegistrationByEmailComponentMock`).
- [ ] Write unit tests for `ClientUserComponent`.

### Phase 6: Final Review & Export
- [ ] Export all public contracts, components, use cases, and mocks in `src/index.ts`.
- [ ] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-clientuser`.

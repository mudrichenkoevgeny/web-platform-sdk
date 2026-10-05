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
- [x] Implement Open APIs for client users (`OpenLoginApi`, `RegistrationApi`, `OpenAuthSettingsApi`, `OpenUnlockApi`, `OpenIdentifiersApi`, `SessionApi`, `OpenUserApi`, `UserSecurityApi`).
- [x] Implement Fetch / HTTP wrappers (`FetchOpenLoginApi`, `FetchRegistrationApi`, `FetchResetPasswordApi`, `FetchOpenAuthSettingsApi`, `FetchOpenUnlockApi`, `FetchOpenIdentifiersApi`, `FetchOpenSessionApi`, `FetchOpenUserApi`, `FetchOpenUserSecurityApi`).
- [x] Write unit tests for Client APIs.

### Phase 2: Repositories
- [x] Implement Open Repositories (`OpenLoginRepositoryImpl`, `OpenRefreshTokenRepositoryImpl`, `OpenRegistrationRepositoryImpl`, `OpenResetPasswordRepositoryImpl`, `OpenAuthSettingsRepositoryImpl`, `OpenUnlockRepositoryImpl`).
- [x] Implement `OpenIdentifierRepositoryImpl`, `OpenSessionRepositoryImpl`, `OpenUserRepositoryImpl`, `OpenUserSecurityRepositoryImpl`.
- [x] Write unit tests for Open Repositories.

### Phase 3: Domain Use Cases
- [x] Implement `RefreshOpenAuthSettingsUseCase`.
- [x] Implement `RefreshClientUserConfigurationUseCase`.
- [x] Write unit tests for Use Cases.

### Phase 4: Client Login & Registration UI Flow
- [x] Implement `ClientLoginDestination` & router flow.
- [x] Implement `LoginByPhoneComponent`, `LoginByPhoneComponentImpl`, `LoginByPhoneScreen`, `LoginByPhoneScreenState`.
- [x] Implement `ClientLoginRootComponent`, `ClientLoginRootComponentImpl`, `ClientLoginRootScreen`.
- [x] Implement `RegistrationByEmailComponent`, `RegistrationByEmailComponentImpl`, `RegistrationByEmailScreen`, `RegistrationByEmailScreenState`.
- [x] Write `.test.tsx` and `.stories.tsx` for all Client UI components.

### Phase 5: Dependency Injection & Mocks
- [x] Implement DI modules (`ClientUserComponent`, `ClientUserNetworkModule`, `ClientUserRepositoryModule`, `ClientUserUseCaseModule`, `ClientUserWebSocketModule`).
- [x] Implement Client Mocks (`ClientUserComponentMock`, `OpenLoginApiMock`, `OpenRegistrationApiMock`, `OpenAuthSettingsApiMock`, `OpenUnlockApiMock`, `OpenIdentifiersApiMock`, `OpenUserApiMock`, `ClientLoginRootComponentMock`, `LoginByPhoneComponentMock`, `RegistrationByEmailComponentMock`).
- [x] Write unit tests for `ClientUserComponent`.

### Phase 6: File Naming Normalization Refactoring
- [x] Rename directory `src/mock/network/api/auth/refreshtoken/` to `src/mock/network/api/auth/refresh-token/` and update imports.
- [x] Rename directory `src/mock/network/api/auth/resetpassword/` to `src/mock/network/api/auth/reset-password/` and update imports.
- [x] Rename directory `src/mock/repository/auth/refreshtoken/` to `src/mock/repository/auth/refresh-token/` and update imports.
- [x] Rename directory `src/mock/repository/auth/resetpassword/` to `src/mock/repository/auth/reset-password/` and update imports.
- [x] Rename directory `src/network/api/auth/refreshtoken/` to `src/network/api/auth/refresh-token/` and update imports.
- [x] Rename directory `src/network/api/auth/resetpassword/` to `src/network/api/auth/reset-password/` and update imports.
- [x] Rename directory `src/repository/auth/refreshtoken/` to `src/repository/auth/refresh-token/` and update imports.
- [x] Rename directory `src/repository/auth/resetpassword/` to `src/repository/auth/reset-password/` and update imports.
- [x] `src/di/ClientUserComponent.ts` is correct (renamed to `client-user-component.ts`).
- [x] `src/domain/model/configuration/OpenUserConfiguration.ts` is correct (renamed to `open-user-configuration.ts`).
- [x] `src/index.ts` is correct.
- [x] `src/mock/di/clientUserComponentMock.ts` is correct (renamed to `client-user-component-mock.ts`).
- [x] `src/mock/index.ts` is correct.
- [x] `src/mock/network/api/auth/login/OpenLoginApiMock.ts` is correct (renamed to `open-login-api-mock.ts`).
- [x] `src/mock/network/api/auth/registration/OpenRegistrationApiMock.ts` is correct (renamed to `open-registration-api-mock.ts`).
- [x] `src/mock/network/api/auth/settings/OpenAuthSettingsApiMock.ts` is correct (renamed to `open-auth-settings-api-mock.ts`).
- [x] `src/mock/network/api/auth/unlock/OpenUnlockApiMock.ts` is correct (renamed to `open-unlock-api-mock.ts`).
- [x] `src/mock/network/api/identifier/OpenIdentifiersApiMock.ts` is correct (renamed to `open-identifiers-api-mock.ts`).
- [x] `src/mock/network/api/user/OpenUserApiMock.ts` is correct (renamed to `open-user-api-mock.ts`).
- [x] `src/mock/repository/auth/refreshtoken/RefreshTokenRepositoryMock.ts` is correct (renamed to `refresh-token-repository-mock.ts`).
- [x] `src/mock/repository/auth/resetpassword/ResetPasswordRepositoryMock.ts` is correct (renamed to `reset-password-repository-mock.ts`).
- [x] `src/mock/repository/user/UserRepositoryMock.ts` is correct (renamed to `user-repository-mock.ts`).
- [x] `src/mock/ui/screen/auth/login/phone/LoginByPhoneComponentMock.ts` is correct (renamed to `login-by-phone-component-mock.ts`).
- [x] `src/mock/ui/screen/auth/login/root/ClientLoginRootComponentMock.ts` is correct (renamed to `client-login-root-component-mock.ts`).
- [x] `src/mock/ui/screen/auth/registration/email/RegistrationByEmailComponentMock.ts` is correct (renamed to `registration-by-email-component-mock.ts`).
- [x] `src/network/api/auth/login/FetchOpenLoginApi.test.ts` is correct (renamed to `fetch-open-login-api.test.ts`).
- [x] `src/network/api/auth/login/FetchOpenLoginApi.ts` is correct (renamed to `fetch-open-login-api.ts`).
- [x] `src/network/api/auth/login/OpenLoginApi.ts` is correct (renamed to `open-login-api.ts`).
- [x] `src/network/api/auth/refreshtoken/FetchOpenRefreshTokenApi.test.ts` is correct (renamed to `fetch-open-refresh-token-api.test.ts`).
- [x] `src/network/api/auth/refreshtoken/FetchOpenRefreshTokenApi.ts` is correct (renamed to `fetch-open-refresh-token-api.ts`).
- [x] `src/network/api/auth/registration/FetchRegistrationApi.test.ts` is correct (renamed to `fetch-registration-api.test.ts`).
- [x] `src/network/api/auth/registration/FetchRegistrationApi.ts` is correct (renamed to `fetch-registration-api.ts`).
- [x] `src/network/api/auth/registration/RegistrationApi.ts` is correct (renamed to `registration-api.ts`).
- [x] `src/network/api/auth/resetpassword/FetchResetPasswordApi.test.ts` is correct (renamed to `fetch-reset-password-api.test.ts`).
- [x] `src/network/api/auth/resetpassword/FetchResetPasswordApi.ts` is correct (renamed to `fetch-reset-password-api.ts`).
- [x] `src/network/api/auth/settings/FetchOpenAuthSettingsApi.test.ts` is correct (renamed to `fetch-open-auth-settings-api.test.ts`).
- [x] `src/network/api/auth/settings/FetchOpenAuthSettingsApi.ts` is correct (renamed to `fetch-open-auth-settings-api.ts`).
- [x] `src/network/api/auth/settings/OpenAuthSettingsApi.ts` is correct (renamed to `open-auth-settings-api.ts`).
- [x] `src/network/api/auth/unlock/FetchOpenUnlockApi.test.ts` is correct (renamed to `fetch-open-unlock-api.test.ts`).
- [x] `src/network/api/auth/unlock/FetchOpenUnlockApi.ts` is correct (renamed to `fetch-open-unlock-api.ts`).
- [x] `src/network/api/auth/unlock/OpenUnlockApi.ts` is correct (renamed to `open-unlock-api.ts`).
- [x] `src/network/api/identifier/FetchOpenIdentifiersApi.test.ts` is correct (renamed to `fetch-open-identifiers-api.test.ts`).
- [x] `src/network/api/identifier/FetchOpenIdentifiersApi.ts` is correct (renamed to `fetch-open-identifiers-api.ts`).
- [x] `src/network/api/identifier/OpenIdentifiersApi.ts` is correct (renamed to `open-identifiers-api.ts`).
- [x] `src/network/api/session/FetchOpenSessionApi.test.ts` is correct (renamed to `fetch-open-session-api.test.ts`).
- [x] `src/network/api/session/FetchOpenSessionApi.ts` is correct (renamed to `fetch-open-session-api.ts`).
- [x] `src/network/api/user/FetchOpenUserApi.test.ts` is correct (renamed to `fetch-open-user-api.test.ts`).
- [x] `src/network/api/user/FetchOpenUserApi.ts` is correct (renamed to `fetch-open-user-api.ts`).
- [x] `src/network/api/user/OpenUserApi.ts` is correct (renamed to `open-user-api.ts`).
- [x] `src/network/api/user/security/FetchOpenUserSecurityApi.test.ts` is correct (renamed to `fetch-open-user-security-api.test.ts`).
- [x] `src/network/api/user/security/FetchOpenUserSecurityApi.ts` is correct (renamed to `fetch-open-user-security-api.ts`).
- [x] `src/repository/auth/login/OpenLoginRepositoryImpl.test.ts` is correct (renamed to `open-login-repository-impl.test.ts`).
- [x] `src/repository/auth/login/OpenLoginRepositoryImpl.ts` is correct (renamed to `open-login-repository-impl.ts`).
- [x] `src/repository/auth/refreshtoken/OpenRefreshTokenRepositoryImpl.test.ts` is correct (renamed to `open-refresh-token-repository-impl.test.ts`).
- [x] `src/repository/auth/refreshtoken/OpenRefreshTokenRepositoryImpl.ts` is correct (renamed to `open-refresh-token-repository-impl.ts`).
- [x] `src/repository/auth/registration/OpenRegistrationRepositoryImpl.test.ts` is correct (renamed to `open-registration-repository-impl.test.ts`).
- [x] `src/repository/auth/registration/OpenRegistrationRepositoryImpl.ts` is correct (renamed to `open-registration-repository-impl.ts`).
- [x] `src/repository/auth/resetpassword/OpenResetPasswordRepositoryImpl.test.ts` is correct (renamed to `open-reset-password-repository-impl.test.ts`).
- [x] `src/repository/auth/resetpassword/OpenResetPasswordRepositoryImpl.ts` is correct (renamed to `open-reset-password-repository-impl.ts`).
- [x] `src/repository/auth/settings/OpenAuthSettingsRepositoryImpl.test.ts` is correct (renamed to `open-auth-settings-repository-impl.test.ts`).
- [x] `src/repository/auth/settings/OpenAuthSettingsRepositoryImpl.ts` is correct (renamed to `open-auth-settings-repository-impl.ts`).
- [x] `src/repository/auth/unlock/OpenUnlockRepositoryImpl.test.ts` is correct (renamed to `open-unlock-repository-impl.test.ts`).
- [x] `src/repository/auth/unlock/OpenUnlockRepositoryImpl.ts` is correct (renamed to `open-unlock-repository-impl.ts`).
- [x] `src/repository/identifier/OpenIdentifierRepositoryImpl.test.ts` is correct (renamed to `open-identifier-repository-impl.test.ts`).
- [x] `src/repository/identifier/OpenIdentifierRepositoryImpl.ts` is correct (renamed to `open-identifier-repository-impl.ts`).
- [x] `src/repository/session/OpenSessionRepositoryImpl.test.ts` is correct (renamed to `open-session-repository-impl.test.ts`).
- [x] `src/repository/session/OpenSessionRepositoryImpl.ts` is correct (renamed to `open-session-repository-impl.ts`).
- [x] `src/repository/user/OpenUserRepositoryImpl.test.ts` is correct (renamed to `open-user-repository-impl.test.ts`).
- [x] `src/repository/user/OpenUserRepositoryImpl.ts` is correct (renamed to `open-user-repository-impl.ts`).
- [x] `src/repository/user/security/OpenUserSecurityRepositoryImpl.test.ts` is correct (renamed to `open-user-security-repository-impl.test.ts`).
- [x] `src/repository/user/security/OpenUserSecurityRepositoryImpl.ts` is correct (renamed to `open-user-security-repository-impl.ts`).
- [x] `src/ui/screens/auth/login/ClientLoginDestination.ts` is correct (renamed to `client-login-destination.ts`).
- [x] `src/ui/screens/auth/login/phone/LoginByPhoneScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/phone/LoginByPhoneScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/phone/LoginByPhoneScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/phone/LoginByPhoneStore.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/ClientLoginRootScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/ClientLoginRootScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/ClientLoginRootScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/ClientLoginRootStore.tsx` is correct.
- [x] `src/ui/screens/auth/registration/email/RegistrationByEmailScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/registration/email/RegistrationByEmailScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/registration/email/RegistrationByEmailScreen.tsx` is correct.
- [x] `src/ui/screens/auth/registration/email/RegistrationByEmailStore.tsx` is correct.
- [x] `src/usecase/auth/settings/RefreshOpenAuthSettingsUseCase.ts` is correct (renamed to `refresh-open-auth-settings-use-case.ts`).
- [x] `src/usecase/configuration/RefreshClientUserConfigurationUseCase.ts` is correct (renamed to `refresh-client-user-configuration-use-case.ts`).

### Phase 7: Final Review & Export
- [x] Export all public contracts, components, use cases, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-clientuser`.

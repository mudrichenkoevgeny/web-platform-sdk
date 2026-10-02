# Feature User — Implementation Plan

This document outlines the step-by-step implementation plan for the `feature-user` module in the Web Platform SDK. It maps user identity, multi-method authentication flows (Email, Phone OTP, Google), session-oriented HTTP behavior, encrypted token storage, profile management, and React UI components from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, React, Zustand, WebCrypto, native Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in `HttpClient` with `AuthHttpClientConfigPlugin` for bearer token insertion & transparent refresh.
*   **Encrypted Storage** -> `EncryptedSettings` for JWT token and profile caching (`AuthStorage`, `UserStorage`).
*   **Decompose Navigation** -> React state machines / Zustand stores / router flows.
*   **Compose UI** -> React (`.tsx`) + Tailwind CSS components.
*   **Field Validation** -> `FieldValidator` client-side validation logic.

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `UserSessionId`) must use `toXxxIdOrThrow()` conversions.
*   Every `.tsx` component must have a `.test.tsx` and `.stories.tsx`.

---

## 🏗️ Implementation Phases

### Phase 1: Domain Models, Enums & Utilities
- [ ] Implement domain models (`AppType`, `UnlockMethod`, `ConfirmationKey`, `ConfirmationType`).
- [ ] Implement `FieldValidator` (email, phone, TOTP, name validation helpers).
- [ ] Implement `ClientUserErrorCodes` constants, `UserError`, and `UserErrorParser` (registered in `AppErrorParserBuilder`).
- [ ] Write unit tests for `FieldValidator` and `UserErrorParser`.

### Phase 2: Storage Layer & Auth Interceptors
- [ ] Implement `AuthStorage` & `EncryptedAuthStorage` (managing encrypted JWT access/refresh token persistence).
- [ ] Implement `UserStorage` & `EncryptedUserStorage` (cached user profile data).
- [ ] Implement `OpenAuthSettingsStorage` & `EncryptedOpenAuthSettingsStorage`.
- [ ] Implement `AuthHttpClientConfigPlugin` (bearer token insertion & transparent session auto-refresh on 401).
- [ ] Implement MFA step-up plugins (`MfaStepUpHttpClientConfigPlugin`, `MfaStepUpPlugin`, `DefaultMfaChallengeHandler`).
- [ ] Write unit tests for storage components and `AuthHttpClientConfigPlugin`.

### Phase 3: Network Layer (APIs & WebSockets)
- [ ] Implement Auth REST APIs (`RefreshTokenApi`, `ResetPasswordApi`, `OpenUserConfigurationApi`, `SessionApi`, `UserSecurityApi`).
- [ ] Implement `UserAuthServices` & Web Google Auth interop service (`GoogleAuthService`, `DisabledGoogleAuthService`).
- [ ] Implement `UserWebSocketMessageHandler` (listening for profile updates, session revoking, and security events).
- [ ] Write unit tests for API layers and WebSocket message handlers.

### Phase 4: Repositories
- [ ] Implement Auth Repositories (`LoginRepository`, `RefreshTokenRepository`, `RegistrationRepository`, `ResetPasswordRepository`, `OpenAuthSettingsRepository`, `UnlockRepository`).
- [ ] Implement `ConfirmationRepository` & `ConfirmationRepositoryImpl` (handling verification code send cooldowns and throttling).
- [ ] Implement `IdentifierRepository`, `SessionRepository`, `UserRepository`, `UserSecurityRepository` & `UserSecurityRepositoryImpl`.
- [ ] Write unit tests for Repositories.

### Phase 5: Use Cases
- [ ] Implement Auth & Login Use Cases (`LoginByEmailUseCase`, `LoginByPhoneUseCase`, `LoginByTotpUseCase`, `LoginByTotpRecoveryCodeUseCase`, `LoginByGoogleUseCase`, `SendLoginConfirmationToPhoneUseCase`, `RefreshTokenUseCase`).
- [ ] Implement Registration Use Cases (`RegistrationByEmailUseCase`, `SendRegistrationConfirmationToEmailUseCase`).
- [ ] Implement Reset Password & Unlock Use Cases (`ResetEmailPasswordUseCase`, `SendResetPasswordConfirmationToEmailUseCase`, `UnlockByEmailUseCase`, `UnlockByPhoneUseCase`, `UnlockByGoogleUseCase`, `UnlockByExternalAuthProviderUseCase`, `SendUnlockEmailConfirmationUseCase`, `SendUnlockPhoneConfirmationUseCase`).
- [ ] Implement Auth Settings Use Cases (`GetAuthSettingsUseCase`, `GetAvailableUserAuthProvidersUseCase`, `ObserveAuthSettingsUseCase`).
- [ ] Implement Identifier Use Cases (`GetUserIdentifiersUseCase`, `GetUserIdentifierUseCase`, `AddUserIdentifierEmailUseCase`, `AddUserIdentifierPhoneUseCase`, `AddUserIdentifierGoogleUseCase`, `DeleteUserIdentifierUseCase`, `EmailChangePasswordUseCase`, `SendAddEmailIdentifierConfirmationUseCase`, `SendAddPhoneIdentifierConfirmationUseCase`).
- [ ] Implement Session Use Cases (`GetSessionsUseCase`, `GetSessionUseCase`, `DeleteSessionUseCase`, `DeleteAllOtherSessionsUseCase`, `LogoutUseCase`, `ReauthenticateSessionUseCase`).
- [ ] Implement User & Security Use Cases (`GetUserUseCase`, `RestoreUserUseCase`, `ScheduleUserDeletionUseCase`, `SetupTotpUseCase`, `EnableTotpUseCase`, `DisableTotpUseCase`, `GetRecoveryCodesUseCase`, `RegenerateRecoveryCodesUseCase`).
- [ ] Write unit tests for Use Cases.

### Phase 6: Reusable UI Components
- [ ] Implement Auth Provider UI components (`AuthProviderButton`, `AuthProviderButtonMode`, `AuthProviderGrid`, `AuthProviderItem`).
- [ ] Implement Legal UI components (`LegalFooter`).
- [ ] Implement MFA UI components (`MfaChallengeDialog`).
- [ ] Implement Identifier UI components (`IdentifierItem`).
- [ ] Implement Session UI components (`SessionItem`).
- [ ] Write `.test.tsx` and `.stories.tsx` for all UI components.

### Phase 7: Screen State Machines & React Flow Components
- [ ] Implement Login & Auth screen components (Welcome, Login by Email, Login by Phone, Login by TOTP, Pending Deletion, Reset Password, Unlock Root, Unlock OTP, Unlock Method Selection, Unlock Target Input).
- [ ] Implement Profile & Account Management screen components (Profile Root, Main Profile, Identifier Detail, Identifier List, Session Detail, Session List, TOTP Main, TOTP Recovery Codes).
- [ ] Write `.test.tsx` and `.stories.tsx` for all screens and controllers.

### Phase 8: Dependency Injection & Mocks
- [ ] Implement DI module (`UserStorageModule`).
- [ ] Implement mocks for Auth, Domain Models, APIs, Storage, Repositories, Use Cases, and UI Controllers (`UserAuthServicesMock`, `GoogleAuthServiceMock`, `LoginRepositoryMock`, `UserRepositoryMock`, etc.).

### Phase 9: Final Review & Export
- [ ] Export all public interfaces, models, use cases, components, and mocks in `src/index.ts`.
- [ ] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-user`.

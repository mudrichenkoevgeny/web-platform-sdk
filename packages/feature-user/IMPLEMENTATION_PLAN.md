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
*   Preserve JSDoc/TSDoc documentation for public/exported interfaces, types, functions, and components. No inline comments inside code bodies.
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `UserSessionId`) must use `toXxxIdOrThrow()` conversions.
*   Every `.tsx` component must have a `.test.tsx` and `.stories.tsx`.

---

## 🏗️ Implementation Phases

### Phase 1: Domain Models, Enums & Utilities
- [x] Implement domain models (`AppType`, `UnlockMethod`, `ConfirmationKey`, `ConfirmationType`).
- [x] Implement `FieldValidator` (email, phone, TOTP, name validation helpers).
- [x] Implement `ClientUserErrorCodes` constants, `UserError`, and `UserErrorParser` (registered in `AppErrorParserBuilder`).
- [x] Write unit tests for `FieldValidator` and `UserErrorParser`.

### Phase 2: Storage Layer & Auth Interceptors
- [x] Implement `AuthStorage` & `EncryptedAuthStorage` (managing encrypted JWT access/refresh token persistence).
- [x] Implement `UserStorage` & `EncryptedUserStorage` (cached user profile data).
- [x] Implement `OpenAuthSettingsStorage` & `EncryptedOpenAuthSettingsStorage`.
- [x] Implement `AuthHttpClientConfigPlugin` (bearer token insertion & transparent session auto-refresh on 401).
- [x] Implement MFA step-up plugins (`MfaStepUpHttpClientConfigPlugin`, `MfaStepUpPlugin`, `DefaultMfaChallengeHandler`).
- [x] Write unit tests for storage components and `AuthHttpClientConfigPlugin`.

### Phase 3: Network Layer (APIs & WebSockets)
- [x] Implement Auth REST APIs (`RefreshTokenApi`, `ResetPasswordApi`, `OpenUserConfigurationApi`, `SessionApi`, `UserSecurityApi`).
- [x] Implement `UserAuthServices` & Web Google Auth interop service (`GoogleAuthService`, `DisabledGoogleAuthService`, `WebGoogleAuthService`).
- [x] Implement `UserWebSocketMessageHandler` (listening for profile updates, session revoking, and security events).
- [x] Write unit tests for API layers and WebSocket message handlers.

### Phase 4: Repositories
- [x] Implement Auth Repositories (`LoginRepository`, `RefreshTokenRepository`, `RegistrationRepository`, `ResetPasswordRepository`, `OpenAuthSettingsRepository`, `UnlockRepository`).
- [x] Implement `ConfirmationRepository` & `ConfirmationRepositoryImpl` (handling verification code send cooldowns and throttling).
- [x] Implement `IdentifierRepository`, `SessionRepository`, `UserRepository`, `UserSecurityRepository` & `UserSecurityRepositoryImpl`.
- [x] Write unit tests for Repositories.

### Phase 5: Use Cases
- [x] Implement Auth & Login Use Cases (`LoginByEmailUseCase`, `LoginByPhoneUseCase`, `LoginByTotpUseCase`, `LoginByTotpRecoveryCodeUseCase`, `LoginByGoogleUseCase`, `SendLoginConfirmationToPhoneUseCase`, `RefreshTokenUseCase`).
- [x] Implement Registration Use Cases (`RegistrationByEmailUseCase`, `SendRegistrationConfirmationToEmailUseCase`).
- [x] Implement Reset Password & Unlock Use Cases (`ResetEmailPasswordUseCase`, `SendResetPasswordConfirmationToEmailUseCase`, `UnlockByEmailUseCase`, `UnlockByPhoneUseCase`, `UnlockByGoogleUseCase`, `UnlockByExternalAuthProviderUseCase`, `SendUnlockEmailConfirmationUseCase`, `SendUnlockPhoneConfirmationUseCase`).
- [x] Implement Auth Settings Use Cases (`GetAuthSettingsUseCase`, `GetAvailableUserAuthProvidersUseCase`, `ObserveAuthSettingsUseCase`).
- [x] Implement Identifier Use Cases (`GetUserIdentifiersUseCase`, `GetUserIdentifierUseCase`, `AddUserIdentifierEmailUseCase`, `AddUserIdentifierPhoneUseCase`, `AddUserIdentifierGoogleUseCase`, `DeleteUserIdentifierUseCase`, `EmailChangePasswordUseCase`, `SendAddEmailIdentifierConfirmationUseCase`, `SendAddPhoneIdentifierConfirmationUseCase`).
- [x] Implement Session Use Cases (`GetSessionsUseCase`, `GetSessionUseCase`, `DeleteSessionUseCase`, `DeleteAllOtherSessionsUseCase`, `LogoutUseCase`, `ReauthenticateSessionUseCase`).
- [x] Implement User & Security Use Cases (`GetUserUseCase`, `RestoreUserUseCase`, `ScheduleUserDeletionUseCase`, `SetupTotpUseCase`, `EnableTotpUseCase`, `DisableTotpUseCase`, `GetRecoveryCodesUseCase`, `RegenerateRecoveryCodesUseCase`).
- [x] Write unit tests for Use Cases.

### Phase 6: Reusable UI Components
- [x] Implement Auth Provider UI components (`AuthProviderButton`, `AuthProviderButtonMode`, `AuthProviderGrid`, `AuthProviderItem`).
- [x] Implement Legal UI components (`LegalFooter`).
- [x] Implement MFA UI components (`MfaChallengeDialog`).
- [x] Implement Identifier UI components (`IdentifierItem`).
- [x] Implement Session UI components (`SessionItem`).
- [x] Write `.test.tsx` and `.stories.tsx` for all UI components.

### Phase 7: Screen State Machines & React Flow Components
- [x] Implement Login & Auth screen components (LoginRootContainer [x], Welcome [x], Login by Email [x], Login by TOTP [x], Pending Deletion [x], Reset Password [x], Unlock Root [x], Unlock OTP [x], Unlock Method Selection [x], Unlock Target Input [x]).
- [x] Implement Profile & Account Management screen components (Profile Root [x], Main Profile [x], Identifier Detail [x], Identifier List [x], Session Detail [x], Session List [x], TOTP Main [x], TOTP Recovery Codes [x]).
- [x] Write `.test.tsx` and `.stories.tsx` for all screens and controllers.

### Phase 8: Dependency Injection & Mocks
- [x] Implement DI module (`UserStorageModule`).
- [x] Implement mocks for Auth, Domain Models, APIs, Storage, Repositories, Use Cases, and UI Controllers (`UserAuthServicesMock`, `GoogleAuthServiceMock`, `LoginRepositoryMock`, `UserRepositoryMock`, etc.).

### Phase 9: Final Review & Export
- [x] Export all public interfaces, models, use cases, components, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-user`.

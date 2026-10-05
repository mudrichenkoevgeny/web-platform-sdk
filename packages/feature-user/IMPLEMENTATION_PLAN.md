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

### Phase 9: File Naming Normalization Refactoring
- [x] Rename directory `src/mock/network/api/auth/refreshtoken/` to `src/mock/network/api/auth/refresh-token/` and update imports.
- [x] Rename directory `src/mock/network/api/auth/resetpassword/` to `src/mock/network/api/auth/reset-password/` and update imports.
- [x] Rename directory `src/mock/repository/auth/refreshtoken/` to `src/mock/repository/auth/refresh-token/` and update imports.
- [x] Rename directory `src/mock/repository/auth/resetpassword/` to `src/mock/repository/auth/reset-password/` and update imports.
- [x] Rename directory `src/mock/usecase/auth/resetpassword/` to `src/mock/usecase/auth/reset-password/` and update imports.
- [x] Rename directory `src/network/api/auth/refreshtoken/` to `src/network/api/auth/refresh-token/` and update imports.
- [x] Rename directory `src/network/api/auth/resetpassword/` to `src/network/api/auth/reset-password/` and update imports.
- [x] Rename directory `src/network/websocket/messagehandler/` to `src/network/websocket/message-handler/` and update imports.
- [x] Rename directory `src/repository/auth/refreshtoken/` to `src/repository/auth/refresh-token/` and update imports.
- [x] Rename directory `src/repository/auth/resetpassword/` to `src/repository/auth/reset-password/` and update imports.
- [x] `src/auth/UserAuthServices.ts` is correct (renamed to `user-auth-services.ts`).
- [x] `src/auth/google/DisabledGoogleAuthService.test.ts` is correct (renamed to `disabled-google-auth-service.test.ts`).
- [x] `src/auth/google/DisabledGoogleAuthService.ts` is correct (renamed to `disabled-google-auth-service.ts`).
- [x] `src/auth/google/GoogleAuthService.ts` is correct (renamed to `google-auth-service.ts`).
- [x] `src/auth/google/WebGoogleAuthService.test.ts` is correct (renamed to `web-google-auth-service.test.ts`).
- [x] `src/auth/google/WebGoogleAuthService.ts` is correct (renamed to `web-google-auth-service.ts`).
- [x] `src/di/UserStorageModule.ts` is correct (renamed to `user-storage-module.ts`).
- [x] `src/error/model/UserError.ts` is correct (renamed to `user-error.ts`).
- [x] `src/error/naming/ClientUserErrorCodes.ts` is correct (renamed to `client-user-error-codes.ts`).
- [x] `src/error/parser/UserErrorParser.test.ts` is correct (renamed to `user-error-parser.test.ts`).
- [x] `src/error/parser/UserErrorParser.ts` is correct (renamed to `user-error-parser.ts`).
- [x] `src/index.ts` is correct.
- [x] `src/locales/en/strings.ts` is correct.
- [x] `src/locales/index.ts` is correct.
- [x] `src/locales/ru/strings.ts` is correct.
- [x] `src/mock/auth/UserAuthServicesMock.ts` is correct (renamed to `user-auth-services-mock.ts`).
- [x] `src/mock/auth/google/GoogleAuthServiceMock.ts` is correct (renamed to `google-auth-service-mock.ts`).
- [x] `src/mock/domain/model/auth/settings/availableAuthProvidersMock.ts` is correct (renamed to `available-auth-providers-mock.ts`).
- [x] `src/mock/domain/model/auth/settings/openAuthSettingsMock.ts` is correct (renamed to `open-auth-settings-mock.ts`).
- [x] `src/mock/domain/model/identifier/userIdentifierMock.ts` is correct (renamed to `user-identifier-mock.ts`).
- [x] `src/mock/domain/model/session/userSessionMock.ts` is correct (renamed to `user-session-mock.ts`).
- [x] `src/mock/domain/model/user/userDetailsMock.ts` is correct (renamed to `user-details-mock.ts`).
- [x] `src/mock/index.ts` is correct.
- [x] `src/mock/network/api/auth/refreshtoken/RefreshTokenApiMock.ts` is correct (renamed to `refresh-token-api-mock.ts`).
- [x] `src/mock/network/api/auth/resetpassword/ResetPasswordApiMock.ts` is correct (renamed to `reset-password-api-mock.ts`).
- [x] `src/mock/network/api/session/SessionApiMock.ts` is correct (renamed to `session-api-mock.ts`).
- [x] `src/mock/network/api/user/security/UserSecurityApiMock.ts` is correct (renamed to `user-security-api-mock.ts`).
- [x] `src/mock/network/model/auth/data/authDataPayloadMock.ts` is correct (renamed to `auth-data-payload-mock.ts`).
- [x] `src/mock/network/model/auth/settings/availableAuthProvidersPayloadMock.ts` is correct (renamed to `available-auth-providers-payload-mock.ts`).
- [x] `src/mock/network/model/auth/settings/openAuthSettingsPayloadMock.ts` is correct (renamed to `open-auth-settings-payload-mock.ts`).
- [x] `src/mock/network/model/identifier/userIdentifierPayloadMock.ts` is correct (renamed to `user-identifier-payload-mock.ts`).
- [x] `src/mock/network/model/session/userSessionPayloadMock.ts` is correct (renamed to `user-session-payload-mock.ts`).
- [x] `src/mock/network/model/token/sessionTokenPayloadMock.ts` is correct (renamed to `session-token-payload-mock.ts`).
- [x] `src/mock/network/model/user/userDetailsPayloadMock.ts` is correct (renamed to `user-details-payload-mock.ts`).
- [x] `src/mock/repository/auth/login/LoginRepositoryMock.ts` is correct (renamed to `login-repository-mock.ts`).
- [x] `src/mock/repository/auth/refreshtoken/RefreshTokenRepositoryMock.ts` is correct (renamed to `refresh-token-repository-mock.ts`).
- [x] `src/mock/repository/auth/registration/RegistrationRepositoryMock.ts` is correct (renamed to `registration-repository-mock.ts`).
- [x] `src/mock/repository/auth/resetpassword/ResetPasswordRepositoryMock.ts` is correct (renamed to `reset-password-repository-mock.ts`).
- [x] `src/mock/repository/auth/settings/OpenAuthSettingsRepositoryMock.ts` is correct (renamed to `open-auth-settings-repository-mock.ts`).
- [x] `src/mock/repository/auth/unlock/UnlockRepositoryMock.ts` is correct (renamed to `unlock-repository-mock.ts`).
- [x] `src/mock/repository/confirmation/ConfirmationRepositoryMock.ts` is correct (renamed to `confirmation-repository-mock.ts`).
- [x] `src/mock/repository/identifier/IdentifierRepositoryMock.ts` is correct (renamed to `identifier-repository-mock.ts`).
- [x] `src/mock/repository/session/SessionRepositoryMock.ts` is correct (renamed to `session-repository-mock.ts`).
- [x] `src/mock/repository/user/UserRepositoryMock.ts` is correct (renamed to `user-repository-mock.ts`).
- [x] `src/mock/repository/user/security/UserSecurityRepositoryMock.ts` is correct (renamed to `user-security-repository-mock.ts`).
- [x] `src/mock/storage/auth/AuthStorageMock.ts` is correct (renamed to `auth-storage-mock.ts`).
- [x] `src/mock/storage/auth/settings/OpenAuthSettingsStorageMock.ts` is correct (renamed to `open-auth-settings-storage-mock.ts`).
- [x] `src/mock/storage/user/UserStorageMock.ts` is correct (renamed to `user-storage-mock.ts`).
- [x] `src/mock/usecase/auth/login/LoginByEmailUseCaseMock.ts` is correct (renamed to `login-by-email-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/login/LoginByPhoneUseCaseMock.ts` is correct (renamed to `login-by-phone-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/login/LoginByTotpRecoveryCodeUseCaseMock.ts` is correct (renamed to `login-by-totp-recovery-code-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/login/LoginByTotpUseCaseMock.ts` is correct (renamed to `login-by-totp-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/login/SendLoginConfirmationToPhoneUseCaseMock.ts` is correct (renamed to `send-login-confirmation-to-phone-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/registration/RegistrationByEmailUseCaseMock.ts` is correct (renamed to `registration-by-email-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/registration/SendRegistrationConfirmationToEmailUseCaseMock.ts` is correct (renamed to `send-registration-confirmation-to-email-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/resetpassword/ResetEmailPasswordUseCaseMock.ts` is correct (renamed to `reset-email-password-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/resetpassword/SendResetPasswordConfirmationToEmailUseCaseMock.ts` is correct (renamed to `send-reset-password-confirmation-to-email-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/SendUnlockEmailConfirmationUseCaseMock.ts` is correct (renamed to `send-unlock-email-confirmation-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/SendUnlockPhoneConfirmationUseCaseMock.ts` is correct (renamed to `send-unlock-phone-confirmation-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/UnlockByEmailUseCaseMock.ts` is correct (renamed to `unlock-by-email-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/UnlockByExternalAuthProviderUseCaseMock.ts` is correct (renamed to `unlock-by-external-auth-provider-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/UnlockByGoogleUseCaseMock.ts` is correct (renamed to `unlock-by-google-use-case-mock.ts`).
- [x] `src/mock/usecase/auth/unlock/UnlockByPhoneUseCaseMock.ts` is correct (renamed to `unlock-by-phone-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/AddUserIdentifierEmailUseCaseMock.ts` is correct (renamed to `add-user-identifier-email-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/AddUserIdentifierPhoneUseCaseMock.ts` is correct (renamed to `add-user-identifier-phone-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/DeleteUserIdentifierUseCaseMock.ts` is correct (renamed to `delete-user-identifier-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/EmailChangePasswordUseCaseMock.ts` is correct (renamed to `email-change-password-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/GetUserIdentifierUseCaseMock.ts` is correct (renamed to `get-user-identifier-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/GetUserIdentifiersUseCaseMock.ts` is correct (renamed to `get-user-identifiers-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/SendAddEmailIdentifierConfirmationUseCaseMock.ts` is correct (renamed to `send-add-email-identifier-confirmation-use-case-mock.ts`).
- [x] `src/mock/usecase/identifier/SendAddPhoneIdentifierConfirmationUseCaseMock.ts` is correct (renamed to `send-add-phone-identifier-confirmation-use-case-mock.ts`).
- [x] `src/mock/usecase/session/DeleteAllOtherSessionsUseCaseMock.ts` is correct (renamed to `delete-all-other-sessions-use-case-mock.ts`).
- [x] `src/mock/usecase/session/DeleteSessionUseCaseMock.ts` is correct (renamed to `delete-session-use-case-mock.ts`).
- [x] `src/mock/usecase/session/GetSessionUseCaseMock.ts` is correct (renamed to `get-session-use-case-mock.ts`).
- [x] `src/mock/usecase/session/GetSessionsUseCaseMock.ts` is correct (renamed to `get-sessions-use-case-mock.ts`).
- [x] `src/mock/usecase/session/LogoutUseCaseMock.ts` is correct (renamed to `logout-use-case-mock.ts`).
- [x] `src/mock/usecase/user/GetUserUseCaseMock.ts` is correct (renamed to `get-user-use-case-mock.ts`).
- [x] `src/mock/usecase/user/RestoreUserUseCaseMock.ts` is correct (renamed to `restore-user-use-case-mock.ts`).
- [x] `src/mock/usecase/user/ScheduleUserDeletionUseCaseMock.ts` is correct (renamed to `schedule-user-deletion-use-case-mock.ts`).
- [x] `src/mock/usecase/user/security/DisableTotpUseCaseMock.ts` is correct (renamed to `disable-totp-use-case-mock.ts`).
- [x] `src/mock/usecase/user/security/EnableTotpUseCaseMock.ts` is correct (renamed to `enable-totp-use-case-mock.ts`).
- [x] `src/mock/usecase/user/security/GetRecoveryCodesUseCaseMock.ts` is correct (renamed to `get-recovery-codes-use-case-mock.ts`).
- [x] `src/mock/usecase/user/security/RegenerateRecoveryCodesUseCaseMock.ts` is correct (renamed to `regenerate-recovery-codes-use-case-mock.ts`).
- [x] `src/mock/usecase/user/security/SetupTotpUseCaseMock.ts` is correct (renamed to `setup-totp-use-case-mock.ts`).
- [x] `src/network/api/auth/refreshtoken/RefreshTokenApi.ts` is correct (renamed to `refresh-token-api.ts`).
- [x] `src/network/api/auth/resetpassword/ResetPasswordApi.ts` is correct (renamed to `reset-password-api.ts`).
- [x] `src/network/api/configuration/FetchOpenUserConfigurationApi.test.ts` is correct (renamed to `fetch-open-user-configuration-api.test.ts`).
- [x] `src/network/api/configuration/FetchOpenUserConfigurationApi.ts` is correct (renamed to `fetch-open-user-configuration-api.ts`).
- [x] `src/network/api/configuration/OpenUserConfigurationApi.ts` is correct (renamed to `open-user-configuration-api.ts`).
- [x] `src/network/api/session/SessionApi.ts` is correct (renamed to `session-api.ts`).
- [x] `src/network/api/user/security/UserSecurityApi.ts` is correct (renamed to `user-security-api.ts`).
- [x] `src/network/auth/IsPublicApi.ts` is correct (renamed to `is-public-api.ts`).
- [x] `src/network/httpclient/AuthHttpClientConfigPlugin.test.ts` is correct (renamed to `auth-http-client-config-plugin.test.ts`).
- [x] `src/network/httpclient/AuthHttpClientConfigPlugin.ts` is correct (renamed to `auth-http-client-config-plugin.ts`).
- [x] `src/network/httpclient/mfa/DefaultMfaChallengeHandler.test.ts` is correct (renamed to `default-mfa-challenge-handler.test.ts`).
- [x] `src/network/httpclient/mfa/DefaultMfaChallengeHandler.ts` is correct (renamed to `default-mfa-challenge-handler.ts`).
- [x] `src/network/httpclient/mfa/MfaChallengeHandler.ts` is correct (renamed to `mfa-challenge-handler.ts`).
- [x] `src/network/httpclient/mfa/MfaChallengeRequest.ts` is correct (renamed to `mfa-challenge-request.ts`).
- [x] `src/network/httpclient/mfa/MfaStepUpHttpClientConfigPlugin.test.ts` is correct (renamed to `mfa-step-up-http-client-config-plugin.test.ts`).
- [x] `src/network/httpclient/mfa/MfaStepUpHttpClientConfigPlugin.ts` is correct (renamed to `mfa-step-up-http-client-config-plugin.ts`).
- [x] `src/network/websocket/messagehandler/UserWebSocketMessageHandler.test.ts` is correct (renamed to `user-web-socket-message-handler.test.ts`).
- [x] `src/network/websocket/messagehandler/UserWebSocketMessageHandler.ts` is correct (renamed to `user-web-socket-message-handler.ts`).
- [x] `src/repository/auth/login/LoginRepository.ts` is correct (renamed to `login-repository.ts`).
- [x] `src/repository/auth/refreshtoken/RefreshTokenRepository.ts` is correct (renamed to `refresh-token-repository.ts`).
- [x] `src/repository/auth/registration/RegistrationRepository.ts` is correct (renamed to `registration-repository.ts`).
- [x] `src/repository/auth/resetpassword/ResetPasswordRepository.ts` is correct (renamed to `reset-password-repository.ts`).
- [x] `src/repository/auth/settings/OpenAuthSettingsRepository.ts` is correct (renamed to `open-auth-settings-repository.ts`).
- [x] `src/repository/auth/unlock/UnlockRepository.ts` is correct (renamed to `unlock-repository.ts`).
- [x] `src/repository/confirmation/ConfirmationRepository.ts` is correct (renamed to `confirmation-repository.ts`).
- [x] `src/repository/confirmation/ConfirmationRepositoryImpl.test.ts` is correct (renamed to `confirmation-repository-impl.test.ts`).
- [x] `src/repository/confirmation/ConfirmationRepositoryImpl.ts` is correct (renamed to `confirmation-repository-impl.ts`).
- [x] `src/repository/identifier/IdentifierRepository.ts` is correct (renamed to `identifier-repository.ts`).
- [x] `src/repository/session/SessionRepository.ts` is correct (renamed to `session-repository.ts`).
- [x] `src/repository/user/UserRepository.ts` is correct (renamed to `user-repository.ts`).
- [x] `src/repository/user/security/UserSecurityRepository.ts` is correct (renamed to `user-security-repository.ts`).
- [x] `src/repository/user/security/UserSecurityRepositoryImpl.test.ts` is correct (renamed to `user-security-repository-impl.test.ts`).
- [x] `src/repository/user/security/UserSecurityRepositoryImpl.ts` is correct (renamed to `user-security-repository-impl.ts`).
- [x] `src/storage/auth/AuthStorage.ts` is correct (renamed to `auth-storage.ts`).
- [x] `src/storage/auth/EncryptedAuthStorage.test.ts` is correct (renamed to `encrypted-auth-storage.test.ts`).
- [x] `src/storage/auth/EncryptedAuthStorage.ts` is correct (renamed to `encrypted-auth-storage.ts`).
- [x] `src/storage/auth/settings/EncryptedOpenAuthSettingsStorage.test.ts` is correct (renamed to `encrypted-open-auth-settings-storage.test.ts`).
- [x] `src/storage/auth/settings/EncryptedOpenAuthSettingsStorage.ts` is correct (renamed to `encrypted-open-auth-settings-storage.ts`).
- [x] `src/storage/auth/settings/OpenAuthSettingsStorage.ts` is correct (renamed to `open-auth-settings-storage.ts`).
- [x] `src/storage/user/EncryptedUserStorage.test.ts` is correct (renamed to `encrypted-user-storage.test.ts`).
- [x] `src/storage/user/EncryptedUserStorage.ts` is correct (renamed to `encrypted-user-storage.ts`).
- [x] `src/storage/user/UserStorage.ts` is correct (renamed to `user-storage.ts`).
- [x] `src/storage/user/UserStorageMock.ts` is correct (renamed to `user-storage-mock.ts`).
- [x] `src/types/svg.d.ts` is correct.
- [x] `src/ui/components/auth/button/AuthProviderButton.stories.tsx` is correct.
- [x] `src/ui/components/auth/button/AuthProviderButton.test.tsx` is correct.
- [x] `src/ui/components/auth/button/AuthProviderButton.tsx` is correct.
- [x] `src/ui/components/auth/button/AuthProviderButtonMode.ts` is correct (renamed to `auth-provider-button-mode.ts`).
- [x] `src/ui/components/auth/grid/AuthProviderGrid.stories.tsx` is correct.
- [x] `src/ui/components/auth/grid/AuthProviderGrid.test.tsx` is correct.
- [x] `src/ui/components/auth/grid/AuthProviderGrid.tsx` is correct.
- [x] `src/ui/components/auth/item/AuthProviderItem.stories.tsx` is correct.
- [x] `src/ui/components/auth/item/AuthProviderItem.test.tsx` is correct.
- [x] `src/ui/components/auth/item/AuthProviderItem.tsx` is correct.
- [x] `src/ui/components/identifier/item/IdentifierItem.stories.tsx` is correct.
- [x] `src/ui/components/identifier/item/IdentifierItem.test.tsx` is correct.
- [x] `src/ui/components/identifier/item/IdentifierItem.tsx` is correct.
- [x] `src/ui/components/legal/footer/LegalFooter.stories.tsx` is correct.
- [x] `src/ui/components/legal/footer/LegalFooter.test.tsx` is correct.
- [x] `src/ui/components/legal/footer/LegalFooter.tsx` is correct.
- [x] `src/ui/components/mfa/dialog/MfaChallengeDialog.stories.tsx` is correct.
- [x] `src/ui/components/mfa/dialog/MfaChallengeDialog.test.tsx` is correct.
- [x] `src/ui/components/mfa/dialog/MfaChallengeDialog.tsx` is correct.
- [x] `src/ui/components/session/item/SessionItem.stories.tsx` is correct.
- [x] `src/ui/components/session/item/SessionItem.test.tsx` is correct.
- [x] `src/ui/components/session/item/SessionItem.tsx` is correct.
- [x] `src/ui/screens/auth/login/email/LoginByEmailScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/email/LoginByEmailScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/email/LoginByEmailScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/email/LoginByEmailStore.tsx` is correct (renamed to `login-by-email-store.ts`).
- [x] `src/ui/screens/auth/login/pendingdeletion/PendingDeletionScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/pendingdeletion/PendingDeletionScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/pendingdeletion/PendingDeletionScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/pendingdeletion/PendingDeletionStore.tsx` is correct (renamed to `pending-deletion-store.ts`).
- [x] `src/ui/screens/auth/login/root/LoginRootContainer.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/LoginRootContainer.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/root/LoginRootContainer.tsx` is correct.
- [x] `src/ui/screens/auth/login/totp/LoginByTotpScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/totp/LoginByTotpScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/totp/LoginByTotpScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/totp/LoginByTotpStore.tsx` is correct (renamed to `login-by-totp-store.ts`).
- [x] `src/ui/screens/auth/login/welcome/LoginWelcomeScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/login/welcome/LoginWelcomeScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/login/welcome/LoginWelcomeScreen.tsx` is correct.
- [x] `src/ui/screens/auth/login/welcome/LoginWelcomeStore.tsx` is correct (renamed to `login-welcome-store.ts`).
- [x] `src/ui/screens/auth/resetpassword/ResetEmailPasswordScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/resetpassword/ResetEmailPasswordScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/resetpassword/ResetEmailPasswordScreen.tsx` is correct.
- [x] `src/ui/screens/auth/resetpassword/ResetEmailPasswordStore.tsx` is correct (renamed to `reset-email-password-store.ts`).
- [x] `src/ui/screens/auth/unlock/otp/UnlockOtpScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/otp/UnlockOtpScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/otp/UnlockOtpScreen.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/otp/UnlockOtpStore.tsx` is correct (renamed to `unlock-otp-store.ts`).
- [x] `src/ui/screens/auth/unlock/root/UnlockRootContainer.stories.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/root/UnlockRootContainer.test.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/root/UnlockRootContainer.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/selection/UnlockMethodSelectionStore.tsx` is correct (renamed to `unlock-method-selection-store.ts`).
- [x] `src/ui/screens/auth/unlock/success/UnlockSuccessScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/success/UnlockSuccessScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/success/UnlockSuccessScreen.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/target/UnlockTargetInputScreen.stories.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/target/UnlockTargetInputScreen.test.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/target/UnlockTargetInputScreen.tsx` is correct.
- [x] `src/ui/screens/auth/unlock/target/UnlockTargetInputStore.tsx` is correct (renamed to `unlock-target-input-store.ts`).
- [x] `src/ui/screens/profile/ProfileDestination.ts` is correct (renamed to `profile-destination.ts`).
- [x] `src/ui/screens/profile/identifier/detail/IdentifierDetailScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/detail/IdentifierDetailScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/detail/IdentifierDetailScreen.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/detail/IdentifierDetailStore.tsx` is correct (renamed to `identifier-detail-store.ts`).
- [x] `src/ui/screens/profile/identifier/list/SelfIdentifierListScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/list/SelfIdentifierListScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/list/SelfIdentifierListScreen.tsx` is correct.
- [x] `src/ui/screens/profile/identifier/list/SelfIdentifierListStore.tsx` is correct (renamed to `self-identifier-list-store.ts`).
- [x] `src/ui/screens/profile/main/MainProfileScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/main/MainProfileScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/main/MainProfileScreen.tsx` is correct.
- [x] `src/ui/screens/profile/main/MainProfileStore.tsx` is correct (renamed to `main-profile-store.ts`).
- [x] `src/ui/screens/profile/root/ProfileRootContainer.stories.tsx` is correct.
- [x] `src/ui/screens/profile/root/ProfileRootContainer.test.tsx` is correct.
- [x] `src/ui/screens/profile/root/ProfileRootContainer.tsx` is correct.
- [x] `src/ui/screens/profile/session/detail/SessionDetailScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/session/detail/SessionDetailScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/session/detail/SessionDetailScreen.tsx` is correct.
- [x] `src/ui/screens/profile/session/detail/SessionDetailStore.tsx` is correct (renamed to `session-detail-store.ts`).
- [x] `src/ui/screens/profile/session/list/SelfSessionListScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/session/list/SelfSessionListScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/session/list/SelfSessionListScreen.tsx` is correct.
- [x] `src/ui/screens/profile/session/list/SelfSessionListStore.tsx` is correct (renamed to `self-session-list-store.ts`).
- [x] `src/ui/screens/profile/totp/main/TotpMainScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/totp/main/TotpMainScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/totp/main/TotpMainScreen.tsx` is correct.
- [x] `src/ui/screens/profile/totp/main/TotpMainStore.tsx` is correct (renamed to `totp-main-store.ts`).
- [x] `src/ui/screens/profile/totp/recovery/TotpRecoveryCodesScreen.stories.tsx` is correct.
- [x] `src/ui/screens/profile/totp/recovery/TotpRecoveryCodesScreen.test.tsx` is correct.
- [x] `src/ui/screens/profile/totp/recovery/TotpRecoveryCodesScreen.tsx` is correct.
- [x] `src/ui/screens/profile/totp/recovery/TotpRecoveryCodesStore.tsx` is correct (renamed to `totp-recovery-codes-store.ts`).
- [x] `src/usecase/auth/login/LoginByEmailUseCase.test.ts` is correct (renamed to `login-by-email-use-case.test.ts`).
- [x] `src/usecase/auth/login/LoginByEmailUseCase.ts` is correct (renamed to `login-by-email-use-case.ts`).
- [x] `src/usecase/auth/login/LoginByGoogleUseCase.ts` is correct (renamed to `login-by-google-use-case.ts`).
- [x] `src/usecase/auth/login/LoginByPhoneUseCase.ts` is correct (renamed to `login-by-phone-use-case.ts`).
- [x] `src/usecase/auth/login/LoginByTotpRecoveryCodeUseCase.ts` is correct (renamed to `login-by-totp-recovery-code-use-case.ts`).
- [x] `src/usecase/auth/login/LoginByTotpUseCase.ts` is correct (renamed to `login-by-totp-use-case.ts`).
- [x] `src/usecase/auth/login/SendLoginConfirmationToPhoneUseCase.ts` is correct (renamed to `send-login-confirmation-to-phone-use-case.ts`).
- [x] `src/usecase/auth/refreshtoken/RefreshTokenUseCase.test.ts` is correct (renamed to `refresh-token-use-case.test.ts`).
- [x] `src/usecase/auth/refreshtoken/RefreshTokenUseCase.ts` is correct (renamed to `refresh-token-use-case.ts`).
- [x] `src/usecase/auth/registration/RegistrationByEmailUseCase.ts` is correct (renamed to `registration-by-email-use-case.ts`).
- [x] `src/usecase/auth/registration/SendRegistrationConfirmationToEmailUseCase.ts` is correct (renamed to `send-registration-confirmation-to-email-use-case.ts`).
- [x] `src/usecase/auth/resetpassword/ResetEmailPasswordUseCase.ts` is correct (renamed to `reset-email-password-use-case.ts`).
- [x] `src/usecase/auth/resetpassword/SendResetPasswordConfirmationToEmailUseCase.ts` is correct (renamed to `send-reset-password-confirmation-to-email-use-case.ts`).
- [x] `src/usecase/auth/settings/GetAuthSettingsUseCase.ts` is correct (renamed to `get-auth-settings-use-case.ts`).
- [x] `src/usecase/auth/settings/GetAvailableUserAuthProvidersUseCase.test.ts` is correct (renamed to `get-available-user-auth-providers-use-case.test.ts`).
- [x] `src/usecase/auth/settings/GetAvailableUserAuthProvidersUseCase.ts` is correct (renamed to `get-available-user-auth-providers-use-case.ts`).
- [x] `src/usecase/auth/settings/ObserveAuthSettingsUseCase.ts` is correct (renamed to `observe-auth-settings-use-case.ts`).
- [x] `src/usecase/auth/unlock/SendUnlockEmailConfirmationUseCase.ts` is correct (renamed to `send-unlock-email-confirmation-use-case.ts`).
- [x] `src/usecase/auth/unlock/SendUnlockPhoneConfirmationUseCase.ts` is correct (renamed to `send-unlock-phone-confirmation-use-case.ts`).
- [x] `src/usecase/auth/unlock/UnlockByEmailUseCase.ts` is correct (renamed to `unlock-by-email-use-case.ts`).
- [x] `src/usecase/auth/unlock/UnlockByExternalAuthProviderUseCase.ts` is correct (renamed to `unlock-by-external-auth-provider-use-case.ts`).
- [x] `src/usecase/auth/unlock/UnlockByGoogleUseCase.ts` is correct (renamed to `unlock-by-google-use-case.ts`).
- [x] `src/usecase/auth/unlock/UnlockByPhoneUseCase.ts` is correct (renamed to `unlock-by-phone-use-case.ts`).
- [x] `src/usecase/identifier/AddUserIdentifierEmailUseCase.ts` is correct (renamed to `add-user-identifier-email-use-case.ts`).
- [x] `src/usecase/identifier/AddUserIdentifierGoogleUseCase.test.ts` is correct (renamed to `add-user-identifier-google-use-case.test.ts`).
- [x] `src/usecase/identifier/AddUserIdentifierGoogleUseCase.ts` is correct (renamed to `add-user-identifier-google-use-case.ts`).
- [x] `src/usecase/identifier/AddUserIdentifierPhoneUseCase.ts` is correct (renamed to `add-user-identifier-phone-use-case.ts`).
- [x] `src/usecase/identifier/DeleteUserIdentifierUseCase.ts` is correct (renamed to `delete-user-identifier-use-case.ts`).
- [x] `src/usecase/identifier/EmailChangePasswordUseCase.ts` is correct (renamed to `email-change-password-use-case.ts`).
- [x] `src/usecase/identifier/GetUserIdentifierUseCase.ts` is correct (renamed to `get-user-identifier-use-case.ts`).
- [x] `src/usecase/identifier/GetUserIdentifiersUseCase.ts` is correct (renamed to `get-user-identifiers-use-case.ts`).
- [x] `src/usecase/identifier/SendAddEmailIdentifierConfirmationUseCase.ts` is correct (renamed to `send-add-email-identifier-confirmation-use-case.ts`).
- [x] `src/usecase/identifier/SendAddPhoneIdentifierConfirmationUseCase.ts` is correct (renamed to `send-add-phone-identifier-confirmation-use-case.ts`).
- [x] `src/usecase/session/DeleteAllOtherSessionsUseCase.ts` is correct (renamed to `delete-all-other-sessions-use-case.ts`).
- [x] `src/usecase/session/DeleteSessionUseCase.ts` is correct (renamed to `delete-session-use-case.ts`).
- [x] `src/usecase/session/GetSessionUseCase.ts` is correct (renamed to `get-session-use-case.ts`).
- [x] `src/usecase/session/GetSessionsUseCase.ts` is correct (renamed to `get-sessions-use-case.ts`).
- [x] `src/usecase/session/LogoutUseCase.test.ts` is correct (renamed to `logout-use-case.test.ts`).
- [x] `src/usecase/session/LogoutUseCase.ts` is correct (renamed to `logout-use-case.ts`).
- [x] `src/usecase/session/ReauthenticateSessionUseCase.ts` is correct (renamed to `reauthenticate-session-use-case.ts`).
- [x] `src/usecase/user/GetUserUseCase.ts` is correct (renamed to `get-user-use-case.ts`).
- [x] `src/usecase/user/RestoreUserUseCase.ts` is correct (renamed to `restore-user-use-case.ts`).
- [x] `src/usecase/user/ScheduleUserDeletionUseCase.ts` is correct (renamed to `schedule-user-deletion-use-case.ts`).
- [x] `src/usecase/user/security/DisableTotpUseCase.ts` is correct (renamed to `disable-totp-use-case.ts`).
- [x] `src/usecase/user/security/EnableTotpUseCase.ts` is correct (renamed to `enable-totp-use-case.ts`).
- [x] `src/usecase/user/security/GetRecoveryCodesUseCase.ts` is correct (renamed to `get-recovery-codes-use-case.ts`).
- [x] `src/usecase/user/security/RegenerateRecoveryCodesUseCase.ts` is correct (renamed to `regenerate-recovery-codes-use-case.ts`).
- [x] `src/usecase/user/security/SetupTotpUseCase.ts` is correct (renamed to `setup-totp-use-case.ts`).
- [x] `src/validator/FieldValidator.test.ts` is correct (renamed to `field-validator.test.ts`).
- [x] `src/validator/FieldValidator.ts` is correct (renamed to `field-validator.ts`).

### Phase 10: Final Review & Export
- [x] Export all public interfaces, models, use cases, components, and mocks in `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully for `packages/feature-user`.

# @mudrichenkoevgeny/web-platform-sdk-feature-user

Base identity and authentication domain module for the Web Platform SDK: core **authentication state machine**, **WebCrypto token storage**, **MFA / TOTP 2FA workflows**, **session oversight**, **multi-identifier linking**, **MFA step-up HTTP interceptors**, and responsive **React UI screens & components** powered by Zustand.

This package depends on `@mudrichenkoevgeny/web-platform-sdk-core-common`, `@mudrichenkoevgeny/web-platform-sdk-core-security`, and `@mudrichenkoevgeny/web-platform-sdk-core-settings`. It serves as the shared domain foundation for both `@mudrichenkoevgeny/web-platform-sdk-feature-clientuser` and `@mudrichenkoevgeny/web-platform-sdk-feature-managementuser`.

---

## What It Provides

### 1. Multi-Method Authentication Workflows
- **Email Authentication:** `LoginByEmailUseCase`, `RegistrationByEmailUseCase`, `ResetEmailPasswordUseCase`.
- **Phone OTP:** `LoginByPhoneUseCase`, `SendLoginConfirmationToPhoneUseCase`, SMS confirmation flows.
- **Social OAuth:** `LoginByGoogleUseCase`, `GoogleAuthService` integration (Web and fallback handlers).
- **Two-Factor Authentication (TOTP):** `LoginByTotpUseCase`, `LoginByTotpRecoveryCodeUseCase`.
- **Account Lockout Recovery:** `UnlockByEmailUseCase`, `UnlockByPhoneUseCase`, `UnlockByGoogleUseCase`, OTP unlock verification.

### 2. Encrypted Token Storage & Auto-Refresh
- **`AuthStorage` / `EncryptedAuthStorage`:** WebCrypto AES-GCM encrypted persistence for JWT access and refresh tokens.
- **`UserStorage` / `EncryptedUserStorage`:** Encrypted local cache for current user session state and profile info.
- **`AuthHttpClientConfigPlugin`:** Native HTTP interceptor injecting Authorization Bearer headers and handling automatic token refresh cycles on `401 Unauthorized`.

### 3. MFA Step-Up & Challenge Handling
- **`MfaStepUpHttpClientConfigPlugin`:** Intercepts HTTP `428 Precondition Required` step-up requirements.
- **`MfaChallengeHandler` / `DefaultMfaChallengeHandler`:** Opens step-up challenge modals to verify user identity before retrying privileged actions.

### 4. TOTP 2FA & Security Governance
- **TOTP Lifecycle:** `SetupTotpUseCase`, `EnableTotpUseCase`, `DisableTotpUseCase`.
- **Recovery Codes:** `GetRecoveryCodesUseCase`, `RegenerateRecoveryCodesUseCase`.
- **QRCode Support:** QR code rendering for TOTP secret provisioning via `qrcode.react`.

### 5. Session Control & Identifiers
- **Session Operations:** `GetSessionsUseCase`, `DeleteSessionUseCase`, `DeleteAllOtherSessionsUseCase`, `LogoutUseCase`.
- **Identifier Management:** `AddUserIdentifierEmailUseCase`, `AddUserIdentifierPhoneUseCase`, `AddUserIdentifierGoogleUseCase`, `DeleteUserIdentifierUseCase`.
- **Account Lifecycles:** `ScheduleUserDeletionUseCase`, `RestoreUserUseCase`.

### 6. React UI Components & Screens
- **Reusable Components:** `AuthProviderButton`, `AuthProviderGrid`, `IdentifierItem`, `SessionItem`, `MfaChallengeDialog`, `LegalFooter`.
- **Authentication Screens:**
  - `LoginWelcomeScreen`, `LoginByEmailScreen`, `LoginByTotpScreen`, `PendingDeletionScreen`, `ResetEmailPasswordScreen`.
  - `UnlockRootContainer`, `UnlockMethodSelectionScreen`, `UnlockTargetInputScreen`, `UnlockOtpScreen`, `UnlockSuccessScreen`.
- **Profile & Account Management Screens:**
  - `MainProfileScreen` (user overview & navigation hub).
  - `TotpMainScreen`, `TotpRecoveryCodesScreen` (2FA configuration).
  - `SelfSessionListScreen`, `SessionDetailScreen` (active sessions).
  - `SelfIdentifierListScreen`, `IdentifierDetailScreen` (linked identity methods).

### 7. Real-Time Sync & Error Handling
- **`UserWebSocketMessageHandler`:** Listens for real-time WebSocket session termination and profile change broadcasts.
- **`UserError` / `UserErrorParser`:** Specialized error modeling and parsing for user domain errors (`ClientUserErrorCodes`).

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `UserStorageModule` for initializing storage components. |
| `src/auth/` | `UserAuthServices`, `GoogleAuthService`, `WebGoogleAuthService`, and disabled fallbacks. |
| `src/storage/` | `AuthStorage` (tokens), `UserStorage` (profiles), and WebCrypto AES-GCM implementations. |
| `src/network/` | REST APIs (`SessionApi`, `UserSecurityApi`), `AuthHttpClientConfigPlugin`, `MfaStepUpHttpClientConfigPlugin`, and `UserWebSocketMessageHandler`. |
| `src/repository/` | Repositories for Auth, Session, User, Identifier, and Confirmation key throttlers. |
| `src/usecase/` | Atomic use cases grouped into `auth/`, `session/`, `user/`, and `identifier/`. |
| `src/error/` | `UserError`, `ClientUserErrorCodes`, and `UserErrorParser`. |
| `src/validator/` | `FieldValidator` for email, phone number, and TOTP code formatting checks. |
| `src/ui/components/` | Reusable UI components (`AuthProviderGrid`, `IdentifierItem`, `SessionItem`, `LegalFooter`). |
| `src/ui/screens/` | React screens & Zustand stores for Auth, Reset Password, Unlock, and Profile. |
| `src/locales/` | Typed localization dictionaries (`UserStrings` with `enStrings` and `ruStrings`). |
| `src/mock/` | Complete suite of test doubles (`AuthStorageMock`, repository mocks, use case mocks). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-feature-user
```

### 2. System Registration

Register `UserErrorParser`, `AuthHttpClientConfigPlugin`, and `UserWebSocketMessageHandler` during host startup:

```typescript
import { UserErrorParser, UserWebSocketMessageHandler } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

// 1. Attach Auth HTTP Interceptor
commonComponent.httpClientConfigPlugins.push(clientUserComponent.authHttpClientConfigPlugin)

// 2. Register Error Parser
commonComponent.init({
  appErrorParserSpecificParsers: [UserErrorParser]
})

// 3. Register WebSocket Message Handler
commonComponent.webSocketService.updateWebSocketMessageHandlers([
  clientUserComponent.userWebSocketMessageHandler
])
```

### 3. Rendering User Profile Screen

```tsx
import { ProfileRootContainer } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

export function UserProfilePage() {
  return <ProfileRootContainer />
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

# Authentication & Token Refresh Flow

This document describes the multi-provider authentication flows, WebCrypto token storage, and the transparent access token refresh mechanism provided by `web-platform-sdk`.

---

## 1. Authentication Overview

The SDK supports flexible multi-provider authentication:
- **Email & Password**: Direct login (`LoginByEmailUseCase`) or registration with confirmation codes (`SendRegistrationConfirmationToEmailUseCase`, `RegistrationByEmailUseCase`).
- **Phone OTP**: Login or registration via SMS verification codes (`SendLoginConfirmationToPhoneUseCase`, `LoginByPhoneUseCase`).
- **Google Sign-In**: Authentication utilizing `WebGoogleAuthService` (leveraging the standard Google Identity Services web scripts).
- **TOTP / MFA**: Secondary authentication step when TOTP is enabled on the user account (`LoginByTotpUseCase`, `LoginByTotpRecoveryCodeUseCase`).

---

## 2. Authentication Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Component as ClientLoginRootScreen
    participant UseCase as LoginByEmailUseCase
    participant Repo as LoginRepository
    participant API as FetchOpenLoginApi
    participant AuthStore as EncryptedAuthStorage
    participant WS as WebWebSocketService

    User->>Component: Submit Credentials (Email/Password)
    Component->>UseCase: invoke(credentials)
    UseCase->>Repo: login(credentials)
    Repo->>API: POST /auth/login
    API-->>Repo: AuthDataPayload (AccessToken, RefreshToken, UserDetails)
    Repo->>AuthStore: Save tokens (AES-GCM encrypted)
    Repo->>Repo: Update UserStorage cache
    Repo-->>UseCase: AppResult.Success(UserDetails)
    UseCase-->>Component: AppResult.Success(UserDetails)
    Component->>WS: Re-connect WebSocket with new AccessToken
    Component-->>User: Navigate to Main Application Screen (Zustand state shift)
```

---

## 3. Synchronized Token Refresh Flow (`AuthHttpClientConfigPlugin`)

When a standard HTTP `fetch` API request fails with `401 Unauthorized`, `AuthHttpClientConfigPlugin` catches the error and handles token renewal transparently without interrupting the React UI or throwing runtime exceptions. Concurrency is managed via a shared Promise lock (Mutex).

```mermaid
sequenceDiagram
    autonumber
    participant API as Fetch API / Remote Server
    participant Plugin as AuthHttpClientConfigPlugin
    participant Mutex as Refresh Promise Lock
    participant RefreshUC as RefreshTokenUseCase
    participant AuthStore as EncryptedAuthStorage

    API-->>Plugin: HTTP 401 Unauthorized
    Plugin->>Mutex: Wait for existing lock or Acquire (prevents concurrent refresh calls)

    alt Token already refreshed by another concurrent request
        Plugin->>AuthStore: Get updated AccessToken
    else First promise to enter refresh block
        Plugin->>RefreshUC: invoke()
        RefreshUC->>API: POST /auth/refresh (RefreshToken)

        alt Refresh Succeeded
            API-->>RefreshUC: New AccessToken + RefreshToken
            RefreshUC->>AuthStore: Save new tokens
        else Refresh Failed (Invalid or Expired RefreshToken)
            API-->>RefreshUC: HTTP 400 / 401 Error
            RefreshUC->>AuthStore: Clear tokens
            RefreshUC-->>Plugin: Return InvalidRefreshToken error
            Plugin-->>API: Emit session expired event (Redirect to Login)
        end
    end

    Plugin->>Mutex: Release lock
    Plugin->>API: Retry original request with new Authorization Bearer header
    API-->>Plugin: HTTP 200 OK Response
```

---

## 4. Web-Specific Social Auth Implementations

In the web environment, native components like Android's `CredentialManager` are unavailable.
- **Web (`WebGoogleAuthService`)**: Wraps the standard Google Identity Services script. Displays the One-Tap prompt or standard sign-in pop-up, retrieves the Google ID token (JWT), and forwards it to the backend `LoginByGoogleUseCase`.
- **Disabled Services**: iOS/Android implementations (`AndroidUserAuthServices`) from the KMP counterpart are omitted, and fallback `DisabledGoogleAuthService` is used if configuration is missing.

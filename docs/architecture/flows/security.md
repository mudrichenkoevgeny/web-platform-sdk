# Security & Password Policy / TOTP / Unlock Flows

This document details password policy validation, Time-based One-Time Password (TOTP) MFA lifecycle, and account recovery flows within `web-platform-sdk`.

---

## 1. Backend-Driven Password Policy Validation

The SDK enforces configurable password rules supplied dynamically by the backend via `core-security`:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as React Password Input Component
    participant UC as ValidatePasswordUseCase
    participant Validator as PasswordPolicyValidator
    participant Repo as OpenSecuritySettingsRepository
    participant Storage as EncryptedOpenSecuritySettingsStorage

    UI->>UC: execute({ password: "CandidatePassword123!" })
    UC->>Repo: getOpenSecuritySettings()
    Repo->>Storage: Read cached PasswordPolicy
    Storage-->>Repo: PasswordPolicy(minLength=8, requireLetter=true, requireDigit=true, requireSpecialChar=true)
    Repo-->>UC: PasswordPolicy

    UC->>Validator: validate("CandidatePassword123!", policy)

    alt Policy Passed
        Validator-->>UC: AppResult.Success
        UC-->>UI: Validation Succeeded (Green check)
    else Policy Failed
        Validator-->>UC: AppResult.Failure(SecurityError)
        UC-->>UI: Display specific SecurityError message via AppErrorParser
    end
```

---

## 2. TOTP MFA Lifecycle Flow

Users manage Two-Factor Authentication via `TotpMainScreen` in `feature-user`:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Component as TotpMainScreen
    participant UC as SetupTotpUseCase / EnableTotpUseCase
    participant Repo as UserSecurityRepository
    participant API as FetchOpenUserSecurityApi

    User->>Component: Click "Enable 2FA"
    Component->>UC: SetupTotpUseCase()
    UC->>Repo: setupTotp()
    Repo->>API: POST /user/security/totp/setup
    API-->>Repo: TotpSetupPayload (SecretKey, QrCodeUrl)
    Repo-->>Component: Display QR Code & Manual Secret Key

    User->>Component: Enter 6-digit TOTP code from Authenticator App
    Component->>UC: EnableTotpUseCase(totpCode)
    UC->>Repo: enableTotp(totpCode)
    Repo->>API: POST /user/security/totp/enable
    API-->>Repo: List of Emergency Recovery Codes
    Repo-->>Component: Display Recovery Codes (Prompt user to save)
```

---

## 3. Account Unlock Flow (`SECURITY_HOLD` Recovery)

When an account enters `SECURITY_HOLD` due to failed attempt thresholds or suspicious logins, standard authentication is blocked until the recovery flow is completed:

1. **Detection**: `LoginByEmailUseCase` or `LoginByPhoneUseCase` returns `UserAccountStatus.SECURITY_HOLD`.
2. **Navigation**: Zustand router (`ClientLoginRootStore`) navigates to the `UnlockRootContainer` screen.
3. **Target Selection**: User chooses recovery delivery method (Email OTP or Phone SMS OTP) via `UnlockMethodSelectionScreen`.
4. **Verification**: User enters the OTP code received via chosen delivery method in `UnlockOtpScreen`.
5. **Account Restoration**: Upon successful OTP submission, account status transitions back to `ACTIVE`, issuing a fresh session token pair and redirecting to the main app dashboard.

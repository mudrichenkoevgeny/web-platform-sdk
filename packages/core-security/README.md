# @mudrichenkoevgeny/web-platform-sdk-core-security

Security policy and password validation module for the Web Platform SDK: client-side **password policy evaluation**, **open security settings persistence & caching**, **WebSocket real-time policy sync**, domain **error parsing**, and manual DI wiring via **`SecurityComponent`**.

This module depends strictly on `@mudrichenkoevgeny/web-platform-sdk-core-common` and `@mudrichenkoevgeny/shared-foundation`.

---

## What It Provides

### 1. Wiring & DI
- **`SecurityComponent`:** Root entry point assembling storage, API clients, repository, and use cases. Exposes `openSecuritySettingsRepository` and `validatePasswordUseCase`.

### 2. Password Policy Evaluation & Validation
- **`PasswordPolicyValidator`:** Pure rule engine evaluating passwords against configured security policies (min/max length, uppercase, lowercase, numeric digits, special characters, forbidden patterns).
- **`ValidatePasswordUseCase`:** Domain use case performing client-side password validation against active `OpenSecuritySettings`.

### 3. Persistence & Repository
- **`OpenSecuritySettings`:** Domain model holding client-visible security requirements (password complexity rules, session timeout thresholds, MFA requirements).
- **`OpenSecuritySettingsStorage` / `EncryptedOpenSecuritySettingsStorage`:** WebCrypto AES-GCM encrypted persistence layer caching security policies in browser storage (`localStorage` / `sessionStorage`).
- **`OpenSecuritySettingsRepository` / `OpenSecuritySettingsRepositoryImpl`:** Repository orchestrating remote fetching, encrypted storage fallback, and reactive updates.

### 4. Networking & Real-Time Sync
- **`OpenSecuritySettingsApi` / `FetchOpenSecuritySettingsApi`:** REST API contract and Fetch implementation for retrieving security settings.
- **`SecurityWebSocketMessageHandler`:** Listens for `SecurityWebSocketEventTypes` frames over WebSocket connections to update security configuration live when server policies change.

### 5. Domain Errors & Error Parsing
- **`SecurityError`:** Domain error model representing security violation failures (e.g., password policy violations, MFA requirements).
- **`ClientSecurityErrorCodes`:** Strongly typed error codes for security domain issues.
- **`SecurityErrorParser`:** Specialized error parser integrated into the SDK's Chain of Responsibility error parser pipeline.

### 6. Mocks Infrastructure
- **`SecurityComponentMock`:** Fully configured mock component for UI previews and unit testing, providing mocked storage, repositories, and APIs (`OpenSecuritySettingsMock`, `OpenSecuritySettingsRepositoryMock`, `OpenSecuritySettingsApiMock`).

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `SecurityComponent` manual dependency injection assembly point. |
| `src/domain/` | `OpenSecuritySettings` domain model and `PasswordPolicyValidator`. |
| `src/storage/` | `OpenSecuritySettingsStorage` interface and `EncryptedOpenSecuritySettingsStorage` (AES-GCM). |
| `src/network/` | `OpenSecuritySettingsApi`, `FetchOpenSecuritySettingsApi`, and `SecurityWebSocketMessageHandler`. |
| `src/repository/` | `OpenSecuritySettingsRepository` interface and `OpenSecuritySettingsRepositoryImpl`. |
| `src/usecase/` | `ValidatePasswordUseCase` and `RefreshOpenSecuritySettingsUseCase`. |
| `src/error/` | `SecurityError`, `ClientSecurityErrorCodes`, and `SecurityErrorParser`. |
| `src/locales/` | Typed localization string dictionaries for security domain errors. |
| `src/mock/` | Test doubles (`SecurityComponentMock`, `OpenSecuritySettingsRepositoryMock`, `OpenSecuritySettingsApiMock`). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-security
```

### 2. Initializing SecurityComponent & Registration

Construct `SecurityComponent` by providing core infrastructure dependencies from `CommonComponent`, and register the error parser and WebSocket handler:

```typescript
import { SecurityComponent, SecurityErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const securityComponent = new SecurityComponent({
  webSocketService: commonComponent.webSocketService,
  httpClient: commonComponent.httpClient,
  encryptedSettings: commonComponent.encryptedSettings
})

// Register error parser during CommonComponent init
commonComponent.init({
  appErrorParserSpecificParsers: [SecurityErrorParser]
})

// Register WebSocket message handler
commonComponent.webSocketService.updateWebSocketMessageHandlers([
  securityComponent.securityWebSocketMessageHandler
])
```

### 3. Validating a Password

```typescript
import { ValidatePasswordUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-security'

const validatePassword = new ValidatePasswordUseCase(securityComponent.openSecuritySettingsRepository)

const result = await validatePassword.execute({ password: 'MySecretPassword123!' })

if (result.isSuccess) {
  console.log('Password meets all policy requirements!')
} else {
  console.error('Password validation failed:', result.error)
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

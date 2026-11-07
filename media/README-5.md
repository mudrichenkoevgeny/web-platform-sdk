# @mudrichenkoevgeny/web-platform-sdk-feature-clientuser

End-user (client) identity and authentication solution for the Web Platform SDK: consumer-facing **Fetch HTTP API integrations**, **open auth & user repositories**, **configuration synchronization use cases**, **`ClientUserComponent` DI wiring**, and complete **React login & registration screens**.

This package builds on `@mudrichenkoevgeny/web-platform-sdk-feature-user` to provide end-user (B2C / consumer) web applications with ready-to-use authentication flows and TanStack Router parameter schemas.

---

## What It Provides

### 1. Wiring & DI
- **`ClientUserComponent`:** Central manual DI container coordinating consumer repositories, REST API clients, storage adapters, `AuthHttpClientConfigPlugin`, and use cases.

### 2. Consumer-Facing Network APIs
- **Authentication & Security APIs:** `OpenLoginApi`, `FetchOpenRefreshTokenApi`, `RegistrationApi`, `FetchResetPasswordApi`, `OpenAuthSettingsApi`, `OpenUnlockApi`.
- **User & Session APIs:** `OpenIdentifiersApi`, `FetchOpenSessionApi`, `FetchOpenUserSecurityApi`, `OpenUserApi`.

### 3. Client User Repositories
- Implementations wrapping consumer API endpoints:
  - `OpenLoginRepositoryImpl`, `OpenRefreshTokenRepositoryImpl`, `OpenRegistrationRepositoryImpl`, `OpenResetPasswordRepositoryImpl`, `OpenAuthSettingsRepositoryImpl`, `OpenUnlockRepositoryImpl`.
  - `OpenIdentifierRepositoryImpl`, `OpenSessionRepositoryImpl`, `OpenUserSecurityRepositoryImpl`, `OpenUserRepositoryImpl`.

### 4. Configuration Synchronization Use Cases
- **`RefreshClientUserConfigurationUseCase`:** Orchestrates initialization sync of client user state, active auth providers, and open security policies on startup.
- **`RefreshOpenAuthSettingsUseCase`:** Synchronizes consumer authentication settings and available login providers.

### 5. Client React Login & Registration UI & Search Schemas
- **Consumer Login Screens:** `LoginByPhoneScreen`, `LoginByEmailScreen`, `LoginByTotpScreen` (with `loginByTotpSearchSchema` for TanStack Router).
- **Registration & Recovery:** `RegistrationByEmailScreen`, `ResetEmailPasswordScreen`, `UnlockTargetInputScreen` (with `unlockTargetSearchSchema`), `UnlockOtpScreen` (with `unlockOtpSearchSchema`).
- **Orchestration Container:** `ClientLoginRootScreen` / `ClientLoginRootStore` for modal/step-based login overlays.

### 6. Testing & Mocks Infrastructure
- **`ClientUserComponentMock`:** Complete mock implementations (mock repositories, API clients, and DI container doubles) for isolated testing and Storybook previewing.

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `ClientUserComponent` manual dependency injection assembly point. |
| `src/domain/` | Consumer domain models and `OpenUserConfiguration`. |
| `src/network/` | Consumer REST API clients (`FetchOpenLoginApi`, `FetchRegistrationApi`, `FetchOpenSessionApi`, etc.). |
| `src/repository/` | Open repository implementations (`OpenLoginRepositoryImpl`, `OpenUserRepositoryImpl`, etc.). |
| `src/usecase/` | `RefreshClientUserConfigurationUseCase` and `RefreshOpenAuthSettingsUseCase`. |
| `src/ui/screens/` | React screens (`LoginByPhoneScreen`, `RegistrationByEmailScreen`, etc.) and Zustand stores. |
| `src/mock/` | Test doubles (`ClientUserComponentMock`, mock repositories, mock API clients). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-feature-clientuser
```

### 2. Initializing ClientUserComponent & System Wiring

```typescript
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

const clientUserComponent = new ClientUserComponent({
  commonComponent: commonComponent,
  settingsComponent: settingsComponent,
  securityComponent: securityComponent,
  authStorage: encryptedAuthStorage,
  authServices: webAuthServices
})

// Attach Auth Interceptor
commonComponent.httpClientConfigPlugins.push(clientUserComponent.authHttpClientConfigPlugin)
```

### 3. Rendering Consumer Login Screen in Host Application

```tsx
import { LoginByPhoneScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

export function ConsumerPhoneLoginPage() {
  return <LoginByPhoneScreen dependencies={dependencies} />
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

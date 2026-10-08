# @mudrichenkoevgeny/web-platform-sdk-feature-managementuser

Administrative identity, staff authentication, resource oversight, and system governance solution for the Web Platform SDK: staff **Fetch HTTP API integrations**, **administrative repositories**, **audit logging inspection**, **remote settings override use cases**, **`ManagementUserComponent` DI wiring**, and complete **React Admin Panel screens**.

This package builds on `@mudrichenkoevgeny/web-platform-sdk-feature-user` to provide administrative (back-office / internal staff) applications with full governance over users, sessions, security policies, global application settings, and audit logs.

---

## What It Provides

### 1. Wiring & DI
- **`ManagementUserComponent`:** Main manual DI container coordinating staff authentication, system settings repositories, audit inspection, user governance, and administrative use cases.

### 2. Administrative Network APIs
- **Staff Authentication:** `SelfManagementLoginApi`, `FetchSelfManagementRefreshTokenApi`, `FetchSelfManagementResetPasswordApi`, `ManagementAuthSettingsApi`, `SelfManagementUnlockApi`.
- **System Settings Overrides:** `ManagementGlobalSettingsApi`, `ManagementSecuritySettingsApi`, `ManagementAuthSettingsApi`.
- **User & Resource Governance:** `ManagementUserApi`, `SelfManagementUserApi`, `ManagementSessionApi`, `SelfManagementSessionApi`, `ManagementIdentifierApi`, `ManagementUserSecurityApi`.
- **Audit Inspection:** `ManagementAuditApi` / `FetchManagementAuditApi`.

### 3. Administrative Repositories
- Implementations wrapping management REST API endpoints:
  - `SelfManagementLoginRepositoryImpl`, `SelfManagementRefreshTokenRepositoryImpl`, `ManagementAuthSettingsRepositoryImpl`, `SelfManagementUnlockRepositoryImpl`.
  - `ManagementAuditRepositoryImpl`, `ManagementGlobalSettingsRepositoryImpl`, `ManagementSecuritySettingsRepositoryImpl`.
  - `ManagementUserRepositoryImpl`, `ManagementSessionRepositoryImpl`, `ManagementIdentifierRepositoryImpl`, `ManagementUserSecurityRepositoryImpl`.

### 4. Administrative Domain Use Cases
- **Audit Logs:** `GetAuditEventsUseCase`, `GetAuditEventUseCase` (supports pagination and filtering).
- **System Settings Control:** `SaveRemoteGlobalSettingsUseCase`, `ResetRemoteGlobalSettingsUseCase`, `SaveRemoteSecuritySettingsUseCase`, `ResetRemoteSecuritySettingsUseCase`, `SaveRemoteAuthSettingsUseCase`, `ResetRemoteAuthSettingsUseCase`.
- **User Management:** `GetUsersUseCase`, `GetUserUseCase`, `CreateUserUseCase`, `UpdateUserUseCase`, `DeleteUserUseCase`.
- **Session Oversight:** `ManagementGetSessionsUseCase`, `ManagementDeleteSessionUseCase`, `ManagementDeleteAllUserSessionsUseCase`.
- **Identifier Control:** `ManagementGetIdentifiersUseCase`, `ManagementDeleteIdentifierUseCase`, `ManagementDeleteIdentifierPasswordUseCase`.
- **Security Enforcement:** `ManagementDisableTotpUseCase`.

### 5. Management React Admin Panel UI
- **Staff Authentication:** `ManagementLoginRootScreen` / `ManagementLoginRootStore`.
- **Admin Shell & Navigation:** `ManagementRootScreen`, `ManagementRootStore`, `MainManagementScreen`, `MainManagementStore`.
- **System Settings Editors:** `EditAuthSettingsScreen`, `EditGlobalSettingsScreen`, `EditSecuritySettingsScreen`.
- **Audit Trail Inspection:** `AuditEventListScreen`, `AuditEventDetailScreen`, `AuditItem`.
- **User Governance:** `GlobalUserListScreen`, `UserDetailScreen`, `CreateUserScreen`, `UserItem`.
- **Session & Identifier Oversight:** `GlobalSessionListScreen`, `UserSessionListScreen`, `GlobalIdentifierListScreen`, `UserIdentifierListScreen`.

### 6. Localization & Mocks Infrastructure
- **Typed Dictionaries:** `ManagementUserStrings` with English (`enStrings`) and Russian (`ruStrings`) translations for administrative actions.
- **Testing Mocks:** Complete mock suite (`ManagementUserComponentMock`, mock repositories, API clients) for unit testing and Storybook previewing.

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `ManagementUserComponent` manual dependency injection assembly point. |
| `src/storage/` | Encrypted management settings storage (`ManagementAuthSettingsStorage`, `ManagementGlobalSettingsStorage`, etc.). |
| `src/network/` | Staff REST API clients (`FetchManagementUserApi`, `FetchManagementAuditApi`, `FetchManagementGlobalSettingsApi`, etc.). |
| `src/repository/` | Administrative repositories (`ManagementUserRepositoryImpl`, `ManagementAuditRepositoryImpl`, etc.). |
| `src/usecase/` | Administrative use cases grouped into `audit/`, `user/`, `session/`, `security/`, `global-settings/`, and `auth/`. |
| `src/ui/components/` | Administrative UI components (`AuditItem`, `UserItem`). |
| `src/ui/screens/` | React screens (`ManagementRootScreen`, `GlobalUserListScreen`, `AuditEventListScreen`, `EditGlobalSettingsScreen`, etc.). |
| `src/locales/` | Typed localization dictionaries (`ManagementUserStrings` with `enStrings` and `ruStrings`). |
| `src/mock/` | Test doubles (`ManagementUserComponentMock`, mock repositories, API clients). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-feature-managementuser
```

### 2. Initializing ManagementUserComponent & System Wiring

```typescript
import { ManagementUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

const managementUserComponent = new ManagementUserComponent({
  commonComponent: commonComponent,
  settingsComponent: settingsComponent,
  securityComponent: securityComponent,
  authStorage: encryptedAuthStorage,
  authServices: webAuthServices
})

// Attach Auth Interceptor
commonComponent.httpClientConfigPlugins.push(managementUserComponent.authHttpClientConfigPlugin)
```

### 3. Rendering Admin Panel Root Screen

```tsx
import { ManagementRootScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export function AdminPanel() {
  return <ManagementRootScreen />
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

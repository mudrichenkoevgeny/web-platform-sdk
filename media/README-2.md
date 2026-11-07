# @mudrichenkoevgeny/web-platform-sdk-core-settings

Global application configuration module for the Web Platform SDK: public **global settings management**, **WebCrypto encrypted caching**, **WebSocket real-time settings synchronization**, domain **use cases**, and manual DI wiring via **`SettingsComponent`**.

This module depends strictly on `@mudrichenkoevgeny/web-platform-sdk-core-common` and `@mudrichenkoevgeny/shared-foundation`.

---

## What It Provides

### 1. Wiring & DI
- **`SettingsComponent`:** Root entry point assembling storage, API clients, repository, and settings use cases. Exposes `openGlobalSettingsRepository`, `getOpenGlobalSettingsUseCase`, and `refreshOpenGlobalSettingsUseCase`.

### 2. Open Global Settings Model
- **`OpenGlobalSettings`:** Domain model representing public application properties, feature toggles, maintenance mode statuses, and dynamic platform parameters.

### 3. Persistence & Repository
- **`OpenGlobalSettingsStorage` / `EncryptedOpenGlobalSettingsStorage`:** WebCrypto AES-GCM encrypted caching layer for global settings in browser storage (`localStorage` / `sessionStorage`).
- **`OpenGlobalSettingsRepository` / `OpenGlobalSettingsRepositoryImpl`:** Central repository coordinating network requests, encrypted local storage fallback, and reactive updates.

### 4. Networking & Real-Time Sync
- **`OpenGlobalSettingsApi` / `FetchOpenGlobalSettingsApi`:** Fetch HTTP client contract and implementation fetching public global settings from server REST endpoints.
- **`SettingsWebSocketMessageHandler`:** Handles `SettingsWebSocketEventTypes` frames over WebSocket connections for live settings updates without page reloads.

### 5. Domain Use Cases
- **`GetOpenGlobalSettingsUseCase`:** Retrieves cached or fetched global application settings.
- **`RefreshOpenGlobalSettingsUseCase`:** Forces a network refresh of global settings and updates the local encrypted cache.

### 6. Mocks Infrastructure
- **`SettingsComponentMock`:** Complete mock implementations (`SettingsComponentMock`, `OpenGlobalSettingsRepositoryMock`, `OpenGlobalSettingsApiMock`, `OpenGlobalSettingsMock`) for unit testing and Storybook previews.

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `SettingsComponent` manual dependency injection assembly point. |
| `src/domain/` | `OpenGlobalSettings` domain model and properties. |
| `src/storage/` | `OpenGlobalSettingsStorage` interface and `EncryptedOpenGlobalSettingsStorage` (AES-GCM). |
| `src/network/` | `OpenGlobalSettingsApi`, `FetchOpenGlobalSettingsApi`, and `SettingsWebSocketMessageHandler`. |
| `src/repository/` | `OpenGlobalSettingsRepository` interface and `OpenGlobalSettingsRepositoryImpl`. |
| `src/usecase/` | `GetOpenGlobalSettingsUseCase` and `RefreshOpenGlobalSettingsUseCase`. |
| `src/mock/` | Test doubles (`SettingsComponentMock`, `OpenGlobalSettingsRepositoryMock`, `OpenGlobalSettingsApiMock`). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-settings
```

### 2. Initializing SettingsComponent & Registration

Construct `SettingsComponent` by passing core infrastructure dependencies from `CommonComponent`, and register the WebSocket handler:

```typescript
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const settingsComponent = new SettingsComponent({
  webSocketService: commonComponent.webSocketService,
  httpClient: commonComponent.httpClient,
  encryptedSettings: commonComponent.encryptedSettings
})

// Register WebSocket message handler
commonComponent.webSocketService.updateWebSocketMessageHandlers([
  settingsComponent.settingsWebSocketMessageHandler
])
```

### 3. Fetching Global Settings

```typescript
import { GetOpenGlobalSettingsUseCase } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'

const getGlobalSettings = new GetOpenGlobalSettingsUseCase(settingsComponent.openGlobalSettingsRepository)

const result = await getGlobalSettings.execute()

if (result.isSuccess) {
  console.log('Global Settings:', result.value)
} else {
  console.error('Failed to load global settings:', result.error)
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

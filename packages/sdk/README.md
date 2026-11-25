# @mudrichenkoevgeny/web-platform-sdk

Official Web Platform SDK consolidating core platform infrastructure and identity/auth feature modules for Web applications.

---

## Installation

```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk
```

## Styling

Import the design system tokens in your application entry point:

```typescript
import '@mudrichenkoevgeny/web-platform-sdk/tokens.css'
```

---

## Subpath Entry Points

Import functionality directly from the designated subpath entry points:

- **`@mudrichenkoevgeny/web-platform-sdk/core/common`** ([README](src/core/common/README.md)): Native Fetch HTTP client, WebSocket lifecycle, WebCrypto encrypted storage, Chain of Responsibility error parser, React UI primitives, and design tokens.
- **`@mudrichenkoevgeny/web-platform-sdk/core/security`** ([README](src/core/security/README.md)): Password policy validator, open security settings API, WebCrypto security settings cache, real-time WebSocket policy synchronization.
- **`@mudrichenkoevgeny/web-platform-sdk/core/settings`** ([README](src/core/settings/README.md)): Global application configuration management, Fetch API client, encrypted storage caching, real-time WebSocket settings sync, Zustand settings store.
- **`@mudrichenkoevgeny/web-platform-sdk/core/storage`** ([README](src/core/storage/README.md)): File storage management, presigned S3 upload API client, Direct S3 XMLHttpRequest uploader, storage error parser, Zustand reactive UI components.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/user`** ([README](src/feature/user/README.md)): Headless identity & auth domain foundation: Zod schemas, auth token storage, session auto-refresh, TOTP 2FA, session management, multi-identifier linking.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/client-user`** ([README](src/feature/client-user/README.md)): Consumer web identity solution: multi-method auth (Email, Phone OTP, Google Sign-In), registration, password reset, account unlock, ready-to-use React login screens.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/management-user`** ([README](src/feature/management-user/README.md)): Back-office administrative identity solution: staff authentication, resource oversight, administrative user management, session control, system settings overrides, audit inspection UI.

---

## Quick-Start Wiring Example

```typescript
import { EncryptedSettingsComponent, CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { SecurityComponent, SecurityErrorParser } from '@mudrichenkoevgeny/web-platform-sdk/core/security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk/core/settings'
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk/feature/client-user'
import { UserErrorParser } from '@mudrichenkoevgeny/web-platform-sdk/feature/user'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  clientDeviceInfoProvider: clientDeviceInfoProvider,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})

const securityComponent = new SecurityComponent({
  webSocketService: commonComponent.webSocketService,
  httpClient: commonComponent.httpClient,
  encryptedSettings: commonComponent.encryptedSettings
})

const settingsComponent = new SettingsComponent({
  webSocketService: commonComponent.webSocketService,
  httpClient: commonComponent.httpClient,
  encryptedSettings: commonComponent.encryptedSettings
})

const clientUserComponent = new ClientUserComponent({
  commonComponent,
  settingsComponent,
  securityComponent,
  authStorage: encryptedAuthStorage,
  authServices: webAuthServices
})

// 1. Attach Auth HTTP Interceptor
commonComponent.httpClientConfigPlugins.push(clientUserComponent.authHttpClientConfigPlugin)

// 2. Register Error Parsers
commonComponent.init({
  appErrorParserSpecificParsers: [
    SecurityErrorParser,
    UserErrorParser
  ]
})

// 3. Register WebSocket Message Handlers
commonComponent.webSocketService.updateWebSocketMessageHandlers([
  commonComponent.commonWebSocketMessageHandler,
  settingsComponent.settingsWebSocketMessageHandler,
  securityComponent.securityWebSocketMessageHandler,
  clientUserComponent.userWebSocketMessageHandler
])
```

---

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

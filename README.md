# web-platform-sdk

A modular **TypeScript / React** client SDK for Web applications. It provides a unified foundation for building modern web frontends with shared logic for networking, WebCrypto-encrypted storage, security policies, and identity management. By pairing **React** UI components (Tailwind CSS + shadcn/ui) with **Zustand** state machines, it allows host applications to integrate complex authentication flows, settings, and administration tools with minimal boilerplate.

## Workspace Installation & Usage

Packages in this repository are managed via `pnpm` workspaces.

**For Client Applications:**
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common \
  @mudrichenkoevgeny/web-platform-sdk-core-settings \
  @mudrichenkoevgeny/web-platform-sdk-core-security \
  @mudrichenkoevgeny/web-platform-sdk-feature-user \
  @mudrichenkoevgeny/web-platform-sdk-feature-clientuser
```

**For Management / Admin Applications:**
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common \
  @mudrichenkoevgeny/web-platform-sdk-core-settings \
  @mudrichenkoevgeny/web-platform-sdk-core-security \
  @mudrichenkoevgeny/web-platform-sdk-feature-user \
  @mudrichenkoevgeny/web-platform-sdk-feature-managementuser
```

To include design tokens and component styling, import the base CSS stylesheet into your application root:

```typescript
import '@mudrichenkoevgeny/web-platform-sdk-core-common/tokens.css'
```

## Modules

Managed as a monorepo via `pnpm` workspaces:

- **`core-common`** — Foundation for all packages: native Fetch HTTP client bootstrap, WebSocket lifecycle management, `EncryptedSettings` WebCrypto storage abstraction, Chain of Responsibility error parser, and shared design tokens ([module README](packages/core-common/README.md)).
- **`core-settings`** — Global application configuration management, Fetch API client, encrypted storage caching, and reactive Zustand settings store.
- **`core-security`** — Password policy validation, MFA state management, Fetch API client, encrypted storage, and localized security error parsing.
- **`feature-user`** — Headless identity and auth domain logic: Zod schema models, use cases, auth token storage (`AuthStorage`), session auto-refresh, TOTP 2FA, session management, and identifier linking.
- **`feature-clientuser`** — Identity solution for consumer web applications: multi-method auth (Email, Phone OTP, Google Sign-In), shadcn/ui and Tailwind CSS components, Framer Motion transitions, and Zustand state machine navigation flows.
- **`feature-managementuser`** — Administrative identity solution for internal staff, resource oversight, administrative user management, session control, and audit inspection UI.

## Project Documentation

- **[AGENTS.md](AGENTS.md)** — Entry point for project standards, module boundaries, TypeScript coding style, and architectural rules.

## Design Tokens & Theme Integration

Visual design decisions across the SDK are driven by design tokens and font assets:

1. **Source of Truth**: The single source of truth (SSOT) for all design tokens and font assets is the [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) repository.
2. **Target Paths for Generated Tokens**:
   - `packages/core-common/src/theme/tokens/tokens.css`
   - `packages/core-common/src/theme/tokens/tokens.ts`
3. **Target Path for Font Assets**:
   - `packages/core-common/src/assets/fonts/` (copied from `assets/fonts/woff2/*.woff2` in `platform-design-system`).
4. **Update Rule**: Token files are generated automatically in the design system platform (`generated/web/tokens.css` and `tokens.ts`) and manually copied alongside font files to the SDK target paths above. Direct manual edits to `tokens.css` and `tokens.ts` are strictly forbidden.
5. **Theme Integration**: `ThemeProvider` and `useTheme()` manage theme modes (`light`, `dark`, `system`), controlling the `.dark` DOM class, CSS variables (`var(--color-primary)`, `--spacing-md`, `--radius-sm`), and Tailwind CSS utility presets (`sdkTailwindPreset`).
6. **Font Resources**: `@font-face` declarations in `tokens.css` automatically load custom WOFF2 fonts (`PT Sans`) from `packages/core-common/src/assets/fonts/`.

## Integration Steps

### 1. Storage & Infrastructure

Initialize the `EncryptedSettingsComponent` and root `CommonComponent` using host configuration:

```typescript
import { EncryptedSettingsComponent, CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  deviceInfo: deviceInfo,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})
```

### 2. Feature Components

Construct domain components by sharing the core `HttpClient` and `WebSocketService`:

```typescript
import { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'

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
```

### 3. Client User Identity Setup

Wire the `ClientUserComponent` with its core collaborators and web authentication adapters:

```typescript
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

const clientUserComponent = new ClientUserComponent({
  commonComponent: commonComponent,
  settingsComponent: settingsComponent,
  securityComponent: securityComponent,
  authStorage: encryptedAuthStorage,
  authServices: webAuthServices
})
```

### 4. System Initialization

Register auth interceptor plugins, domain error parsers, and WebSocket message handlers during application bootstrap:

```typescript
import { SecurityErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { UserErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'

function init() {
  commonComponent.httpClientConfigPlugins.push(clientUserComponent.authHttpClientConfigPlugin)

  commonComponent.init({
    appErrorParserSpecificParsers: [
      SecurityErrorParser,
      UserErrorParser
    ]
  })

  commonComponent.webSocketService.updateWebSocketMessageHandlers([
    commonComponent.commonWebSocketMessageHandler,
    settingsComponent.settingsWebSocketMessageHandler,
    securityComponent.securityWebSocketMessageHandler,
    clientUserComponent.userWebSocketMessageHandler
  ])
}
```

### 5. UI Integration

Inject the SDK graph into your React component tree using `SdkProvider` and render entry navigation flows:

```tsx
import { SdkProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginRoot } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

export function App({ clientAppComponent }: { clientAppComponent: ClientAppComponent }) {
  const isInitialized = clientAppComponent.useIsInitialized()

  if (!isInitialized) {
    return <SplashScreen />
  }

  return (
    <SdkProvider value={{ commonComponent: clientAppComponent.commonComponent, clientUserComponent: clientAppComponent.clientUserComponent }}>
      <LoginRoot />
    </SdkProvider>
  )
}
```

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

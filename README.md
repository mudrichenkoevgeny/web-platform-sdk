# Web Platform SDK (`web-platform-sdk`)

A modular **TypeScript / React** client SDK for Web applications. It provides a unified, production-grade foundation for building modern web frontends with shared networking, WebCrypto-encrypted storage, security policies, identity management, and administrative governance.

By pairing **React** UI components (Tailwind CSS + design tokens) with **Zustand** state machines, the SDK allows host applications to integrate complex authentication flows, user settings, profile management, and administrative control panels with minimal boilerplate.

---

## Repository Structure & Modules

Managed as a monorepo via `pnpm` workspaces:

| Module / Package | Description | Readme |
| :--- | :--- | :--- |
| **`core-common`** | Foundation for all SDK packages: native Fetch HTTP client, WebSocket lifecycle management, WebCrypto encrypted storage, Chain of Responsibility error parser, React UI primitives, and design tokens. | [README](packages/core-common/README.md) |
| **`core-security`** | Password policy validator, open security settings API, WebCrypto security settings cache, real-time WebSocket policy synchronization, and security error parser. | [README](packages/core-security/README.md) |
| **`core-settings`** | Global application configuration management, Fetch API client, encrypted storage caching, real-time WebSocket settings sync, and Zustand reactive settings store. | [README](packages/core-settings/README.md) |
| **`feature-user`** | Headless identity and auth domain foundation: Zod schemas, auth token storage (`AuthStorage`), session auto-refresh, TOTP 2FA, session management, multi-identifier linking, and shared React UI screens/components. | [README](packages/feature-user/README.md) |
| **`feature-clientuser`** | Consumer web identity solution: multi-method auth (Email, Phone OTP, Google Sign-In), registration, password reset, account unlock, and ready-to-use React login screens. | [README](packages/feature-clientuser/README.md) |
| **`feature-managementuser`** | Administrative identity and back-office solution: staff authentication, resource oversight, administrative user management, session control, system settings overrides, and audit inspection UI. | [README](packages/feature-managementuser/README.md) |
| **`sample-client-app`** | Reference host application for consumer web frontends demonstrating manual DI wiring (`ClientAppComponent`) and end-user flows. | [README](samples/client-app/README.md) |
| **`sample-management-app`** | Reference host application for back-office admin panels demonstrating manual DI wiring (`ManagementAppComponent`) and administrative governance. | [README](samples/management-app/README.md) |

---

## Workspace Installation & Usage

Packages in this repository are published and installed via `pnpm` workspace references.

### For Client (Consumer) Web Applications:
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common \
  @mudrichenkoevgeny/web-platform-sdk-core-settings \
  @mudrichenkoevgeny/web-platform-sdk-core-security \
  @mudrichenkoevgeny/web-platform-sdk-feature-user \
  @mudrichenkoevgeny/web-platform-sdk-feature-clientuser
```

### For Management / Admin Web Applications:
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common \
  @mudrichenkoevgeny/web-platform-sdk-core-settings \
  @mudrichenkoevgeny/web-platform-sdk-core-security \
  @mudrichenkoevgeny/web-platform-sdk-feature-user \
  @mudrichenkoevgeny/web-platform-sdk-feature-managementuser
```

To include design tokens and component styling, import the stylesheet into your application root:

```typescript
import '@mudrichenkoevgeny/web-platform-sdk-core-common/tokens.css'
```

---

## Development & Build Commands

From the root directory:

```bash
# Build all SDK packages in workspace
pnpm build

# Run local development server for Client sample app (http://localhost:3002)
pnpm dev:client

# Run local development server for Management sample app (http://localhost:3003)
pnpm dev:management

# Run linter across all packages and apps
pnpm lint

# Run type checking across all packages and apps
pnpm typecheck
```

---

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

---

## Integration Guide

### Step 1: Initialize Storage & Common Infrastructure

Construct `EncryptedSettingsComponent` and root `CommonComponent`:

```typescript
import { EncryptedSettingsComponent, CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  deviceInfoProvider: deviceInfoProvider,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})
```

### Step 2: Wire Core Feature Components

Construct domain security and settings components sharing the core `HttpClient` and `WebSocketService`:

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

### Step 3: Wire Client User Identity

Construct `ClientUserComponent` with its core collaborators and authentication adapters:

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

### Step 4: System Initialization & Interceptors

Register auth HTTP interceptors, error parsers, and WebSocket message handlers during app setup:

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

### Step 5: React UI Integration

Inject the SDK dependency graph into your React component tree using `SdkProvider` and render root screens:

```tsx
import { SdkProvider } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ClientLoginRootScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'

export function App({ clientAppComponent }: { clientAppComponent: ClientAppComponent }) {
  const isInitialized = clientAppComponent.useIsInitialized()

  if (!isInitialized) {
    return <SplashScreen />
  }

  return (
    <SdkProvider value={{ commonComponent: clientAppComponent.commonComponent, clientUserComponent: clientAppComponent.clientUserComponent }}>
      <ClientLoginRootScreen />
    </SdkProvider>
  )
}
```

---

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

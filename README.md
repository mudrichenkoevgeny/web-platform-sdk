# Web Platform SDK (`web-platform-sdk`)

A modular **TypeScript / React** client SDK for Web applications. It provides a unified, production-grade foundation for building modern web frontends with shared networking, WebCrypto-encrypted storage, security policies, identity management, and administrative governance.

[![npm](https://img.shields.io/npm/v/@mudrichenkoevgeny/web-platform-sdk)](https://www.npmjs.com/package/@mudrichenkoevgeny/web-platform-sdk)

By pairing **React** UI components (Tailwind CSS + design tokens) with **Zustand** state machines, the SDK allows host applications to integrate complex authentication flows, user settings, user management, and administrative control panels with minimal boilerplate.

---

## Repository Structure & Modules

Managed as a monorepo via `pnpm` workspaces:

| Module / Package | Description | Readme |
| :--- | :--- | :--- |
| **`sdk`** (`@mudrichenkoevgeny/web-platform-sdk`) | Official Web Platform SDK consolidating core infrastructure (`core/common`, `core/security`, `core/settings`, `core/storage`) and feature modules (`feature/user`, `feature/client-user`, `feature/management-user`). | [README](packages/sdk/README.md) |
| **`tools`** (`@mudrichenkoevgeny/web-platform-sdk-tools`) | Official Web Tooling & Code Quality Kit: agent rules syncer, ESLint flat config preset with AST rules, Dependency Cruiser rules, and CLI generators. | [README](packages/tools/README.md) |
| **`sample-client-app`** | Reference host application for consumer web frontends demonstrating manual DI wiring (`ClientAppComponent`) and end-user flows. | [README](samples/client-app/README.md) |
| **`sample-management-app`** | Reference host application for back-office admin panels demonstrating manual DI wiring (`ManagementAppComponent`) and administrative governance. | [README](samples/management-app/README.md) |

### SDK Subpath Entry Points

The `@mudrichenkoevgeny/web-platform-sdk` package exports the following subpath entry points:
- **`@mudrichenkoevgeny/web-platform-sdk/core/common`** ([README](packages/sdk/src/core/common/README.md)): Native Fetch HTTP client, WebSocket lifecycle, WebCrypto encrypted storage, Chain of Responsibility error parser, React UI primitives, and design tokens.
- **`@mudrichenkoevgeny/web-platform-sdk/core/security`** ([README](packages/sdk/src/core/security/README.md)): Password policy validator, open security settings API, WebCrypto security settings cache, real-time WebSocket policy synchronization.
- **`@mudrichenkoevgeny/web-platform-sdk/core/settings`** ([README](packages/sdk/src/core/settings/README.md)): Global application configuration management, Fetch API client, encrypted storage caching, real-time WebSocket settings sync, Zustand settings store.
- **`@mudrichenkoevgeny/web-platform-sdk/core/storage`** ([README](packages/sdk/src/core/storage/README.md)): File storage management solution, presigned S3 upload API client, Direct S3 XMLHttpRequest uploader, storage error parser, Zustand reactive UI components.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/user`** ([README](packages/sdk/src/feature/user/README.md)): Headless identity & auth domain foundation: Zod schemas, auth token storage, session auto-refresh, TOTP 2FA, session management, multi-identifier linking.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/client-user`** ([README](packages/sdk/src/feature/client-user/README.md)): Consumer web identity solution: multi-method auth (Email, Phone OTP, Google Sign-In), registration, password reset, account unlock, ready-to-use React login screens.
- **`@mudrichenkoevgeny/web-platform-sdk/feature/management-user`** ([README](packages/sdk/src/feature/management-user/README.md)): Administrative identity and back-office solution: staff authentication, resource oversight, administrative user management, session control, system settings overrides, audit inspection UI.

---

## Workspace Installation & Usage

Packages in this repository are published to npm under the `@mudrichenkoevgeny` scope and installed via `pnpm`:

### Runtime SDK Package
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk
```

### For Development Tooling & Code Quality Kit
```bash
pnpm add -D @mudrichenkoevgeny/web-platform-sdk-tools
```

To include design tokens and component styling, import the stylesheet into your application root:

```typescript
import '@mudrichenkoevgeny/web-platform-sdk/tokens.css'
```

---

## Development & Build Commands

All development commands are executed from the repository root:

### Build Workspace Packages
Builds all SDK packages (`packages/*`) in the workspace:
```bash
pnpm build
```

### Client Sample App Development Server
Runs local development server for Client sample app at `http://localhost:3002`:
```bash
pnpm dev:client
```

### Management Sample App Development Server
Runs local development server for Management sample app at `http://localhost:3001`:
```bash
pnpm dev:management
```

### Run Tests
Executes unit and UI tests across all workspace packages:
```bash
pnpm test
```

### Code Linting
Runs ESLint across all workspace packages and sample applications:
```bash
pnpm lint
```

### Module Boundaries Check
Runs Dependency Cruiser to verify architectural boundaries between core and feature modules:
```bash
pnpm lint:deps
```

### Type Checking
Runs TypeScript type checking (`tsc --noEmit`) across all workspace packages and apps:
```bash
pnpm typecheck
```

### API Contract Verification
Runs API Extractor to generate and verify public API signature snapshots:
```bash
pnpm api:extract-ci
```

### Bundle Size Budget Verification
Monitors brotli/gzip bundle sizes for all published workspace packages:
```bash
pnpm size
```

---

## Documentation & Architecture

- **[ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)** — Architectural diagrams in Mermaid covering module dependencies, composition roots, error parsing pipelines, and WebSocket synchronization.
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Development setup, local testing workflows, isolated Vitest runner strategy, and npm publishing guidelines.
- **[AGENTS.md](AGENTS.md)** — Project coding standards, TypeScript strictness rules, design token boundaries, and agent guidelines.

---

## Related Projects

Check out related platform projects in the ecosystem:

* **[shared-foundation](https://github.com/mudrichenkoevgeny/shared-foundation)** — Kotlin Multiplatform & TypeScript contract library providing Zod schemas, routes, and branded types.
* **[backend-platform-sdk](https://github.com/mudrichenkoevgeny/backend-platform-sdk)** — Server-side platform infrastructure library.
* **[kmp-platform-sdk](https://github.com/mudrichenkoevgeny/kmp-platform-sdk)** — Kotlin Multiplatform client SDK for Mobile and Desktop.
* **[platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system)** — Design tokens SSOT and font assets for Web & Mobile frontends.

---

## Design Tokens & Theme Integration

Visual design decisions across the SDK are driven by design tokens and font assets exported directly by `@mudrichenkoevgeny/shared-foundation`:

1. **Tokens & Fonts Source**: All design tokens, CSS variables, and font assets are published and exported directly by `@mudrichenkoevgeny/shared-foundation` (`@mudrichenkoevgeny/shared-foundation/tokens.css`, `@mudrichenkoevgeny/shared-foundation/tokens`, `@mudrichenkoevgeny/shared-foundation/fonts/*`).
2. **Theme Integration**: `ThemeProvider` and `useTheme()` manage theme modes (`light`, `dark`, `system`), controlling the `.dark` DOM class, CSS variables (`var(--color-primary)`, `--spacing-md`, `--radius-sm`), and Tailwind CSS utility presets (`sdkTailwindPreset`).
3. **Font Resources**: `@font-face` declarations in `tokens.css` automatically load custom WOFF2 fonts (`PT Sans`) directly from `@mudrichenkoevgeny/shared-foundation/fonts/`.

---

## Integration Guide

### Step 1: Initialize Storage & Common Infrastructure

Construct `EncryptedSettingsComponent` and root `CommonComponent`:

```typescript
import { EncryptedSettingsComponent, CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk/core/common'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  clientDeviceInfoProvider: clientDeviceInfoProvider,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})
```

### Step 2: Wire Core Feature Components

Construct domain security and settings components sharing the core `HttpClient` and `WebSocketService`:

```typescript
import { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk/core/security'
import { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk/core/settings'

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
import { ClientUserComponent } from '@mudrichenkoevgeny/web-platform-sdk/feature/client-user'

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
import { SecurityErrorParser } from '@mudrichenkoevgeny/web-platform-sdk/core/security'
import { UserErrorParser } from '@mudrichenkoevgeny/web-platform-sdk/feature/user'

function init() {
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
}
```

### Step 5: React UI Integration

Inject the SDK dependency graph into your React component tree using `SdkProvider` and render root screens:

```tsx
import { SdkProvider } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { ClientLoginRootScreen } from '@mudrichenkoevgeny/web-platform-sdk/feature/client-user'

export function App({ clientAppComponent }: { clientAppComponent: ClientAppComponent }) {
  const isInitialized = clientAppComponent.useIsInitialized()

  if (!isInitialized) {
    return <SplashScreen />
  }

  return (
    <SdkProvider component={clientAppComponent.commonComponent}>
      <ClientLoginRootScreen />
    </SdkProvider>
  )
}
```

---

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

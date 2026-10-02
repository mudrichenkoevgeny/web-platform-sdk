# @mudrichenkoevgeny/web-platform-sdk-core-common

Base for all Web SDK modules: shared native **Fetch HTTP client** bootstrap, **WebSocket** infrastructure with lifecycle management, **WebCrypto encrypted settings** storage abstraction, **browser/platform** metadata providers, **Chain of Responsibility error modeling and parsing**, and common **React** UI building blocks. This module serves as the foundation for the Web Platform SDK and does not depend on other in-repo `core/*` or `feature/*` modules.

## What it provides

### 1. Wiring & DI
- **`CommonComponent`:** The root assembly point for common infrastructure. Manages the lifecycle of networking, storage, and platform modules.
- **`EncryptedSettingsComponent`:** Decouples the core from browser storage mechanisms (`localStorage` / `sessionStorage`) using WebCrypto AES-GCM encryption.
- **React Context:** `SdkProvider` and `useSdkContext` for injecting the SDK graph and error handling into the React component tree.

### 2. Networking
- **HTTP Client:** Centralized `HttpClient` wrapping native `fetch` API with support for `HttpClientConfigPlugin` extensions and `AccessTokenProvider` integration.
- **WebSockets:** `WebSocketService` manages connection lifecycles, pings, and automatic restarts when the access token changes.
- **Message Handling:** `WebSocketMessageHandler` interface with `CommonWebSocketMessageHandler` for framework-level events (ping/pong, initialization). Uses `WebSocketMessageHandlerResult` to route frames.

### 3. Error Handling & Result
- **Result Pattern:** `AppResult<T, E>` discriminated union (`Success` or `Error`) used as the standard return type for operations to ensure consistent error propagation.
- **Model:** `AppError` interface and `CommonError` class. Includes `ErrorId` (a branded type wrapping UUID) for stable tracking across layers.
- **Parsing:** `AppErrorParser` uses a **Chain of Responsibility** pattern. `AppErrorParserBuilder` allows registering feature-specific parsers that take priority over `CommonErrorParser`.
- **Localization:** Integrated string dictionary resolution during error transformation.

### 4. Storage
- **`EncryptedSettings`:** Platform-agnostic interface for key-value storage. Backed by browser `localStorage` or `sessionStorage` and encrypted via WebCrypto API (AES-GCM).

### 5. Platform Abstractions
- **`ExternalLauncher`:** Unified API for opening URLs and `mailto:` links via browser APIs (`window.open`, `location.href`).
- **`DeviceInfoProvider`:** Collects browser metadata (User Agent, screen resolution, OS/browser version) into `ClientDeviceInfo`.
- **`PlatformRepository`:** Provides SDK layers with access to immutable device and platform information.

### 6. UI & Theme
- **Components:** `FullscreenLoading` (with configurable delay) and `FullscreenError`.
- **Theme:** Shared design tokens (`tokens.css` / `tokens.ts`) for consistent web UI styling.

### 7. Listing & Pagination
- **Infrastructure:** `PaginationState` and `ListingConstants` provide a standardized way to handle paginated data from `PagedResult`.
- **UI Components:** `PagingFooter` for loading/error states at the end of scrollable lists.

### 8. Testing & Mocks Infrastructure
- **Vitest & React Testing Library:** Unit tests (`*.test.ts`) and UI component tests (`*.test.tsx`).
- **Test Factories & In-Memory Fakes:** Factory functions (`createMockCommonComponent()`, `createInMemoryEncryptedSettings()`) in `src/testing/` to instantiate deterministic fakes without hardcoding large objects in test blocks.
- **Storybook Context Mocks:** Mock `<SdkProvider>` decorators and fake Zustand state machines for isolated UI component previews (`*.stories.tsx`).

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common
```

### 2. Initialization
In your root application setup, initialize `CommonComponent` and call its `init` method to register feature-specific parsers and WebSocket handlers:

```typescript
import {
  EncryptedSettingsComponent,
  CommonComponent,
  ClientDeviceInfo
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  deviceInfo: deviceInfo,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})

function init() {
  commonComponent.init({
    appErrorParserSpecificParsers: [SecurityErrorParser, UserErrorParser]
  })

  commonComponent.webSocketService.updateWebSocketMessageHandlers([
    commonComponent.commonWebSocketMessageHandler
  ])
}
```

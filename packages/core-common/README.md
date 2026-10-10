# @mudrichenkoevgeny/web-platform-sdk-core-common

Base foundation for all Web Platform SDK modules: shared **Fetch HTTP client** bootstrap, **WebSocket** infrastructure with lifecycle management, **WebCrypto encrypted settings** storage abstraction, **browser & platform** metadata providers, **Chain of Responsibility error modeling and parsing**, localized string dictionaries, and a complete suite of **React** UI components with Tailwind CSS styling, design tokens, and Storybook support.

This module serves as the foundational core for the Web Platform SDK and has zero dependencies on other `core/*` or `feature/*` modules in the repository.

---

## What It Provides

### 1. Wiring & React Context (DI)
- **`CommonComponent`:** Root assembly point for core infrastructure. Manages the lifecycle of networking, storage, platform abstractions, and error parsing.
- **`EncryptedSettingsComponent`:** Decouples core logic from browser storage using native WebCrypto API (AES-GCM encryption with `WebCryptoSettings`).
- **`SdkProvider`:** React Context provider exposing `CommonComponent` and `AppErrorParser` to the UI tree via `useSdkStore()`, `useCommonComponent()`, and `useAppErrorParser()`.

### 2. Networking (Fetch & WebSockets)
- **`HttpClient`:** Pre-configured HTTP client wrapping native `fetch`, supporting `HttpClientConfigPlugin` interceptors, `AccessTokenProvider` auth injection, and `callResult` helper for converting network responses to `AppResult`.
- **`WebWebSocketService`:** Manages WebSocket connection lifecycles, automatic reconnection backoff, ping/pong heartbeats, and token refresh updates.
- **`CommonWebSocketMessageHandler`:** Processes framework-level WebSocket frame types (e.g., ping/pong, connection initialization).

### 3. Error Handling & Result Pattern
- **Result Pattern:** `AppResult<T, E>` discriminated union (`Success` or `Failure`) for type-safe operation returns without throwing runtime errors.
- **Error Model:** `AppError` interface, `CommonError` class, `ServerError`, `ApiException`, and `ErrorId` (UUID wrapper).
- **Chain of Responsibility Parsing:** `AppErrorParser` base, `CommonErrorParser` fallback, and `AppErrorParserBuilder` for chaining domain-specific parsers (`SecurityErrorParser`, `UserErrorParser`).
- **Logging:** `AppErrorLogger` wrapping browser console methods for structured diagnostic logging.

### 4. Encrypted WebCrypto Storage
- **`EncryptedSettings`:** Interface for key-value persistence.
- **`WebCryptoSettings`:** AES-GCM encrypted wrapper over browser `localStorage` or `sessionStorage`.
- **`CommonStorage` / `EncryptedCommonStorage`:** Typed storage wrappers for device ID, language preferences, and common SDK keys.

### 5. Platform & Device Metadata
- **`ClientDeviceInfoProvider`:** Collects browser metadata (User Agent, screen dimensions, OS/Browser versions) into `ClientDeviceInfo`.
- **`ExternalLauncher`:** Safe abstraction for opening URLs and `mailto:` links via `window.open`.
- **`PlatformRepository`:** Immutable access to platform information and device metrics.

### 6. UI Components & Design System
- **Theme & Tokens:** `ThemeProvider` and `useTheme()` for Light/Dark/System mode switching, integrated with `tokens.css` / `tokens.ts` and `tailwind-preset.ts`.
- **Icon Infrastructure:** `CoreIcon` rendering SVGR React components (`*.svg?react`) with `currentColor` styling and raster fallback.
- **Buttons & Inputs:** `CoreButton` (with loading spinner), `CoreOutlinedTextField`, `CoreCodeTextField`, `CoreEmailTextField`, `CorePasswordTextField` (with visibility toggle).
- **Layout & Feedback:** `CoreScrollableScreenContent`, `FullscreenError`, `FullscreenLoading` (with delay timer), `FullscreenOverlayLoading` (with backdrop blur).

### 7. Listing, Filtering & Pagination
- **Listing Infrastructure:** `PaginationState` and `ListingConstants` providing a standardized way to handle paginated data from `PagedResult`.
- **UI & Infinite Scroll:** `ListingEmptyState`, `ListingHeaderBar`, `PagingFooter`, `ListingChoiceDropdown`, `useInfiniteScroll` hook utilizing browser `IntersectionObserver`.

### 8. Testing & Mocks Infrastructure
- **Test Harness:** `ComponentTestHarness` for Vitest and React Testing Library unit testing; Storybook decorators in `storybookDecorators.tsx`.
- **Mocks:** In-memory doubles (`AppErrorParserMock`, `EncryptedSettingsMock`, `AccessTokenProviderMock`, `WebSocketServiceMock`).

---

## Package Map

| Directory | Role |
| :--- | :--- |
| `src/di/` | `CommonComponent` and `EncryptedSettingsComponent` assembly points. |
| `src/context/` | `SdkProvider` React context and hooks (`useSdkStore`, `useCommonComponent`). |
| `src/network/` | Native `fetch` HTTP client, `HttpClientConfigPlugin`, `WebWebSocketService`, and message handlers. |
| `src/result/` | Discriminated union `AppResult` (`Success` / `Failure`) and functional monadic helpers. |
| `src/error/` | `AppError` models, `CommonErrorParser`, `AppErrorParserBuilder`, and `AppErrorLogger`. |
| `src/storage/` | `EncryptedSettings` interface, `WebCryptoSettings` (AES-GCM), and `CommonStorage`. |
| `src/platform/` | `ClientDeviceInfoProvider`, `ExternalLauncher`, and `PlatformRepository`. |
| `src/theme/` | `ThemeProvider`, design tokens (`tokens.css`, `tokens.ts`), and Tailwind preset. |
| `src/ui/` | Core React UI components (`CoreButton`, `CoreOutlinedTextField`, `FullscreenLoading`, etc.). |
| `src/listing/` | `PaginationState`, `ListingConstants`, `PagingFooter`, and `useInfiniteScroll`. |
| `src/locales/` | Typed localization dictionaries (`CoreCommonStrings` with `enStrings` and `ruStrings`). |
| `src/time/` | Date/time formatters (`DateTimeFormatter`) and resend countdown timers (`ResendCountdown`). |
| `src/testing/` | `ComponentTestHarness` and Storybook decorators. |
| `src/mock/` | Test doubles (`EncryptedSettingsMock`, `WebSocketServiceMock`, `AccessTokenProviderMock`). |

---

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common
```

### 2. Initializing CommonComponent & SdkProvider

```typescript
import React from 'react'
import {
  EncryptedSettingsComponent,
  CommonComponent,
  SdkProvider,
  ThemeProvider
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const encryptedSettingsComponent = new EncryptedSettingsComponent()

const commonComponent = new CommonComponent({
  encryptedSettings: encryptedSettingsComponent.encryptedSettings,
  clientDeviceInfoProvider: clientDeviceInfoProvider,
  baseUrl: 'https://api.example.com',
  accessTokenProvider: authStorage
})

export const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <SdkProvider commonComponent={commonComponent}>
        {children}
      </SdkProvider>
    </ThemeProvider>
  )
}
```

### 3. Handling Results & Functional Folding

```typescript
import { AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const result: AppResult<UserData, AppError> = await repository.getUser()

if (result.isSuccess) {
  console.log('User profile loaded:', result.value)
} else {
  console.error('Failed to load user:', result.error)
}
```

### 4. Rendering UI Components

```tsx
import React from 'react'
import {
  CoreButton,
  CoreOutlinedTextField,
  CorePasswordTextField,
  enStrings
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export const LoginForm = () => {
  const [password, setPassword] = React.useState('')
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <form className="flex flex-col gap-4">
      <CoreOutlinedTextField label="Email" placeholder="user@example.com" />
      <CorePasswordTextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isPasswordVisible={isVisible}
        onTogglePasswordVisibility={() => setIsVisible(!isVisible)}
      />
      <CoreButton label="Sign In" type="submit" />
    </form>
  )
}
```

---

## Source Code & Repository

The source code for this library is maintained in the main GitHub repository:
**[GitHub Repository: mudrichenkoevgeny/web-platform-sdk](https://github.com/mudrichenkoevgeny/web-platform-sdk)**

## License

Licensed under the Apache License 2.0. See [LICENSE](https://github.com/mudrichenkoevgeny/web-platform-sdk/blob/main/LICENSE) for details.

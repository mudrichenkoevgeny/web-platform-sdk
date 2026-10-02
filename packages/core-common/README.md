# @mudrichenkoevgeny/web-platform-sdk-core-common

Base foundation for all Web Platform SDK modules: shared **Fetch HTTP client** bootstrap, **WebSocket** infrastructure with lifecycle management, **WebCrypto encrypted settings** storage abstraction, **browser/platform** metadata providers, **Chain of Responsibility error modeling and parsing**, localized string dictionaries, and a complete suite of **React** UI components with Tailwind CSS styling and Storybook support.

This module serves as the foundational core for the Web Platform SDK and has zero dependencies on other `core/*` or `feature/*` modules in the repository.

## Key Capabilities

### 1. Wiring & React Context (DI)
- **`CommonComponent`:** The root assembly point for core infrastructure. Wiring `HttpClient`, `CommonStorage`, `WebWebSocketService`, and `PlatformRepository`.
- **`EncryptedSettingsComponent`:** Decouples core logic from browser storage using native WebCrypto API (AES-GCM encryption).
- **`SdkProvider`:** React Context provider injecting `CommonComponent` and `AppErrorParser` into the React component tree via `useSdkStore()`, `useCommonComponent()`, and `useAppErrorParser()`.

### 2. Networking (Fetch & WebSockets)
- **HTTP Client:** `HttpClient` wrapping the browser native `fetch` API, supporting `HttpClientConfigPlugin` interceptors, `AccessTokenProvider` auth injection, and `callResult` helper for converting network responses to `AppResult`.
- **WebSockets:** `WebWebSocketService` handling connection lifecycles, automatic reconnection, ping/pong heartbeats, and token refresh updates.
- **Message Routing:** `WebSocketMessageHandler` interface and `CommonWebSocketMessageHandler` for processing framework-level frame types.

### 3. Error Handling & Result Pattern
- **Result Pattern:** `AppResult<T, E>` discriminated union (`Success` or `Failure`) for type-safe operation returns.
- **Error Hierarchy:** `AppError` interface, `CommonError` class, `ServerError`, `ApiException`, and branded `ErrorId` (UUID wrapper).
- **Chain of Responsibility Parsing:** `AppErrorParser` base, `CommonErrorParser` fallback, and `AppErrorParserBuilder` for chaining domain-specific parsers.
- **Logging:** `AppErrorLogger` wrapping browser console methods.

### 4. Encrypted WebCrypto Storage
- **`EncryptedSettings`:** Interface for key-value persistence.
- **`WebCryptoSettings`:** AES-GCM encrypted wrapper over browser `localStorage` or `sessionStorage`.
- **`CommonStorage` / `EncryptedCommonStorage`:** Typed storage wrappers for device ID, language preferences, and common SDK keys.

### 5. Platform & Device Metadata
- **`DeviceInfoProvider`:** Collects browser metadata (User Agent, screen dimensions, OS/Browser versions) into `ClientDeviceInfo`.
- **`ExternalLauncher`:** Safe abstraction for opening URLs and `mailto:` links via `window.open`.
- **`PlatformRepository`:** Immutable access to platform information and device metrics.

### 6. UI Components & Theme
- **Theme & Tokens:** `ThemeProvider` and `useTheme()` for Light/Dark/System mode switching, integrated with `tokens.css` / `tokens.ts` and `tailwind-preset.ts`.
- **Icon Infrastructure:** `CoreIcon` rendering SVGR React components (`*.svg?react`) with `currentColor` styling and raster image fallback.
- **Buttons:** `CoreButton` (with loading spinner), `CoreTextButton`, `CoreBackButton`.
- **Inputs:** `CoreOutlinedTextField`, `CoreCodeTextField`, `CoreEmailTextField`, `CorePasswordTextField` (with visibility toggle).
- **Typography:** `CoreScreenTitleText`, `CoreTitleText`, `CoreBodyText`, `CoreSmallText`, `CoreErrorText`.
- **Containers & Layout:** `CoreScrollableScreenContent`, `FullscreenError`, `FullscreenLoading` (with delay timer), `FullscreenOverlayLoading` (with backdrop blur).
- **Scrollbar:** `CoreVerticalScrollbar` and `CoreLazyColumnScrollbar` (styled natively via CSS).

### 7. Listing, Filtering & Pagination
- **Pagination Models:** `PaginationState` and `ListingConstants` for handling `PagedResult` data.
- **Listing UI Components:** `ListingEmptyState`, `ListingHeaderBar`, `PagingFooter`, `ListingChoiceDropdown`, `ListingOptionsPanel`.
- **Infinite Scroll:** `useInfiniteScroll` hook utilizing browser `IntersectionObserver` to eliminate scroll event overhead and layout thrashing.

### 8. Localization
- **Dictionaries:** Typed string dictionaries (`CoreCommonStrings`) with full `enStrings` (English) and `ruStrings` (Russian) dictionaries for error messages and UI labels.

### 9. Testing & Mocks Infrastructure
- **Harness & Decorators:** `ComponentTestHarness` for Vitest and React Testing Library unit testing; Storybook decorators in `storybookDecorators.tsx`.
- **In-Memory Mocks:** `AppErrorParserMock`, `EncryptedSettingsMock`, `AccessTokenProviderMock`, `WebSocketServiceMock`.

## Usage

### 1. Installation
```bash
pnpm add @mudrichenkoevgeny/web-platform-sdk-core-common
```

### 2. Initializing CommonComponent & SdkProvider
In your root application setup, initialize `CommonComponent` and wrap your React application with `SdkProvider`:

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
  deviceInfoProvider: deviceInfoProvider,
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

### 3. Using UI Components
```typescript
import {
  CoreButton,
  CoreOutlinedTextField,
  CorePasswordTextField
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

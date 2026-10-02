# todo delete later
# Core Common — Implementation Plan

This document outlines the step-by-step implementation plan for the `core-common` module in the Web Platform SDK. It maps the architectural concepts from the Kotlin Multiplatform (KMP) project to the modern Web ecosystem (TypeScript, React, WebCrypto, native Fetch).

## 🧠 Context & Notes for AI (Read Before Coding)

**Tech Stack Mapping (KMP -> Web):**
*   **Ktor HTTP Client** -> Native browser `fetch` wrapped in a custom `HttpClient` class.
*   **DataStore + Tink** -> Browser `localStorage` / `sessionStorage` encrypted using the native `WebCrypto API` (AES-GCM).
*   **Kotlinx.serialization** -> `Zod` (from `@mudrichenkoevgeny/shared-foundation`).
*   **Coroutines / Flow** -> `Promise`, `async/await`, and standard Event Listeners / Callbacks.
*   **Compose UI** -> React (`.tsx`) + Tailwind CSS + `shadcn/ui`.
*   **Kermit Logging** -> Custom `AppErrorLogger` wrapping `console.error` / `console.warn`.
*   **DI (Manual)** -> Pure TypeScript classes for instances (`CommonComponent`), injected into UI via React Context (`SdkProvider`).

**Strict Standards Compliance:**
*   **Always request and review the original Kotlin Multiplatform (KMP) analogue files before implementing any phase.**
*   No FQN (Fully Qualified Names) in inline code.
*   No comments in source code (self-documenting only).
*   Use `AppResult<T, E>` for all business logic returns.
*   Branded types (`UserId`, `ErrorId`) must use `toXxxIdOrThrow()` conversions.
*   Every `.tsx` component must have a `.test.tsx` and `.stories.tsx`.

---

## 🏗️ Implementation Phases

### Phase 1: Theme & Design Tokens (✅ Completed)
- [x] Configure Tailwind CSS preset (`tailwind-preset.ts`).
- [x] Integrate generated `tokens.css` and `tokens.ts`.
- [x] Set up local `.woff2` font assets (`PT Sans`).
- [x] Create `ThemeContext.tsx` (`ThemeProvider`, `useTheme`) for Light/Dark/System switching.
- [x] Write Unit/UI tests for Theme context.

### Phase 2: Result Pattern & Error Modeling (CoR) (✅ Completed)
- [x] Implement `AppResult<T, E>` (Success/Failure discriminated union).
- [x] Implement `AppError` interface and `CommonError` class.
- [x] Implement `AppErrorLogger` (structured console logging).
- [x] Implement `AppErrorParser` (Chain of Responsibility base).
- [x] Implement `CommonErrorParser` (fallback parser resolving strings).
- [x] Create testing mocks (`AppErrorParserMock`).

### Phase 3: WebCrypto Storage (✅ Completed)
- [x] Implement `EncryptedSettings` interface.
- [x] Implement `WebCryptoSettings` (AES-GCM encryption wrapper over `localStorage`/`sessionStorage`).
- [x] Implement `CommonStorage` / `EncryptedCommonStorage` (typed keys for device ID, language, etc.).
- [x] Create testing mocks (`createInMemoryEncryptedSettings`).

### Phase 4: Platform & Device Context (✅ Completed)
- [x] Implement `DeviceInfoProvider` (parsing `navigator.userAgent`, screen size, language).
- [x] Implement `ExternalLauncher` (`window.open(url, '_blank')`, `mailto:`).
- [x] Implement `PlatformRepository` (immutable access to device info).

### Phase 5: Networking (Fetch & WebSockets) (✅ Completed)
- [x] Implement `HttpClient` (wrapper around `fetch`).
- [x] Implement `HttpClientConfigPlugin` interface (interceptors for Auth/Headers).
- [x] Implement `AccessTokenProvider` interface.
- [x] Implement `WebSocketService` (connection lifecycle, reconnects, ping/pong).
- [x] Implement `WebSocketMessageHandler` & `CommonWebSocketMessageHandler`.
- [x] Create testing mocks (`WebSocketServiceMock`, `AccessTokenProviderMock`).

### Phase 6: Core DI Component & React Context (✅ Completed)
- [x] Implement `EncryptedSettingsComponent`.
- [x] Implement `CommonComponent` (wiring HttpClient, Storage, WebSockets, PlatformRepository).
- [x] Implement `SdkProvider.tsx` and `useSdkStore()` / `useCommonComponent()` (React Context for injecting `CommonComponent` and `AppErrorParser`).

### Phase 7: UI Infrastructure & Listing (✅ Completed)
- [x] Implement `PaginationState` and `ListingConstants`.
- [x] Implement base UI components (using Tailwind/shadcn):
  - [x] `FullscreenLoading`
  - [x] `FullscreenError`
  - [x] `CoreButton` / `CoreTextButton`
  - [x] `CoreOutlinedTextField` / `CorePasswordTextField`
  - [x] `PagingFooter`
- [x] Write `.test.tsx` (React Testing Library) and `.stories.tsx` (Storybook) for ALL components.

### Phase 8: Final Review & Export (✅ Completed)
- [x] Ensure all public APIs are exported via `src/index.ts`.
- [x] Validate `tsc --noEmit` and `vite build` complete successfully.

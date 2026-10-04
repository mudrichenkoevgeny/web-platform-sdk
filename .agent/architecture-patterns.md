---
description: Architecture, component wiring, bootstrap, and state management patterns
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# Architecture and Design Patterns

## 1. Modular Hierarchy & Component Model (React + Zustand)
- **UI Layer (React):** Stateless functional components that consume state via custom hooks (`useSdkStore()`).
- **Component Layer (Zustand):** Replaces Decompose. State machines that own the business logic and flow transitions (e.g., `createLoginStore()`).
- **Use Case / Service Layer:** Pure TypeScript classes or functions for atomic business operations.
- **Repository Layer:** Orchestrates data flow between Fetch APIs and `EncryptedSettings`.

## 2. SDK Bootstrap & Host Wiring
- **Initialization Sequence:** The host app (in `samples/`) wires the graph manually:
  1. Instantiate `CommonComponent` (passing `baseUrl`).
  2. Initialize feature components (`ClientUserComponent`).
  3. Call `commonComponent.init(errorParsers)`.
- **Context Injection:** Pass the initialized instances into the React tree via `<SdkProvider value={{ commonComponent, clientUserComponent }}>`.

## 3. Networking (Fetch API)
- **HttpClient:** Centralized in `core-common` wrapping the native `fetch` API. Do not use Axios.
- **Interceptors:** Implement `HttpClientConfigPlugin` for modifying headers (auth tokens) and handling 401 retries.

## 4. Error Modeling (Chain of Responsibility)
- **AppError:** Extend this base class (with `code` and `isRetryable`).
- **AppErrorParser:** Implement parsers for specific modules (`UserErrorParser`, `SecurityErrorParser`). The root parser falls back to `CommonErrorParser` if a code is unrecognized.

## 5. Persistence
- **EncryptedSettings:** Interface in `core-common`. Implementation must wrap `window.localStorage` (or `sessionStorage`) using the Web Crypto API for encryption. Do not expose raw tokens.

## 6. Screen State Machines (Isolated Per-Instance Zustand Stores)
- **Isolated Instances Mandate:** Screen-level and component-level stores must NOT be global singletons (`create()`). Because the SDK can be mounted in multiple widgets or routes simultaneously on a single host page, global singletons would leak form inputs and UI state across instances.
- **Zustand + React Context Pattern:** Screen stores must be instantiated per component mount using `createStore()` (vanilla Zustand), wrapped in a React Context Provider (via `useRef` to maintain store identity across re-renders), and consumed via `useStore(context, selector)`.
- **Lifecycle Alignment:** This guarantees every mounted screen receives its own isolated state machine that is garbage-collected on unmount, perfectly matching Decompose's `ComponentContext` / ViewModel lifecycle.

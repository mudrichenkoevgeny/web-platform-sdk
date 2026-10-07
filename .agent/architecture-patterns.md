---
description: Architecture, component wiring, bootstrap, state management, and data layering patterns
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

## 3. Networking & Data Layering (Fetch API & Zod Schemas)
- **HttpClient:** Centralized in `core-common` wrapping the native `fetch` API. Do not use Axios.
- **Interceptors:** Implement `HttpClientConfigPlugin` for modifying headers (auth tokens) and handling 401 retries.
- **Data Layering & Network DTO Mapping:** All API payload mapping (including `snake_case` to `camelCase` conversion) must happen strictly at the Network layer using Zod schemas (`auditEventPayloadSchema`, `pagedResultSchema`). The UI/Store layer must only consume strictly typed domain models (e.g., a fully parsed `PagedResult`). Never map DTOs inside Repositories or UI stores.

## 4. Error Modeling (Chain of Responsibility & POJO Errors)
- **AppError:** Extend this base class (with `code` and `isRetryable`).
- **AppErrorParser:** Implement parsers for specific modules (`UserErrorParser`, `SecurityErrorParser`). The root parser falls back to `CommonErrorParser` if a code is unrecognized.
- **Strict Prohibition on Thrown Exceptions:** Never use `throw new Error()` inside Repositories, Use Cases, or Adapters. Always return Discriminated Unions/POJO errors wrapped in `appResultFailure(CommonError.xxx)`.

## 5. Persistence
- **EncryptedSettings:** Interface in `core-common`. Implementation must wrap `window.localStorage` (or `sessionStorage`) using the Web Crypto API for encryption. Do not expose raw tokens.

## 6. Screen State Machines (Isolated Per-Instance Zustand Stores) & Pagination State
- **Isolated Instances Mandate:** Screen-level and component-level stores must NOT be global singletons (`create()`). Because the SDK can be mounted in multiple widgets or routes simultaneously on a single host page, global singletons would leak form inputs and UI state across instances.
- **Zustand + React Context Pattern:** Screen stores must be instantiated per component mount using `createStore()` (vanilla Zustand), wrapped in a React Context Provider, and consumed via `useStore(context, selector)`.
- **Lazy Store Initialization in Provider (CRITICAL):**
  - **NEVER** use `useRef` for lazy initialization of Zustand stores in Context Providers (`if (!ref.current) ref.current = ...`). This is a React anti-pattern that breaks in Strict Mode and Concurrent rendering.
  - **ALWAYS** use `useState` with a lazy initializer function:
    `const [store] = useState(() => createMyStore(dependencies, initialState))`
- **Side-Effects & Data Fetching Mandate:**
  - **NEVER** trigger API calls, data fetching, or side-effects directly inside the store factory function (e.g., calling `store.getState().load()` right after `createStore`).
  - **ALWAYS** initiate data loading from inside a `useEffect` within the React component (either the Provider or a dedicated Controller component, e.g. `MyScreenController`) to ensure it runs only after the component mounts.
- **Strict Enum Types in State:**
  - **NEVER** use generic `string` types in `ScreenState` for fields representing fixed value sets (statuses, roles, lockout types, etc.).
  - **ALWAYS** use specific imported TypeScript enums (e.g., `UserRole`, `UserAccountStatus`, `AccountLockoutType`). Avoid unsafe casting (`as any`) or string matching against `Object.values()`.
- **Pagination State Rules:**
  - **Initial Pagination State:** Initial state before the first fetch must use `pageNumber: 0` and `totalPages: 0` (not 1) to support correct IntersectionObserver logic.
  - **Pure Selector Functions:** Use pure selector functions (`getNextPageNumber`, `hasMorePages`, `isPaginationIdle`, `canLoadMorePages`) for derived pagination states. Pass the `PagedResult` object intact to `appendResultToPaginationState` without destructuring it in the store.

## 7. Dependency Injection & Domain Parsers
- **Explicit Domain Parsers:** Never hardcode empty default parsers (e.g., `CompositeAuditActionTypeParser([])`) in DI containers. Domain parsers must be required properties in the Config interface and injected from the top-level application graph.

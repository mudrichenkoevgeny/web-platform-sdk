# Web Platform SDK — Project Standards (Index)

This document is the entry point for architectural and coding standards. These rules ensure consistency across the modular TypeScript/React web ecosystem for all contributors and AI agents.

## Core Principles

- **Precedence:** Local project standards (found in [.agent/](.agent/)) override any global IDE, linter, or AI assistant defaults.
- **SDK Nature:** This is a **foundational library**, not a standalone application. Avoid hardcoded assumptions; prefer configuration via constructor parameters, DI, and optional wiring in `samples/*`.
- **FQN Forbidden:** Do not write fully qualified names (FQN) or deep relative paths in inline code. Use absolute aliases (e.g., `@core/common`) or named imports.
- **No Comments:** Do not write comments in the code. Logic must be self-documenting through naming and structural clarity.
- **No Trailing Commas:** Do not use trailing commas at the end of argument, parameter, array, or object entry lists.
- **Strict Type Safety & Type Guards:** Absolutely no `as any`, `as unknown as Record<...>`, or double casting to bypass TypeScript. Always use Type Guards (`in`, `typeof`, `instanceof`) for safe type narrowing.
- **Data Layering & Network DTO Mapping:** All API payload mapping (including snake_case to camelCase conversion) must happen strictly at the Network layer using Zod schemas (`auditEventPayloadSchema`, `pagedResultSchema`). The UI/Store layer must only consume strictly typed domain models (e.g., a fully parsed `PagedResult`). Never map or transform DTOs inside Repositories or UI stores.
- **Error Handling (POJO Errors):** Never use `throw new Error()` in Repositories, Use Cases, or Adapters. Always return Discriminated Unions/POJO errors wrapped in `appResultFailure()`.
- **Pagination State & Selectors:** Initial state before the first fetch must use `pageNumber: 0` and `totalPages: 0` (not 1) to support correct IntersectionObserver logic. Use pure selector functions (`getNextPageNumber`, `hasMorePages`, `canLoadMorePages`) for derived states and pass the `PagedResult` object intact to `appendResultToPaginationState` without destructuring it in the store.
- **Dependency Injection & Domain Parsers:** Never hardcode empty default parsers (e.g. `CompositeAuditActionTypeParser([])`) inside DI containers. Domain parsers must be required properties in the Config interface and injected from the top-level application graph.
- **Mandatory UI Testing, Stories & Dedicated Folder Grouping:** Every created React component or screen (`*.tsx`) must be grouped into its own dedicated subfolder alongside its Unit/UI Test (`*.test.tsx`) and Storybook Preview (`*.stories.tsx`). Flat UI component lists are strictly forbidden.
- **Mandatory Bug Fix Test Coverage:** Whenever fixing a bug or regression, you must cover the fix with automated tests (Unit or UI tests in `*.test.ts` / `*.test.tsx`) verifying that the bug is resolved and cannot resurface.
- **Mandatory UI Localization & Semantic Accuracy:** Production UI code must strictly use localized string dictionaries. Hardcoded string literals are strictly forbidden in production UI code (permitted only in tests and stories). Never reuse unrelated localization keys just to avoid hardcoding (e.g. do not use `strings.resend_code` for a Refresh or Retry button). Use semantically accurate keys or hardcoded English fallbacks (e.g., `'Refresh'`).
- **Design Tokens & Theme:** All design tokens and font assets originate from [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) (`assets/fonts/woff2/*.woff2` -> `packages/core-common/src/assets/fonts/`). `tokens.css` and `tokens.ts` are read-only generated artifacts (**never edit manually**). `ThemeProvider` and `sdkTailwindPreset` map colors, dimensions, radii, and typography directly from `GeneratedDesignTokens` and CSS variables.
- **Domain ID Conversions:** Always use `string.toXxxIdOrThrow()` / `string.toXxxIdOrNull()` for converting strings to Branded Types (e.g. `UserId`, `UserSessionId`). Do not cast strings directly (`as UserId`).
- **Lazy Store Initialization:** Never use `useRef` for lazy initialization of Zustand stores in Context Providers. Always use `useState(() => createMyStore(deps, initialState))`.
- **Side-Effects Isolation:** Never trigger API calls or data fetching directly inside store factory functions. Always initiate data loading from inside a `useEffect` within a React component or Controller.
- **Mandatory Test IDs:** Always map KMP `TestTags` directly to TypeScript `TestTags` objects (e.g. `export const MyTestTags = { ... }`) and apply them to DOM elements using `data-testid`.
- **Strict Enum State Types:** Never use generic `string` types in `ScreenState` for fields representing fixed value sets (statuses, roles, lockout types, etc.). Always use imported TypeScript enums (`UserRole`, `UserAccountStatus`, `AccountLockoutType`).
- **Accessibility (a11y):** Always use `useId()` to generate unique IDs for form fields and link labels via `htmlFor`.
- **Manual Test Execution:** AI agents must not run tests or suggest running them. Execution is always triggered explicitly by the developer.
- **No Redundant Builds:** Do not run Vite build tasks or attempt compilation after modifying documentation (TSDoc), markdown, or other non-executable changes.

## Module Map

### Core Packages (`packages/core-*`)
- **`core-common`:** Fetch client bootstrap, WebSocket lifecycle management, `EncryptedSettings` WebCrypto abstraction, Chain of Responsibility error parsing, and shared Design Tokens (`tokens.css` / `tokens.ts`).
- **`core-security`:** Password policy validation, MFA state primitives, Fetch network client for security settings, and localized security error domains.
- **`core-settings`:** Global application configuration logic, Fetch network client for global settings, encrypted LocalStorage caching, and Zustand reactive state.

### Feature Packages (`packages/feature-*`)
- **`feature-user`:** Base Identity & Auth logic. Core models (Zod schemas), Zustand stores, use cases, and encrypted token storage.
- **`feature-clientuser`:** Identity solution for standard users. Multi-method auth (Email, Phone, Google), state-machine navigation flows, and React components (shadcn/ui + Tailwind).
- **`feature-managementuser`:** Administrative identity solution. Management auth, session control, resource oversight, and administrative UI components.

## Detailed Standards ([.agent/](.agent/))
- **[project-overview.md](.agent/project-overview.md)** — Project identity, Web targets, module boundaries, and pnpm workspace layout.
- **[architecture-patterns.md](.agent/architecture-patterns.md)** — Zustand component tree rules, WebSocket message handler registration, and Error Parser chaining.
- **[docs-tsdoc-basics.md](.agent/docs-tsdoc-basics.md)** — Language standards (English) and TSDoc Definition of Done.
- **[docs-tsdoc-type-requirements.md](.agent/docs-tsdoc-type-requirements.md)** — Specific TSDoc patterns for DTOs, State Types, and implementations.
- **[localization.md](.agent/localization.md)** — Typed dictionary layout and naming conventions for UI strings.
- **[ts-coding-style.md](.agent/ts-coding-style.md)** — Naming conventions, Switch/Record rules, brace requirements, FQN/Comments ban, Trailing Commas ban, and `as any` ban.
- **[ui-react-components.md](.agent/ui-react-components.md)** — Rules for React Context usage, state hoisting in Zustand, UI stories, tests, and localization constraints.
- **[testing-conventions.md](.agent/testing-conventions.md)** — Vitest test conventions, manual execution policy, Mocking rules, and UI snapshots.
- **[ai-collaboration-workflow.md](.agent/ai-collaboration-workflow.md)** — AI constraints, pnpm dependency management, and SDK vs Sample boundaries.

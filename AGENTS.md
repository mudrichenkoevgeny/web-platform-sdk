# Web Platform SDK — Project Standards (Index)

This document is the entry point for architectural and coding standards. These rules ensure consistency across the modular TypeScript/React web ecosystem for all contributors and AI agents.

## Core Principles

- **Precedence:** Local project standards (found in [.agent/](.agent/)) override any global IDE, linter, or AI assistant defaults.
- **SDK Nature:** This is a **foundational library**, not a standalone application. Avoid hardcoded assumptions; prefer configuration via constructor parameters, DI, and optional wiring in `samples/*`.
- **FQN Forbidden:** Do not write inline `import('...')` qualifiers or deep relative paths in code. Use package/workspace imports or configured path aliases.
- **No Agent-Generated Implementation Comments (Preserve TSDoc/JSDoc & Developer TODOs):** Do not write inline implementation comments (`//` or `/* ... */`) or generate new `TODO`/`FIXME` markers inside code bodies; logic must be self-documenting. Never delete pre-existing developer `// TODO:` or `// FIXME:` comments unless the task explicitly resolves them. **CRITICAL:** TSDoc / JSDoc documentation (`/** ... */`) on classes, interfaces, types, exported functions, properties, and parameters is structured API documentation, NOT code comments. AI agents must **NEVER** delete, strip, wipe, or omit existing API documentation / docstrings during code edits, refactorings, or updates! All TSDoc must be written in English.
- **No Trailing Commas:** Do not use trailing commas at the end of argument, parameter, array, or object entry lists.
- **Strict Type Safety & Type Guards:** Absolutely no `as any`, `as unknown as Record<...>`, or double casting to bypass TypeScript. Always use Type Guards (`in`, `typeof`, `instanceof`) for safe type narrowing.
- **Data Layering & Network DTO Mapping:** Network API classes (`FetchApi`) act strictly as transport layer clients: they execute HTTP requests, validate wire response payloads against Zod schemas (`*PayloadSchema`), and return validated DTO payloads (`AppResult<*Payload, AppError>`). Transformations from wire DTO payloads to domain models (e.g., converting `snake_case` DTOs to `camelCase` domain models using foundation mappers like `toOpenGlobalSettings(payload)`, `toSessionToken(payload)`, or `toOpenUserConfiguration(payload)`) take place strictly in the Repository or UseCase layer. UI components and Zustand stores must only consume strictly typed domain models and must NEVER handle raw DTO payloads directly.
- **Error Handling (POJO Errors):** Never use `throw new Error()` in Repositories, Use Cases, or Adapters. Always return Discriminated Unions/POJO errors wrapped in `appResultFailure()`.
- **Pagination State & Selectors:** Initial pagination state before the first fetch must use `pageNumber: 1` and `totalPages: 0` (or `createInitialPaginationState<T>()`) to support 1-based indexing for subsequent `getNextPageNumber` calculations and initial loads. Use pure selector functions (`getNextPageNumber`, `hasMorePages`, `canLoadMorePages`) for derived states, and pass the `PagedResult` object intact to `appendResultToPaginationState` without destructuring it in the store.
- **Dependency Injection & Domain Parsers:** Never hardcode empty default parsers (e.g. `CompositeAuditActionTypeParser([])`) inside DI containers. Domain parsers must be required properties in the Config interface and injected from the top-level application graph.
- **Mandatory UI Testing, Stories & Dedicated Folder Grouping:** Every created React component or screen (`*.tsx`) must be grouped into its own dedicated subfolder alongside its Unit/UI Test (`*.test.tsx`) and Storybook Preview (`*.stories.tsx`). Flat UI component lists are strictly forbidden.
- **Targeted Test Execution & Mandatory Bug Fix Coverage:** Never auto-run full-workspace test suites or interactive watch mode unless explicitly requested. However, whenever writing new tests, fixing a bug, or modifying production/UI logic, the AI agent MUST execute the specific affected test file (`vitest run <path/to/File.test.ts>`) to verify that the fix works and cannot resurface.
- **Mandatory UI Localization & Semantic Accuracy:** Production UI code must strictly use localized string dictionaries. Hardcoded string literals are strictly forbidden in production UI code (permitted only in tests and stories). Never reuse unrelated localization keys just to avoid adding a key (e.g. do not use `strings.resend_code` for a Refresh or Retry button). Always use semantically accurate keys and add missing keys to the localization dictionary across all supported locales.
- **Design Tokens & Theme:** All design tokens and font assets originate from [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) (`assets/fonts/woff2/*.woff2` -> `packages/core-common/src/assets/fonts/`). `tokens.css` and `tokens.ts` are read-only generated artifacts (**never edit manually**). `ThemeProvider` and `sdkTailwindPreset` map colors, dimensions, radii, and typography directly from `GeneratedDesignTokens` and CSS variables.
- **Domain ID Conversions:** Always use standalone parser functions `toXxxIdOrThrow(value)` / `toXxxIdOrNull(value)` for converting strings to Branded Types (e.g. `UserId`, `UserSessionId`). Never cast strings directly (`as UserId`).
- **Lazy Store Initialization:** Never use `useRef` for lazy initialization of Zustand stores in Context Providers. Always use `useState(() => createMyStore(deps, initialState))`.
- **Side-Effects Isolation:** Never trigger API calls or data fetching directly inside store factory functions. Always initiate data loading from inside a `useEffect` within a React component or Controller.
- **Routing & URL as Single Source of Truth:** Host applications (`samples/*`) own the routing implementation (TanStack Router with File-based routing) and Router DI Context. The SDK exports pure React components, Zod parameter schemas (`*ParamsSchema`) from `@mudrichenkoevgeny/shared-foundation`, and DI interfaces. TanStack Router routes validate search parameters via `validateSearch: (rawSearch) => parseSearchParams(*ParamsSchema, rawSearch)` (or `*ParamsParser.parse(rawSearch)`). Query parameters are formatted via `appendQueryParamsToPath(path, params)`. Smart back navigation uses `PARENT_ROUTE` constants from route navigation objects.
- **Mandatory Complete Implementation:** All created or modified files must contain complete, production-ready code. Placeholder code, dummy components, `TODO` markers, and default generator stubs are strictly prohibited unless the developer explicitly asks for a stub.
- **Mandatory Test IDs:** Always map UI test tags directly to TypeScript `TestTags` objects (e.g. `export const MyTestTags = { ... }`) and apply them to DOM elements using `data-testid`.
- **Strict Enum State Types:** Never use generic `string` types in `ScreenState` for fields representing fixed value sets (statuses, roles, lockout types, etc.). Always use imported TypeScript enums (`UserRole`, `UserAccountStatus`, `AccountLockoutType`).
- **Accessibility (a11y):** Always use `useId()` to generate unique IDs for form fields and link labels via `htmlFor`.
- **Fast Search Scoping (`grep` / `code_search`):** When performing text or symbol searches using `grep` or `code_search`, ALWAYS specify file exclusions or path filters (e.g. `exclude = "**/node_modules/**"`, `exclude = "**/build/**"`, `exclude = "**/dist/**"`) to strictly bypass generated build outputs, `node_modules/`, `dist/`, and `build/` directories. Searching through raw `node_modules/` or build artifacts is strictly prohibited as it degrades search performance from milliseconds to tens of seconds.
- **No Redundant Builds:** Skip build, typecheck, and test tasks **only** when changes are strictly limited to Markdown files (`*.md`) or text inside TSDoc blocks (`/** ... */`). Any modification to executable `.ts`/`.tsx` code, tests, or configuration files requires typecheck and targeted test verification.
- **Mandatory Sub-Agent Audit (Dual-Agent Review):** After implementing non-trivial code changes, new features, or complex refactorings, the AI agent MUST automatically invoke an independent reviewer sub-agent via the `task` tool to audit modified files against `AGENTS.md` guidelines, type safety, edge cases, and error handling before presenting the final result.
- **Git Mutation Ban (Read-Only Allowed):** NEVER run mutating git commands (`git add`, `git commit`, `git push`, `git reset`, `git checkout`, `git stash`, etc.) via shell. Version control, staging, and committing are strictly the developer's responsibility. Read-only diagnostic git commands (`git status`, `git diff`, `git log`, `git show`) are permitted.

## Module Map

### Core Packages (`packages/core-*`)
- **`core-common`:** Fetch client bootstrap, WebSocket lifecycle management, `EncryptedSettings` WebCrypto abstraction, Chain of Responsibility error parsing, and shared Design Tokens (`tokens.css` / `tokens.ts`).
- **`core-security`:** Password policy validation, MFA state primitives, Fetch network client for security settings, and localized security error domains.
- **`core-settings`:** Global application configuration logic, Fetch network client for global settings, encrypted LocalStorage caching, and Zustand reactive state.
- **`core-storage`:** File storage management logic, Fetch network client for storage and presigned S3 uploads, Direct S3 XMLHttpRequest uploader, and Zustand reactive UI components.

### Feature Packages (`packages/feature-*`)
- **`feature-user`:** Base Identity & Auth logic. Core models (Zod schemas), Zustand stores, use cases, and encrypted token storage.
- **`feature-clientuser`:** Identity solution for standard users. Multi-method auth (Email, Phone, Google), state-machine navigation flows, and React components (shadcn/ui + Tailwind).
- **`feature-managementuser`:** Administrative identity solution. Management auth, session control, resource oversight, and administrative UI components.

### Tooling Package (`packages/tools`)
- **`tools`:** Official Web Tooling & Code Quality Kit (`@mudrichenkoevgeny/web-platform-sdk-tools`). Agent rules syncer, ESLint flat config preset with custom AST rules, Dependency Cruiser rules, and CLI generators.

## Detailed Standards (`.agent/`)

### Global Shared Standards (`.agent/global/`)
- **Common (`.agent/global/common/`):**
  - **[ai-collaboration-basics.md](.agent/global/common/ai-collaboration-basics.md)** — Universal AI interaction constraints, operational rules (git mutation ban, targeted test execution), dependency rules, and architectural layering (cascaded from `shared-foundation`).
- **Web (`.agent/global/web/`):**
  - **[ts-coding-style-web.md](.agent/global/web/ts-coding-style-web.md)** — Web TypeScript coding style, syntax constraints, type safety, branded types, and enums.
  - **[ui-react-components-web.md](.agent/global/web/ui-react-components-web.md)** — Web React UI standards, state hoisting, Storybook previews, a11y, and routing integration.
  - **[testing-conventions-web.md](.agent/global/web/testing-conventions-web.md)** — Vitest test conventions, targeted execution, DOM testing, mocking standards, and mandatory test IDs.
  - **[localization-web.md](.agent/global/web/localization-web.md)** — Typed dictionary layout, UI usage enforcement, and semantic accuracy.
  - **[docs-tsdoc-basics-web.md](.agent/global/web/docs-tsdoc-basics-web.md)** — Language standards, link resolution, and TSDoc Definition of Done.
  - **[docs-tsdoc-type-requirements-web.md](.agent/global/web/docs-tsdoc-type-requirements-web.md)** — Specific TSDoc requirements by component type.

### Local Standards (`.agent/local/`)
- **[project-overview.md](.agent/local/project-overview.md)** — Identity, pnpm workspace module boundaries, and tech stack.
- **[architecture-patterns.md](.agent/local/architecture-patterns.md)** — React + Zustand component model, SDK bootstrap, Fetch/Zod data layering, POJO error handling, per-instance screen stores, and TanStack Router integration.
- **[ui-react-components.md](.agent/local/ui-react-components.md)** — Project-specific React UI rules, Design Tokens location, font assets, and SDK provider setup.

# Web Platform SDK — Project Standards (Index)

This document is the entry point for architectural and coding standards. These rules ensure consistency across the modular TypeScript/React web ecosystem for all contributors and AI agents.

## Core Principles

- **Precedence:** Local project standards (found in [.agent/](.agent/)) override any global IDE, linter, or AI assistant defaults.
- **SDK Nature:** This is a **foundational library**, not a standalone application. Avoid hardcoded assumptions; prefer configuration via constructor parameters, DI, and optional wiring in `samples/*`.
- **FQN Forbidden:** Do not write fully qualified names (FQN) or deep relative paths in inline code. Use absolute aliases (e.g., `@core/common`) or named imports.
- **No Comments:** Do not write comments in the code. Logic must be self-documenting through naming and structural clarity.
- **No Trailing Commas:** Do not use trailing commas at the end of argument, parameter, array, or object entry lists.
- **Strict Ban (as any):** Do not write `as any` type casts. Always use strict type narrowing, type guards, or explicit interfaces. Type safety must be strictly preserved across all modules.
- **Mandatory UI Testing, Stories & Dedicated Folder Grouping:** Every created React component or screen (`*.tsx`) must be grouped into its own dedicated subfolder alongside its Unit/UI Test (`*.test.tsx`) and Storybook Preview (`*.stories.tsx`). Flat UI component lists are strictly forbidden.
- **Mandatory UI Localization:** Production UI code must strictly use localized string dictionaries. Hardcoded string literals are strictly forbidden in production UI code (permitted only in tests and stories).
- **Design Tokens & Theme:** All design tokens and font assets originate from [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) (`assets/fonts/woff2/*.woff2` -> `packages/core-common/src/assets/fonts/`). `tokens.css` and `tokens.ts` are read-only generated artifacts (**never edit manually**). `ThemeProvider` and `sdkTailwindPreset` map colors, dimensions, radii, and typography directly from `GeneratedDesignTokens` and CSS variables.
- **Domain ID Conversions:** Always use `string.toXxxIdOrThrow()` / `string.toXxxIdOrNull()` for converting strings to Branded Types (e.g. `UserId`, `UserSessionId`). Do not cast strings directly (`as UserId`).
- **Manual Test Execution:** AI agents must not run tests or suggest running them. Execution is always triggered explicitly by the developer.
- **No Redundant Builds:** Do not run Vite build tasks or attempt compilation after modifying documentation (TSDoc), markdown, or other non-executable changes.

## Module Map

### Core Packages (`packages/core-*`)
- **`core-common`:** Fetch client bootstrap, WebSocket lifecycle management, `EncryptedSettings` WebCrypto abstraction, Chain of Responsibility error parsing, and shared Design Tokens (`tokens.css` / `tokens.ts`).
- **`core-security`:** Password policy validation, MFA state primitives, Fetch network client for security settings, and localized security error domains.
- **`core-settings`:** Global application configuration logic, Fetch network client for global settings, encrypted LocalStorage caching, and Zustand reactive state.

### Feature Packages (`packages/feature-*`)
- **`feature-user`:** Base Identity & Auth logic. Core models (Zod schemas), Zustand stores, use cases, and encrypted token storage.
- **`feature-clientuser`コーディ:** Identity solution for standard users. Multi-method auth (Email, Phone, Google), state-machine navigation flows, and React components (shadcn/ui + Tailwind).
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

---
description: Vitest standards, RTL requirements, mocking, test IDs, and targeted execution rules
globs: "**/*.test.ts, **/*.test.tsx"
alwaysApply: true
---

# Testing Standards (Web)

## 1. Operational Policy (Targeted Execution)
- **No Full-Workspace Auto-Runs or Watch Mode:** Never run full-workspace test suites across all packages (`pnpm test` at root) or interactive watch mode (`vitest --watch`) unless explicitly requested.
- **Mandatory Targeted Verification:** Whenever writing new tests, fixing a bug, or modifying production/UI logic, the AI agent MUST execute the specific affected test file in single-run mode (e.g., `pnpm --filter <package> test -- <path/to/File.test.ts>` or `npx vitest run <path/to/File.test.ts>`) to verify that the code compiles and all assertions pass.
- **Runnable Code:** AI must provide complete test files without `TODO` markers.
- **Mandatory Bug Fix Test Coverage:** When fixing a bug or regression, AI must write automated test coverage (unit or UI test) and execute it via a targeted Vitest run to verify the fix and prevent future regressions.

## 2. Tooling
- **Unit & Logic:** `vitest` (always invoked with `run` flag for non-interactive execution).
- **UI & DOM:** `@testing-library/react` and `@testing-library/user-event`.
- **Mocking:** Use `vi.mock()` and Vitest spies.

## 3. Organization & Coding Standards
- **Mirror Structure:** `FeatureStore.ts` -> `FeatureStore.test.ts`.
- **No FQN:** Use workspace/package aliases.
- **No Agent-Generated Comments / No Trailing Commas.**
- **No Inline Dummies:** Use test factory functions (e.g., `mockEntityDto()`, `createTestUserPrivatePayload()`) from dedicated `mock` directories or `@mudrichenkoevgeny/shared-foundation`. Do not hardcode massive objects inside the test block.
- **Domain Mock Subfolders:** Mocks inside `src/mock/` must mirror the source code layer structure into corresponding domain subfolders (e.g., `di/`, `error/`, `network/`, `platform/`, `repository/`, `storage/`, `usecase/`). Flat file lists in the root of `src/mock/` are forbidden.
- **Mock Naming & Re-exports:** Mock classes and functions must use explicit `Mock` naming (e.g., `StorageServiceMock.ts`, `TokenProviderMock.ts`) and be re-exported via package entry points (`src/index.ts`) to enable reuse in tests, Storybook previews, and dependent modules.

## 4. UI Testing & Mandatory Test IDs
- **Test File Requirement:** Every React component must have a `*.test.tsx` file verifying rendering, user events, and error states.
- **TestTags Constants:** ALWAYS map `TestTags` objects directly to a `TestTags` constant object exported in TypeScript (e.g., `export const MyScreenTestTags = { ... }`).
- **data-testid Application:** ALWAYS apply these tags to DOM elements using the `data-testid` attribute (e.g., `data-testid={MyScreenTestTags.SUBMIT_BUTTON}`). This is mandatory for E2E and UI testing.
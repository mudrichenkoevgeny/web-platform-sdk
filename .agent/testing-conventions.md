---
description: Vitest standards, RTL requirements, mocking, and manual execution rule
globs: "**/*.test.ts, **/*.test.tsx"
alwaysApply: true
---

# Testing Standards

## 1. Operational Policy
- **Manual Execution Only:** Test runs must be triggered explicitly by the developer. AI is strictly prohibited from running test commands.
- **Runnable Code:** AI must provide complete test files without `TODO` markers.

## 2. Tooling
- **Unit & Logic:** `vitest`.
- **UI & DOM:** `@testing-library/react` and `@testing-library/user-event`.
- **Mocking:** Use `vi.mock()` and Vitest spies.

## 3. Organization & Coding Standards
- **Mirror Structure:** `LoginStore.ts` -> `LoginStore.test.ts`.
- **No FQN:** Use workspace aliases.
- **No Comments / Trailing Commas.**
- **No Inline Dummies:** Use test factory functions (e.g., `mockUserDto()`) from dedicated `mock` directories. Do not hardcode massive objects inside the test block.

## 4. UI Testing Mandate
- Every React component must have a `*.test.tsx` file verifying rendering, user events, and error states.
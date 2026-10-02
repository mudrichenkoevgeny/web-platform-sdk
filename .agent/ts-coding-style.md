---
description: Naming conventions, brace requirements, FQN/Comments ban, Trailing Commas ban, Branded Types
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# TypeScript Coding Style

## 1. Core Syntax Constraints
- **Strict Ban (Comments):** Do not write or preserve comments in the code.
- **Strict Ban (Trailing Commas):** Do not write trailing commas in arguments, parameters, objects, or arrays.
- **No Implicit Any:** Code must strictly pass TS `strict` mode.

## 2. Control Flow
- **Braces for `if` and `return`:** Always use block bodies `{ ... }` for `if` statements. Single-line `if (condition) return` is strictly forbidden.
- **State Exhaustiveness:** When switching over state unions, always use a `switch` statement or a Record map that exhaustively covers all cases. Do not use default cases for strictly typed unions.

## 3. Naming Conventions
- **Outcome Variables:** Use domain-focused names (`authSessionResult`), not generic placeholders (`res`, `data`).
- **Zod Schemas:** Suffix schemas with `Schema` (e.g., `UserDtoSchema`).

## 4. Domain Value Classes (Branded Types)
- **ID Branding:** Replace Kotlin inline classes with TS branded types. Define them using intersection types (e.g., `export type UserId = string & { readonly __brand: 'UserId' }`).
- **Parsing Extensions:** Provide utility functions instead of raw casting:
  - `toUserIdOrThrow(value: string): UserId`
  - `toUserIdOrNull(value: string | null | undefined): UserId | null`
- **Strict Ban:** Never cast strings directly via `as UserId` inside feature logic. Always use the parsers.
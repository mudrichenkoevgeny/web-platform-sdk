---
description: Naming conventions, brace requirements, FQN/Comments ban, Trailing Commas ban, Branded Types, as any ban
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# TypeScript Coding Style

## 1. Core Syntax Constraints
- **Strict Ban (Comments):** Do not write or preserve comments in the code.
- **Strict Ban (Trailing Commas):** Do not write trailing commas in arguments, parameters, objects, or arrays.
- **Strict Ban (as any):** Do not write `as any` type casts under any circumstances. Always use strict type narrowing, type guards, or explicit interface inheritance. Type safety must be strictly preserved across all modules.
- **No Implicit Any:** Code must strictly pass TS `strict` mode.
- **Strict Ban (FQN in code):** Do not write fully qualified names (FQN) or deep relative paths (`../../`). Always use absolute path aliases (e.g. `@/domain/User`).
- **Type-only Imports:** Use `import type` when an imported entity is used exclusively as a type (in generics, annotations, etc.) and does not participate in runtime logic. Mixes (e.g. `import { value, type Type }`) are allowed or split them into separate import statements.

## 2. Architecture: UseCases & Params
- **UseCase Methods:** UseCases must only define a single `public async execute(...)` method. Legacy names like `invoke` are strictly forbidden.
- **Options Object (Params):** For methods with 3+ optional parameters (e.g., pagination, filtering), strictly avoid positional arguments. Implement an Options Object interface (e.g. `GetSessionsParams`) to prevent chains of `null` arguments.

## 3. Control Flow
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

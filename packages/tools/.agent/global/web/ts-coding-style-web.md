---
description: Naming conventions, brace requirements, FQN/Comments ban, Trailing Commas ban, Branded Types, as any ban, Strict Enums
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# TypeScript Coding Style (Web)

## 1. Core Syntax Constraints
- **No Implementation Comments (Preserve TSDoc/JSDoc):** Do not write inline implementation comments (`//` or `/* ... */`) inside code bodies; logic must be self-documenting. **CRITICAL:** TSDoc / JSDoc documentation (`/** ... */`) on classes, interfaces, types, exported functions, properties, and parameters is structured API documentation, NOT code comments. AI agents must **NEVER** delete, strip, wipe, or omit existing API documentation / docstrings during code edits, refactorings, or updates!
- **Strict Ban (Trailing Commas):** Do not write trailing commas in arguments, parameters, objects, or arrays.
- **Strict Ban (as any & Double Casting):** Do not write `as any`, `as unknown as Record<...>`, or double casting to bypass TypeScript. Always use strict type narrowing, Type Guards (`in`, `typeof`, `instanceof`), or explicit interface inheritance. Type safety must be strictly preserved across all modules.
- **No Implicit Any:** Code must strictly pass TS `strict` mode.
- **Strict Ban (FQN in code):** Do not write fully qualified names (FQN) or deep relative paths (`../../`). Always use absolute path aliases (e.g. `@/domain/EntityName`).
- **Type-only Imports:** Use `import type` when an imported entity is used exclusively as a type (in generics, annotations, etc.) and does not participate in runtime logic.

## 2. Type Safety & Enums in State
- **Strict Enum Types in State:** NEVER use generic `string` types in `ScreenState` for fields representing fixed value sets (statuses, roles, lockout types, etc.).
- **Specific Imported Enums:** ALWAYS use specific imported TypeScript enums (e.g., `EntityRole`, `EntityStatus`, `LockoutType`) in state types. Avoid unsafe casting (`as any`) or manual string matching against `Object.values()`.
- **Strict Enum Schemas:** Domain enums and extensible interfaces representing wire constants MUST be used as typed runtime enum objects, union types, and corresponding Zod enum schemas (`z.enum(...)`).

## 3. Architecture: UseCases & Params
- **UseCase Methods:** UseCases must only define a single `public async execute(...)` method. Legacy names like `invoke` are strictly forbidden.
- **Options Object (Params):** For methods with 3+ optional parameters (e.g., pagination, filtering), strictly avoid positional arguments. Implement an Options Object interface (e.g. `GetEntitiesParams`) to prevent chains of `null` arguments.

## 4. Control Flow
- **Braces for `if` and `return`:** Always use block bodies `{ ... }` for `if` statements. Single-line `if (condition) return` is strictly forbidden.
- **State Exhaustiveness:** When switching over state unions, always use a `switch` statement or a Record map that exhaustively covers all cases. Do not use default cases for strictly typed unions.

## 5. Naming Conventions
- **Outcome Variables:** Use domain-focused names (`operationResult`), not generic placeholders (`res`, `data`).
- **Zod Schemas:** Suffix schemas with `Schema` (e.g., `EntityDtoSchema`).

## 6. Domain Value Classes (Branded Types)
- **ID Branding:** Replace Kotlin inline classes with TS branded types. Define them using intersection types (e.g., `export type EntityId = string & { readonly __brand: 'EntityId' }`).
- **Parsing Extensions:** Provide utility functions instead of raw casting:
  - `toEntityIdOrThrow(value: string): EntityId`
  - `toEntityIdOrNull(value: string | null | undefined): EntityId | null`
- **Strict Ban:** Never cast strings directly via `as EntityId` inside feature logic. Always use the parsers.

---
description: Language standards, link resolution rules, and TSDoc Definition of Done
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# TSDoc Style Guide — Basics

## 1. Language Standard
- **English Only:** All TSDoc, README files, and API documentation must be written strictly in English. Never write documentation in other languages.

## 2. TSDoc Links & Resolution
- **Simple Links Only:** Use simple names that resolve via imported symbols: `{@link Foo}` or `{@link SomeType.member}`.
- **No FQN in Links:** Fully qualified names or file paths in links (e.g., `{@link packages/core-common/src/Foo}`) are strictly forbidden.
- **Import Requirement:** Every type referenced in a link must be imported in the current file to ensure IDEs and doc generators can resolve the reference.
- **Unreachable Targets:** If a type cannot be imported, use plain text without inline link tags.
- **No Deferred Prose:** Do not redirect the reader with phrases like "Same as {@link Other.CONST}". Every contract detail must be self-contained and fully described.

## 3. Scope Rules
- **Class vs. Member Scope:** In class-level TSDoc, do not link to function parameters by name. Use `@param` only at the function/constructor level.
- **Module Documentation:** Documentation for a module root or barrel export must provide a holistic view of the package infrastructure and primary entry points.

## 4. Definition of Done (DoD)
A documentation task for a module or feature is considered complete ONLY if:
1. **Public Surface:** Every exported `interface`, `type`, `class`, and `function` has a top-level TSDoc summary.
2. **Members:** Every public method, property, and getter/setter has its own TSDoc.
3. **Contracts:** TSDoc must include:
    - Summary of the operation/purpose.
    - `@param` for all parameters.
    - `@returns` for non-void return types.
    - `@throws` for expected domain or infrastructure errors/exceptions.
4. **Side Effects:** For void/Promise<void> functions, the summary must clearly state the outcome (e.g., "Persists the session token and notifies the active storage listeners").

## 5. Inline Comments vs. TSDoc
- **No Narrative Comments:** Strictly forbidden to write comments that narrate the obvious flow of code.
- **Logic Clarity:** Prefer self-documenting code through expressive naming and clear structure.
- **Constraints Only:** Use inline documentation strictly for non-obvious technical constraints, browser quirks, or Web Crypto limitations.
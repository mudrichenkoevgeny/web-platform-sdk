---
description: Language standards, link resolution rules, and TSDoc Definition of Done
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# TSDoc Style Guide — Basics (Web)

## 1. Language Standard
- **English Only:** All TSDoc, README files, and API documentation must be written strictly in English. Never write documentation in other languages.

## 2. TSDoc Links & Resolution
- **Simple Links Only:** Use simple names that resolve via imported symbols: `{@link Foo}` or `{@link SomeType.member}`.
- **No FQN in Links:** Fully qualified names or file paths in links (e.g., `{@link package-name/src/Foo}`) are strictly forbidden.
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
   - `@returns` for non-void return types (for functions returning `AppResult<T, AppError>`, describe both the success payload and potential `AppError` failure variants in `@returns`).
   - `@throws` ONLY for boundary utilities or parsers (e.g., `toEntityIdOrThrow`, React context hooks outside providers) that intentionally throw exceptions.
4. **Side Effects:** For `void` / `Promise<void>` functions, the summary must clearly state the outcome (e.g., "Persists the session token and notifies the active storage listeners").

## 5. Inline Comments vs. TSDoc
- **No Agent-Generated Inline Comments or TODOs:** AI agents must NOT write narrative inline comments (`//` or `/* ... */`) or generate new `TODO` / `FIXME` markers inside code bodies unless explicitly requested by the developer. Logic must be self-documenting through expressive naming and clean structure.
- **Preserve Existing Developer TODOs:** Never delete or strip pre-existing `// TODO:` or `// FIXME:` comments left by the developer unless the current task explicitly resolves that specific TODO item.
- **MANDATORY TSDoc Preservation:** TSDoc blocks (`/** ... */`) are structured API documentation, NOT code comments. AI agents must **NEVER** delete, strip, wipe, or omit existing TSDoc documentation during refactorings, updates, or code edits. All public and exported API elements must strictly retain, maintain, and update their TSDoc documentation.
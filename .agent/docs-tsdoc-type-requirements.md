---
description: Mandatory TSDoc requirements by component type (Zod DTOs, React Components, Zustand Stores, Errors)
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# Documentation Requirements by Type

## 1. Component & Wiring Classes
- Document required constructor injections.
- Explicitly state if `init()` must be called before usage.

## 2. React Components
- Document expected props.
- Document expected Context dependencies (e.g., "Throws if used outside `<SdkProvider>`").

## 3. Zustand Stores (State Machines)
- Document state transitions (e.g., `Initial` -> `Loading` -> `Success`).

## 4. AppError Hierarchies
- Explain the meaning of the `code` and how `args` map to UI placeholders.
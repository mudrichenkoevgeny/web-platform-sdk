---
description: Project identity, Web module boundaries, and SDK infrastructure standards
alwaysApply: true
---

# Web Platform SDK — Overview

## Project Identity
- **Type:** TypeScript client SDK (library) for Web.
- **Publishing:** npm via pnpm workspaces.
- **Tech Stack:** TypeScript, React, Zustand, Zod, Tailwind CSS, shadcn/ui, Framer Motion, Vitest. (No Axios, No TanStack Query).

## Module Structure (pnpm workspaces)
- **`packages/core-common`:** Native Fetch client, WebSocket lifecycle, `AppError` chain, WebCrypto storage.
- **`packages/core-settings`:** Settings API, local storage.
- **`packages/core-security`:** MFA models, security API.
- **`packages/feature-user`:** Identity domain, auth session storage.
- **`packages/feature-clientuser`:** React UI for consumer auth, Tailwind styles, state machines.
- **`packages/feature-managementuser`:** React UI for admins.

## Boundaries
- `core-common` is the leaf; it must never depend on `feature-*`.
- React components must remain host-agnostic and rely on Context injection.
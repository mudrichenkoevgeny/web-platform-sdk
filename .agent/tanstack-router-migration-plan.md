# Web Platform SDK — TanStack Router Migration Plan

This document outlines the architectural approach and step-by-step execution plan for migrating the `web-platform-sdk` from an in-memory Zustand routing stack to **TanStack Router**.

## Architectural Decisions

1. **Host Ownership:** The host applications (`samples/management-app`, `samples/client-app`) own the TanStack Router configuration, route tree generation (File-based routing), and DI Context injection.
2. **SDK Agnosticism:** The SDK remains router-agnostic. It exports pure React components, Zod schemas for URL search parameters, and interface definitions for DI and navigation callbacks.
3. **URL as Single Source of Truth:** Navigation state, filter states, and pagination parameters must be removed from Zustand stores. The URL is the single source of truth. Zustand stores handle only async network logic and local UI state.
4. **Path Params vs. Search Params Rules:**
   - **Identifiers (Path Params):** If a screen only takes an ID (e.g., `userId`, `eventId`), DO NOT create a params interface or Zod schema. Map it directly to a dynamic route path (e.g., `/$userId`).
   - **Complex Data (Search Params):** If a screen takes filters, tokens, or configuration (e.g., `actorIds`, `mfaToken`, `lockoutUntil`), create a dedicated `*SearchSchema.ts` file in the component's directory using `zod`. Keep the Zod schema **absolutely flat** (no nested objects). **Crucial for arrays:** Standard URL parsing inconsistently parses `?actorIds=1` as a string and `?actorIds=1&actorIds=2` as an array. Zod schemas must explicitly handle this array coercion (e.g., using `z.union([z.string().transform(v => [v]), z.array(z.string())])`).
5. **Decouple Stores:** Update the corresponding Zustand stores to remove internal state for filters/sorting. They should now expect these flat params to be passed into their initialization functions directly from the UI component (which will read them from the URL).
6. **Router Context for DI:** Use TanStack's Router Context to inject UseCases deeply into the route tree, maintaining strict type safety and the existing Dependency Injection pattern.

---

## Phase 1: Schema Extraction & Store Decoupling (Web Screen Audit & Action Checklist)

Execute Phase 1 by extracting screen arguments from the current in-memory Zustand discriminated unions into standard web URL parameters (Path Params and Search/Query Params). Mark the checklist as completed `[x]` as each component is processed.

### Module 1: feature-managementuser

- `[x]` **AuditEventListScreen**
  - **Action:** Create `auditEventListSearchSchema.ts` in the component's directory. Use flat fields and strictly apply array coercion.
  - **Future Route:** `/management/audit-events`
- `[x]` **UserDetailScreen**
  - **Action:** No schema needed (Path param only). Strip legacy `userId` from dependencies if it was stored internally.
  - **Future Route:** `/management/users/$userId`
- `[x]` **UserSessionListScreen**
  - **Action:** No schema needed (Path param only).
  - **Future Route:** `/management/users/$userId/sessions`
- `[x]` **UserIdentifierListScreen**
  - **Action:** No schema needed (Path param only).
  - **Future Route:** `/management/users/$userId/identifiers`
- `[x]` **AuditEventDetailScreen**
  - **Action:** No schema needed (Path param only).
  - **Future Route:** `/management/audit-events/$eventId`
- `[x]` **SessionDetailScreen**
  - **Action:** No schema needed (Path param only).
  - **Future Route:** `/management/sessions/$sessionId`
- `[x]` **IdentifierDetailScreen**
  - **Action:** No schema needed (Path param only).
  - **Future Route:** `/management/identifiers/$identifierId`
- `[x]` **ManagementLoginByTotpScreen**
  - **Action:** Create `loginByTotpSearchSchema.ts` (Zod schema for `mfaToken`) in the component's directory.
  - **Future Route:** `/management/login/totp`
- `[x]` **ManagementAccountUnlockScreen**
  - **Action:** Create `accountUnlockSearchSchema.ts` (Zod schema for `lockoutType` and `lockoutUntil`) in the component's directory.
  - **Future Route:** `/management/login/unlock`

### Module 2: feature-clientuser

- `[x]` **ClientLoginByTotpScreen**
  - **Action:** Create `loginByTotpSearchSchema.ts` (Zod schema for `mfaToken`) in the component's directory.
- `[x]` **ClientAccountUnlockScreen**
  - **Action:** Create `accountUnlockSearchSchema.ts` (Zod schema for `lockoutType`, `lockoutUntil`) in the component's directory.

### Module 3: feature-user

- `[x]` **UnlockTargetInputScreen**
  - **Action:** Create `unlockTargetSearchSchema.ts` (Zod schema for `method`) in the component's directory.
- `[x]` **UnlockOtpInputScreen**
  - **Action:** Create `unlockOtpSearchSchema.ts` (Zod schema for `method`, `target`, `initialDelaySeconds`) in the component's directory.
- `[x]` **ProfileSessionDetailScreen**
  - **Future Route:** `/profile/sessions/$sessionId`
- `[x]` **ProfileIdentifierDetailScreen**
  - **Future Route:** `/profile/identifiers/$identifierId`

---

## Phase 2: Host Apps Foundation (Router Setup for BOTH apps)

Execute these steps in BOTH `samples/management-app` and `samples/client-app`:

1. **Install Dependencies:**
   - Install `@tanstack/react-router` and `@tanstack/router-plugin` (for Vite) in both host projects (`samples/management-app` and `samples/client-app`).
2. **Configure Vite:**
   - Add the TanStack router plugin (`TanStackRouterVite`) to `vite.config.ts` in both projects to enable file-based route generation.
3. **Establish Root Route and Router Context:**
   - Create `src/routes/__root.tsx` in both apps.
   - For `management-app`: Define `RouterDIContext` requiring `ManagementRootStoreDependencies`.
   - For `client-app`: Define `RouterDIContext` requiring `ClientLoginRootStoreDependencies` and `MainProfileStoreDependencies`.
   - Export the root route using `createRootRouteWithContext`.
4. **Initialize Router Provider:**
   - In `router.ts` of both apps, create the router instance: `createRouter({ routeTree, context: { ...deps } })`.

---

## Phase 3: Incremental Route Migration (File-based Routing)

1. **Implement Routes:** Create files in the `src/routes/` directory of each respective host app mirroring their desired URL structures.
2. **Connect SDK Screens to Routes:**
   - In each route file, use `createFileRoute`.
   - For screens with search parameters, apply `validateSearch` using the Zod schemas created in Phase 1.
   - Extract the specific dependencies for that app via `Route.useRouteContext()`.
   - Render the corresponding SDK Screen.

---

## Phase 4: Cleanup & Legacy Removal

1. `[x]` **Replace Legacy Shell Containers:** Deprecated internal in-memory stack switching (`ManagementRootScreen`, `ManagementRootStore`) in favor of TanStack Router's `<Outlet />` mounted directly inside `MainScreen` in both sample applications (`management-app` and `client-app`).
2. `[x]` **Decouple Dependencies:** Extracted `ManagementRootStoreDependencies` to `management-dependencies.ts` so host application context definitions maintain 100% type safety without importing legacy stack stores.
3. `[x]` **Verify & Test:** Type check and static analysis passed with zero errors across all SDK packages and sample apps.

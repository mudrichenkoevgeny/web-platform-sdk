# Development and Publishing

This document provides setup, development, testing, linting, and package publishing guidelines for contributors to **Web Platform SDK** (`web-platform-sdk`).

---

## 1. Prerequisites & Environment Setup

### Node.js & pnpm
This repository uses **pnpm** (v12.8+) as its package manager and workspace orchestrator.

1. **Enable pnpm via Corepack:**
   ```bash
   corepack enable
   corepack prepare pnpm@12.8.1 --activate
   ```
2. **Install Workspace Dependencies:**
   From the repository root:
   ```bash
   pnpm install
   ```

---

## 2. Workspace Structure & Build Workflow

The repository is structured as a **pnpm monorepo workspace**:

```text
web-platform-sdk/
├── packages/
│   ├── core-common/            # @mudrichenkoevgeny/web-platform-sdk-core-common
│   ├── core-security/          # @mudrichenkoevgeny/web-platform-sdk-core-security
│   ├── core-settings/          # @mudrichenkoevgeny/web-platform-sdk-core-settings
│   ├── feature-user/           # @mudrichenkoevgeny/web-platform-sdk-feature-user
│   ├── feature-clientuser/     # @mudrichenkoevgeny/web-platform-sdk-feature-clientuser
│   └── feature-managementuser/ # @mudrichenkoevgeny/web-platform-sdk-feature-managementuser
└── samples/
    ├── client-app/             # Consumer reference app (@web-platform-sdk/sample-client-app)
    └── management-app/         # Admin reference app (@web-platform-sdk/sample-management-app)
```

### Building Workspace Packages

Before running sample applications or executing tests across dependent modules, build all SDK packages from the project root:

```bash
# Build all SDK packages in packages/*
pnpm build
```

To build a single specific package:
```bash
pnpm --filter @mudrichenkoevgeny/web-platform-sdk-core-security run build
```

---

## 3. Local Development with Sample Apps

The repository includes two sample web applications for testing SDK integrations locally:

### 1. Consumer Sample App (`sample-client-app`)
Demonstrates consumer auth flows (Login, Registration, OTP, Profile management):

- **From root:**
  ```bash
  pnpm dev:client
  ```
- **Local URL:** `http://localhost:3002`

### 2. Management Sample App (`sample-management-app`)
Demonstrates back-office admin panel flows (Staff Auth, Audit Logs, User Management, Remote Settings Overrides):

- **From root:**
  ```bash
  pnpm dev:management
  ```
- **Local URL:** `http://localhost:3003`

---

## 4. Code Quality, Type Checking & Linting

### Type Checking (`tsc`)
Runs strict TypeScript compilation checks (`tsc --noEmit`) across all workspace packages and apps:

```bash
# Run type check across the entire workspace
pnpm typecheck

# Run type check for a specific package
pnpm --filter @mudrichenkoevgeny/web-platform-sdk-core-common run typecheck
```

### Code Linting (`eslint`)
Runs ESLint rules with zero warning tolerance across all TypeScript and React files:

```bash
# Run linter project-wide
pnpm lint
```

---

## 5. Unit & UI Testing (Vitest & React Testing Library)

Testing is driven by **Vitest** with **jsdom** and **React Testing Library**.

### 1. Project-Wide Test Execution
To run all tests across all workspace packages in headless mode:

```bash
pnpm vitest run
```

### 2. Interactive Watch Mode
To run Vitest in interactive watch mode during active development:

```bash
pnpm vitest
```

### 3. Testing a Specific Package or File
To execute tests for a single workspace package:

```bash
pnpm --filter @mudrichenkoevgeny/web-platform-sdk-feature-user exec vitest run
```

To run a specific test file:
```bash
pnpm vitest run packages/core-security/src/usecase/security-use-cases.test.ts
```

---

## 6. Dependency Management & Catalog

Dependencies across the workspace are centralized in `pnpm-workspace.yaml` under the `catalog:` block to maintain consistent versions:

```yaml
catalog:
  '@mudrichenkoevgeny/shared-foundation': '^0.0.55'
  'react': '^19.0.0'
  'react-dom': '^19.0.0'
  'typescript': '^7.0.2'
  'vitest': '^5.0.3'
```

### Adding a Dependency to a Package
To add a dependency to a specific workspace package:

```bash
pnpm add <package-name> --filter @mudrichenkoevgeny/web-platform-sdk-core-security
```

If the dependency is in the catalog, reference it in `package.json` as `"catalog:"`:
```json
"dependencies": {
  "react": "catalog:"
}
```

---

## 7. Package Publishing to npm

The SDK packages under `packages/*` are published to npm under the `@mudrichenkoevgeny` organization scope (`@mudrichenkoevgeny/web-platform-sdk-*`).

### Version Management Across Workspace Packages

To bump package versions across all `packages/*` synchronously without editing individual `package.json` files manually:

- **Bump Patch Version (e.g. 0.0.1 -> 0.0.2):**
  ```bash
  pnpm version:patch
  ```
- **Bump Minor Version (e.g. 0.0.1 -> 0.1.0):**
  ```bash
  pnpm version:minor
  ```
- **Set Explicit Version (e.g. 0.0.5):**
  ```bash
  pnpm version:set 0.0.5
  ```

### Publishing Workflow

1. **Authenticate with npm:**
   ```bash
   npm login
   ```

2. **Verify Type Checking & Linting:**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm vitest run
   ```

3. **Bump Version Across Packages:**
   ```bash
   pnpm version:patch
   ```

4. **Build Distributable Artifacts:**
   Generates ESM bundles, TypeScript typings (`.d.ts`), and CSS stylesheets (`tokens.css`):
   ```bash
   pnpm build
   ```

5. **Publish All Workspace Packages:**
   ```bash
   pnpm -r --filter "./packages/*" publish --access public
   ```

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
│   ├── core-storage/           # @mudrichenkoevgeny/web-platform-sdk-core-storage
│   ├── feature-user/           # @mudrichenkoevgeny/web-platform-sdk-feature-user
│   ├── feature-clientuser/     # @mudrichenkoevgeny/web-platform-sdk-feature-clientuser
│   ├── feature-managementuser/ # @mudrichenkoevgeny/web-platform-sdk-feature-managementuser
│   └── tools/                  # @mudrichenkoevgeny/web-platform-sdk-tools
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
Demonstrates consumer auth flows (Login, Registration, OTP, User management):

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
- **Local URL:** `http://localhost:3001`

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

### Module Boundaries (`dependency-cruiser`)
Runs Dependency Cruiser to enforce architectural boundaries between core and feature modules:

```bash
# Verify workspace module boundaries
pnpm lint:deps
```

### API Contract Snapshots (`api-extractor`)
Generates and verifies public API signature snapshots to prevent breaking contract changes:

```bash
# Update local API snapshots
pnpm api:extract

# Verify API contract snapshots in CI mode
pnpm api:extract-ci
```

### Package Exports Verification (`publint`)
Verifies package.json export configurations and type declarations across all workspace packages:

```bash
# Run publint across workspace packages
pnpm lint:exports
```

### Bundle Size Budget Verification (`size-limit`)
Monitors brotli/gzip bundle sizes for all published workspace packages:

```bash
# Verify bundle size budgets
pnpm size
```

---

## 5. Unit & UI Testing (Vitest & React Testing Library)

Testing is driven by **Vitest** with **jsdom** and **React Testing Library**.

### 1. Project-Wide Test Execution
To run all tests across all workspace packages in headless mode:

```bash
pnpm test
```

### 2. Interactive Watch Mode
To run Vitest in interactive watch mode during active development:

```bash
pnpm test:watch
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
  '@mudrichenkoevgeny/shared-foundation': '^x.y.z'
  'react': '^x.y.z'
  'react-dom': '^x.y.z'
  'typescript': '^x.y.z'
  'vitest': '^x.y.z'
```

### Adding a Dependency to a Package
To add a dependency to a specific workspace package:

```bash
pnpm add <package-name> --filter @mudrichenkoevgeny/web-platform-sdk-core-security
```

If the dependency is in the catalog, reference it in `package.json` as `"catalog:"`:
```json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

### Testing Local `.tgz` Builds (`shared-foundation`)
To test a locally generated `.tgz` archive of `@mudrichenkoevgeny/shared-foundation`:

1. Update `pnpm-workspace.yaml`:
   ```yaml
   catalog:
     '@mudrichenkoevgeny/shared-foundation': 'file:/path/to/mudrichenkoevgeny-shared-foundation-<version>.tgz'
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```

---

## 7. Package Publishing & Changeset Workflow

All SDK packages under `packages/*` are published to npm under the `@mudrichenkoevgeny` scope (`@mudrichenkoevgeny/web-platform-sdk-*`).

Package versioning and release management are automated using **Changesets** (`@changesets/cli` and `changesets/action@v1`).

---

### Step 1: Creating a Changeset during Development

Whenever you introduce a bugfix, new feature, or breaking change in any package under `packages/*`:

1. **Complete your code changes and tests.**
2. **Generate a Changeset entry (ONCE per PR/Feature):**
   From the repository root, run:
   ```bash
   pnpm change
   ```
3. **Follow the interactive CLI prompts:**
   - Select the packages affected by your changes (e.g. `@mudrichenkoevgeny/web-platform-sdk-core-common`).
   - Select the semver bump type (`patch`, `minor`, or `major`).
   - Enter a concise summary of the changes for the package's `CHANGELOG.md`.
4. **Commit the generated Markdown file:**
   Changesets creates a unique Markdown file under `.changeset/` (e.g. `.changeset/dry-dogs-dance.md`). Commit and push this file with your feature branch:
   ```bash
   git add .changeset
   git commit -m "chore: add changeset for my feature"
   ```

> **Note:** You do **NOT** need to run `pnpm change` on every commit. Run it once per feature or pull request before merging into `main`. Changesets are not required for changes restricted to `samples/*`, documentation, or CI workflow configuration.

---

### Step 2: Automated Release PR & Publishing via CI

When your pull request containing a `.changeset/` entry is merged into `main`:

1. **Automated "Version Packages" PR:**
   The GitHub Actions workflow (`.github/workflows/release.yml`) executes `@changesets/action`. It detects new changeset entries and automatically opens or updates a Pull Request titled **"Version Packages"**.
2. **Automatic Version Bumping & Changelogs:**
   The "Version Packages" PR automatically:
   - Bumps package versions in `package.json` across dependent workspace packages.
   - Appends entries to each affected package's `CHANGELOG.md`.
   - Removes the consumed `.changeset/*.md` files.
3. **Publishing to npm:**
   When a maintainer merges the **"Version Packages"** PR into `main`, GitHub Actions automatically:
   - Builds all packages (`pnpm build`).
   - Publishes updated packages to the npm registry with SLSA Level 3/4 provenance attestation.
   - Creates corresponding Git tags (`@mudrichenkoevgeny/web-platform-sdk-core-common@x.y.z`) in the repository.

---

### Emergency / Manual Version Bumping (Fallback)

If manual version synchronization is required across all `packages/*` without creating a changeset entry:

- **Bump Patch Version (0.0.1 -> 0.0.2):**
  ```bash
  pnpm version:patch
  ```
- **Bump Minor Version (0.0.1 -> 0.1.0):**
  ```bash
  pnpm version:minor
  ```
- **Set Explicit Version (e.g. 0.1.5):**
  ```bash
  pnpm version:set 0.1.5
  ```
- **Consume Local Changesets Manually:**
  ```bash
  pnpm version-packages
  ```

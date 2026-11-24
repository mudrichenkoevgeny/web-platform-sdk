# Contributing to Web Platform SDK

This guide covers environment setup, workspace structure, quality gates, coding standards, and release workflows for `web-platform-sdk`.

---

## 1. Prerequisites & Setup

This repository uses **pnpm** managed via Corepack (the exact version is pinned in `package.json` under `packageManager`).

```bash
corepack enable
pnpm install
```

`pnpm install` automatically runs `sync-foundation-rules` (`postinstall`).

## 2. Workspace Structure

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
    ├── client-app/             # @web-platform-sdk/sample-client-app
    ├── management-app/         # @web-platform-sdk/sample-management-app
    └── sandbox/                # @web-platform-sdk/sandbox
```

---

## 3. Build & Local Development

Build all packages under `packages/*` before running sample apps or dependent tests:

```bash
pnpm build
```

Build a single package:

```bash
pnpm --filter @mudrichenkoevgeny/web-platform-sdk-core-security run build
```

Run local development servers:

| Command | Target |
| :--- | :--- |
| `pnpm dev:client` | Consumer sample app (`samples/client-app`) |
| `pnpm dev:management` | Management sample app (`samples/management-app`) |
| `pnpm sandbox:dev` | Sandbox app (`samples/sandbox`) |
| `pnpm storybook` | Storybook UI catalog (`http://localhost:6006`) |

### Scaffolding & Code Generation

Interactive generator for UseCases or React components:
```bash
pnpm generate
```

Generate a UseCase:
```bash
pnpm generate:usecase
```

Generate a React UI component:
```bash
pnpm generate:component
```

Scaffold a new project workspace:
```bash
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init workspace my-app
```

---

## 4. Verification & Quality Gates

All pull requests targeting `main` or `develop` must pass the CI gates defined in `.github/workflows/ci.yml`:

| Command | Purpose |
| :--- | :--- |
| `pnpm version:verify` | Verifies synchronized `"version"` across `packages/*` |
| `pnpm lint` | Runs `version:verify` and ESLint (`--max-warnings 0`) |
| `pnpm typecheck` | Runs strict TypeScript checks across all workspaces |
| `pnpm lint:deps` | Enforces module boundaries via Dependency Cruiser |
| `pnpm api:extract` | Updates local API Extractor contract snapshots |
| `pnpm api:extract-ci` | Verifies API contract snapshots without modifying files |
| `pnpm lint:exports` | Validates package exports and type declarations via `publint` |
| `pnpm size` | Verifies bundle size budgets via `size-limit` |
| `pnpm audit` | Checks dependencies for critical security vulnerabilities |
| `pnpm test` | Runs Vitest across `packages/*` and `samples/*` |
| `pnpm test:watch` | Runs Vitest in interactive watch mode |
| `pnpm test:e2e` | Runs Playwright end-to-end tests |

Run tests for a single package:
```bash
pnpm --filter @mudrichenkoevgeny/web-platform-sdk-feature-user exec vitest run
```

Run tests for a specific test file:
```bash
pnpm vitest run packages/core-security/src/usecase/security-use-cases.test.ts
```

---

## 5. Coding Standards

Follow the rules enforced in `AGENTS.md`:

- **No trailing commas** in arguments, parameters, objects, or arrays.
- **No inline implementation comments** (`//` or `/* ... */`) or new `TODO`/`FIXME` markers in function bodies.
- **Preserve TSDoc/JSDoc** (`/** ... */`) on public APIs.
- **Strict type safety:** no `as any`, no double casting (`as unknown as ...`), and no untyped string states for enums; use type guards (`in`, `typeof`, `instanceof`) and explicit TypeScript enums.
- **Clean imports:** no inline `import('...')` FQNs or deep relative paths (`../../`) across package boundaries.
- **Error handling:** do not `throw new Error()` in domain/SDK logic; return discriminated-union POJO errors wrapped in `appResultFailure()`.

---

## 6. Dependency Management

Shared dependency versions are centralized in `pnpm-workspace.yaml` under `catalog:`. Reference catalog dependencies in `package.json` using `"catalog:"`.

Add a dependency to a specific package:

```bash
pnpm add <package-name> --filter @mudrichenkoevgeny/web-platform-sdk-core-security
```

Test a local `.tgz` build of `@mudrichenkoevgeny/shared-foundation`:

1. Point the catalog entry in `pnpm-workspace.yaml` to the archive:
   ```yaml
   catalog:
     '@mudrichenkoevgeny/shared-foundation': 'file:/path/to/shared-foundation/build/npm-package/mudrichenkoevgeny-shared-foundation-<version>.tgz'
   ```
2. Reinstall dependencies:
   ```bash
   pnpm install
   ```

---

## 7. Versioning & Releases

Active development targets `main` and `develop`.

### Changesets (Pull Requests)
Pull requests are validated in CI via `pnpm changeset status`. For changes affecting `packages/*`, add a changeset once per PR:

```bash
pnpm change
```

### Synchronizing Package Versions
All packages under `packages/*` share a single synchronized version checked by `pnpm version:verify`. Choose **one** of the following commands depending on the desired bump:

Bump patch version:
```bash
pnpm version:patch
```

Bump minor version:
```bash
pnpm version:minor
```

Set explicit version:
```bash
pnpm version:set 0.2.0
```

Apply Changeset updates:
```bash
pnpm version-packages
```

### Local NPM Packages (`pnpm pack`)
To test local `.tgz` builds of the SDK packages in a consumer repository:

1. Build and pack all workspace packages into `./dist-tarballs`:
   ```bash
   pnpm build
   pnpm -r --filter "./packages/*" pack --pack-destination ./dist-tarballs
   ```
2. Point the consumer `pnpm-workspace.yaml` catalog entries to the generated `.tgz` files and run `pnpm install`.

### Publishing via CI
Official releases are triggered by pushing a `v*` Git tag. The `.github/workflows/release.yml` workflow automatically:

1. Builds all packages (`pnpm build`), attests build provenance via GitHub OIDC, and publishes `packages/*` to npmjs.com (`pnpm -r publish --access public --provenance`).
2. Generates API reference documentation (`pnpm docs:generate`) and deploys `./dist/docs` to GitHub Pages.

# Web Platform SDK Tools (`@mudrichenkoevgeny/web-platform-sdk-tools`)

The official **Web Tooling & Code Quality Kit** for Web Platform SDK applications and packages.

Provides automated project skeleton scaffolding (`init`), agent rules synchronization (`sync`), shared ESLint rules with custom architectural AST checks, Dependency Cruiser module boundary rules, and interactive Plop code generators (`generate`).

---

## Features

- **Project Skeleton Scaffolding:** Rapidly scaffolds new Web and Admin applications (`workspace`, `client`, or `admin`) via `pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init <type> <name>`.
- **Automated Agent Rules Sync:** Automatically delivers `.agent/global/` (`common/` + `web/`) rules on `postinstall` or via CLI (`web-sdk-tools sync`).
- **Shared ESLint Preset & Custom AST Rules:** Enforces strict TypeScript, React, a11y, and TSDoc standards plus custom AST rules (`no-direct-branded-cast`, `no-throw-in-repo-usecase`, `no-empty-di-array`).
- **Dependency Cruiser Rules:** Enforces clean architectural module boundaries (`core-common` isolation, feature non-cross dependencies).
- **Interactive Plop Generators:** Scaffolds Clean Architecture UseCases and React UI components with tests and Storybook previews via CLI (`web-sdk-tools generate`).

---

## Installation

Add as a development dependency in your web project:

```bash
pnpm add -D @mudrichenkoevgeny/web-platform-sdk-tools
```

---

## Usage Guide

### 1. Project Skeleton Scaffolding

Scaffold a complete production-ready application workspace without pre-installing dependencies:

```bash
# Scaffold full monorepo with both Client and Admin apps
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init workspace my-app

# Scaffold monorepo linking local unpublished SDK packages (for testing pre-releases)
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init workspace my-app --link-local

# Scaffold monorepo with Client app only
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init client my-app

# Scaffold monorepo with Admin app only
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init admin my-app
```

### 2. ESLint Configuration

Import the flat ESLint configuration in your project's `eslint.config.js`:

```javascript
import webSdkEslintConfig from '@mudrichenkoevgeny/web-platform-sdk-tools/eslint'

export default [
  ...webSdkEslintConfig
]
```

### 3. Dependency Cruiser Configuration

Import the Dependency Cruiser configuration in your project's `.dependency-cruiser.js`:

```javascript
import { webSdkDepcruiseConfig } from '@mudrichenkoevgeny/web-platform-sdk-tools/depcruise'

export default webSdkDepcruiseConfig
```

### 4. CLI Commands

```bash
# Scaffold new project workspace, client, or admin app
pnpm dlx @mudrichenkoevgeny/web-platform-sdk-tools init <type> <name> [--skip-install] [--link-local]

# Synchronize global agent rules into project .agent/global/
npx web-sdk-tools sync

# Interactively generate UseCases or React UI components
npx web-sdk-tools generate

# Verify package exports via publint
npx web-sdk-tools check-exports

# Verify public API signature snapshots via API Extractor
npx web-sdk-tools api-extract
```

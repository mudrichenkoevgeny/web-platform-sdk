---
description: AI interaction constraints, dependency management, and Web module responsibility mapping
alwaysApply: true
---

# AI Collaboration & Workflow Standards

## 1. Context & Rule Precedence
- **Mandatory Compliance:** Local project standards (defined in `.agent/` and `AGENTS.md`) override generic AI training defaults.
- **Strict Coding Rules:**
  - **No Comments:** Do not generate or preserve inline comments in the code.
  - **No FQN/Relative Paths:** Avoid deep relative imports (`../../..`). Use workspace aliases (`@web-platform-sdk/core-common`).

## 2. Operational Constraints
- **Execution Ban (Tests):** Do not suggest, initiate, or invite the user to run test suites (`pnpm test`, `vitest`).
- **Permitted Commands:** Commands that do not trigger tests are allowed (e.g., `pnpm install`, `pnpm build`).
- **Redundant Build Prohibition:** Do not invoke builds after editing TSDoc or Markdown.
- **Complete Code:** Provide full, runnable implementations. Avoid `// ... rest of code` or `TODO` markers.

## 3. Dependency Management
- **pnpm Workspaces:** All dependencies must be managed via `pnpm` workspace definitions.
- **Package Alignments:** Ensure external dependencies (React, Zod) are defined consistently across all `package.json` files or hoisted to the root.
- **Peer Dependencies:** React and Tailwind must be declared as `peerDependencies` in feature modules, not bundled.

## 4. Architectural Workflow
- **Errors:** Extend `AppError`, update the relevant `AppErrorParser`, and add strings to the localization dictionaries.
- **Networking:** Add Fetch interceptors as `HttpClientConfigPlugin`.
- **UI & Navigation:** Use Zustand state machines for logic and React for rendering.
- **Communication Protocol:** Direct technical output only. No meta-talk, no "I hope this helps". Do not skip topics.
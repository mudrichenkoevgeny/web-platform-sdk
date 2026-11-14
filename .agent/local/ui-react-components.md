---
description: Project-specific React UI, Design Tokens location, font assets, and SDK component provider setup
globs: "**/*.tsx"
alwaysApply: true
---

# Web Platform SDK — Local React UI & Styling Rules

## 1. Design Tokens & Theme Assets Location
- **Single Source of Truth:** All visual design tokens (colors, spacing, sizing, radius, elevation) and font assets (`assets/fonts/woff2/*.woff2`) originate from the [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) repository.
- **Generated Tokens Artifacts:** `tokens.css` and `tokens.ts` (`packages/core-common/src/theme/tokens/`) are generated automatically by the design system toolchain. **Manual modifications to `tokens.css` and `tokens.ts` are strictly prohibited.**
- **Font Assets Location:** Physical font files (`.woff2`) are copied directly from `platform-design-system` (`assets/fonts/woff2/`) into `packages/core-common/src/assets/fonts/` so `@font-face` rules in `tokens.css` can resolve them.
- **Theme Wiring:** `ThemeProvider` and `useTheme()` in `core-common` handle light/dark/system mode switching, while `sdkTailwindPreset` maps CSS token variables (`var(--color-primary)`, `var(--spacing-md)`, etc.) directly into Tailwind CSS utility classes.

## 2. SDK Component Provider & Context Injection
- **Host Context Injection:** React components in feature packages (`feature-clientuser`, `feature-managementuser`) consume component graph instances (`CommonComponent`, `ClientUserComponent`) via `<SdkProvider component={commonComponent}>`.
- **Transitions:** Use Framer Motion (`motion/react`) for step-based navigation transitions inside feature UI modules.

## 3. Mandatory Test IDs & TestTags Constants
- **TestTags Constants:** ALWAYS map UI component test tags directly to a `TestTags` constant object exported in TypeScript (e.g., `export const MyScreenTestTags = { ... }`).
- **data-testid Application:** ALWAYS apply these tags to DOM elements using the `data-testid` attribute (e.g., `data-testid={MyScreenTestTags.SUBMIT_BUTTON}`). This is mandatory for E2E and UI testing.

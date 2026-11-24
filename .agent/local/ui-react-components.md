---
description: Project-specific React UI, Design Tokens location, font assets, and SDK component provider setup
globs: "**/*.tsx"
alwaysApply: true
---

# Web Platform SDK — Local React UI & Styling Rules

## 1. Design Tokens & Theme Assets Location
- **Tokens & Fonts Location:** All visual design tokens (colors, spacing, sizing, radius, elevation) and font assets (`.woff2`) are exported directly by `@mudrichenkoevgeny/shared-foundation`.
- **Tokens & Fonts Import:** `tokens.css`, `PlatformDesignTokens` (re-exported as `GeneratedDesignTokens`), and font files (`fonts/*.woff2`) are consumed directly from `@mudrichenkoevgeny/shared-foundation`.
- **Theme Wiring:** `ThemeProvider` and `useTheme()` in `core-common` handle light/dark/system mode switching, while `sdkTailwindPreset` maps CSS token variables (`var(--color-primary)`, `var(--spacing-md)`, etc.) directly into Tailwind CSS utility classes.

## 2. SDK Component Provider & Context Injection
- **Host Context Injection:** React components in feature packages (`feature-clientuser`, `feature-managementuser`) consume component graph instances (`CommonComponent`, `ClientUserComponent`) via `<SdkProvider component={commonComponent}>`.
- **Transitions:** Use Framer Motion (`motion/react`) for step-based navigation transitions inside feature UI modules.

## 3. Mandatory Test IDs & TestTags Constants
- **TestTags Constants:** ALWAYS map UI component test tags directly to a `TestTags` constant object exported in TypeScript (e.g., `export const MyScreenTestTags = { ... }`).
- **data-testid Application:** ALWAYS apply these tags to DOM elements using the `data-testid` attribute (e.g., `data-testid={MyScreenTestTags.SUBMIT_BUTTON}`). This is mandatory for E2E and UI testing.

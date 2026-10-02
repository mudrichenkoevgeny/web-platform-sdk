---
description: Constraints for React Context, Storybook, UI styling, and localization
globs: "**/*.tsx"
alwaysApply: true
---

# React UI, Context, and Previews

## 1. UI Localization Enforcement
- Hardcoded string literals in production UI components are strictly forbidden. You must use the localization dictionary.

## 2. Mandatory Previews (Stories)
- **Requirement:** Every UI component (`*.tsx`) must be accompanied by a Storybook file (`*.stories.tsx`).
- **Context Wrappers:** Stories must wrap components in Mock Providers (`<SdkProvider>`) and inject fake stores/components to isolate the UI state.

## 3. State Hoisting (Zustand)
- Do not hold complex business logic or fetch calls inside React `useEffect`.
- Hoist side-effects and API interactions into Zustand stores (acting as component ViewModels). React components only observe state and dispatch actions.

## 4. Styling Constraints
- All CSS classes must be scoped or prefixed to avoid polluting the host application's stylesheet.
- Use Framer Motion (`motion/react`) for step-based navigation transitions inside feature modules.

## 5. Design Tokens & Theme Integration
- **Single Source of Truth:** All visual design tokens (colors, spacing, sizing, radius, elevation) and font assets (`assets/fonts/woff2/*.woff2`) originate from the [platform-design-system](https://github.com/mudrichenkoevgeny/platform-design-system) repository.
- **Generated Tokens Artifacts:** `tokens.css` and `tokens.ts` (`packages/core-common/src/theme/tokens/`) are generated automatically by the design system toolchain. **Manual modifications to `tokens.css` and `tokens.ts` are strictly prohibited.**
- **Font Assets Location:** Physical font files (`.woff2`) are copied directly from `platform-design-system` (`assets/fonts/woff2/`) into `packages/core-common/src/assets/fonts/` so `@font-face` rules in `tokens.css` can resolve them.
- **Theme Wiring:** `ThemeProvider` and `useTheme()` handle light/dark/system mode switching, while `sdkTailwindPreset` maps CSS token variables (`var(--color-primary)`, `var(--spacing-md)`, etc.) directly into Tailwind CSS utility classes.

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

## 6. UI Component & Screen Dedicated Folder Grouping
- **Strict Single-Folder Grouping:** Every UI component or screen (`*.tsx`) must be placed in its own dedicated subfolder together with its corresponding Unit/UI Test (`*.test.tsx`) and Storybook Preview (`*.stories.tsx`).
- **Directory Structure:**
  - `src/ui/components/<category>/<component-name>/<ComponentName>.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.test.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.stories.tsx`
- **Flat Lists Ban:** Placing multiple UI components or screens directly into a flat parent directory is strictly forbidden.

## 7. Accessibility Mandate (Keyboard Navigation)
- **Keyboard Access:** All interactive elements (clickable cards, items, custom buttons) must be fully navigable via keyboard.
- **Custom Clickable Containers:** If a non-`<button>` container element (e.g. `<div>`) receives a click handler (`onClick` / `onSessionClick`):
  - Must conditionally specify `role={onClick ? 'button' : undefined}`.
  - Must specify `tabIndex={onClick ? 0 : undefined}` to participate in tab order.
  - Must specify `onKeyDown` handler to trigger click on `Enter` and `Space` (`' '`) keys.
  - Must include focus indicator styles (e.g., `focus:outline-none focus:ring-2 focus:ring-primary`).

## 8. Screen Store Context Isolation
- **Per-Instance Stores:** Screen-level stores must be created per component instance using `createStore()` (vanilla Zustand) + React Context Provider + `useStore(context, selector)` hook.
- **No Global Singletons for Screens:** Global `create()` stores are strictly forbidden for screen UI states, form inputs, and step transitions to prevent state leakage across multiple mounted SDK widgets or screens.





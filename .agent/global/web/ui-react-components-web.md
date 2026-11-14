---
description: Constraints for React Context, Storybook, UI styling, and localization
globs: "**/*.tsx"
alwaysApply: true
---

# React UI, Context, and Previews (Web)

## 1. UI Localization Enforcement & Semantic Accuracy
- **Dictionary Enforcement:** Hardcoded string literals in production UI components are strictly forbidden. You must use the localization dictionary.
- **Semantic Accuracy:** NEVER reuse unrelated localization keys just to avoid hardcoding (e.g. do not use `strings.action_confirm` for a "Refresh" or "Retry" button). ALWAYS use semantically accurate keys. If a required key is missing from the provided `FeatureStrings` dictionary, use a hardcoded English fallback (e.g. `'Refresh'`) rather than shoehorning an incorrect translation.

## 2. Mandatory Previews (Stories)
- **Requirement:** Every UI component (`*.tsx`) must be accompanied by a Storybook file (`*.stories.tsx`).
- **Context Wrappers:** Stories must wrap components in Mock Providers (e.g., `<AppProvider>`) and inject fake stores/components to isolate the UI state.

## 3. State Hoisting & Side-Effects Isolation
- **No Side-Effects in Store Creation:** NEVER trigger API calls or data fetching directly inside store factory functions (`createStore`).
- **Controller useEffect:** ALWAYS initiate data loading from inside a `useEffect` within the React component or Controller component (e.g., `MyScreenController`) after mount. React components only observe state and dispatch actions.

## 4. UI Component & Screen Dedicated Folder Grouping
- **Strict Single-Folder Grouping:** Every UI component or screen (`*.tsx`) must be placed in its own dedicated subfolder together with its corresponding Unit/UI Test (`*.test.tsx`) and Storybook Preview (`*.stories.tsx`).
- **Directory Structure:**
  - `src/ui/components/<category>/<component-name>/<ComponentName>.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.test.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.stories.tsx`
- **Flat Lists Ban:** Placing multiple UI components or screens directly into a flat parent directory is strictly forbidden.

## 5. Accessibility Mandate (a11y & useId)
- **Form Field IDs (`useId`):** ALWAYS use React's `useId()` hook to generate unique IDs for form fields. Pass these IDs to custom input components (`TextField`, `OutlinedTextField`, `PasswordTextField`, etc.) to ensure `<label>` elements correctly link via `htmlFor`.
- **Keyboard Access:** All interactive elements (clickable cards, items, custom buttons) must be fully navigable via keyboard.
- **Custom Clickable Containers:** If a non-`<button>` container element (e.g. `<div>`) receives a click handler (`onClick` / `onItemClick`):
  - Must conditionally specify `role={onClick ? 'button' : undefined}`.
  - Must specify `tabIndex={onClick ? 0 : undefined}` to participate in tab order.
  - Must specify `onKeyDown` handler to trigger click on `Enter` and `Space` (`' '`) keys.
  - Must include focus indicator styles (e.g., `focus:outline-none focus:ring-2 focus:ring-primary`).

## 6. Screen Store Context Isolation
- **Per-Instance Stores:** Screen-level stores must be created per component instance using `createStore()` (vanilla Zustand) + React Context Provider + `useStore(context, selector)` hook.
- **Lazy Initializer in Provider:** ALWAYS use `useState(() => createMyStore(deps, initialState))` inside Providers. NEVER use `useRef` mutation (`if (!storeRef.current) ...`).
- **No Global Singletons for Screens:** Global `create()` stores are strictly forbidden for screen UI states, form inputs, and step transitions to prevent state leakage across multiple mounted widgets or screens.

## 7. Mandatory Test IDs Mapping
- **TestTags Constants:** ALWAYS map `TestTags` objects directly to a `TestTags` constant object exported in TypeScript (e.g., `export const MyScreenTestTags = { ... }`).
- **data-testid Application:** ALWAYS apply these tags to DOM elements using the `data-testid` attribute (e.g., `data-testid={MyScreenTestTags.SUBMIT_BUTTON}`). This is mandatory for E2E and UI testing.

## 8. Routing Integration & URL Search Parameters
- **Library Agnosticism:** UI Screen components in reusable web libraries must not hardcode router instances or hooks. They receive `searchParams` and navigation callbacks (`onNavigateToX`, `onSearchParamsChanged`) via their `dependencies` prop.
- **URL Parameter Schemas:** Create flat Zod schemas (`*SearchSchema.ts`) using `zod` for components accepting search/query parameters. Include array coercion (`z.union([z.string().transform(v => [v]), z.array(z.string())])`).
- **Search Parameter Callbacks:** The `onSearchParamsChanged` callbacks passed from host router screens must use `replace: true` during `navigate(...)` to prevent creating redundant history stack entries for mere filter/pagination updates.
- **Pure Converters:** Use pure converter functions outside components (`searchParamsToListingStates` / `listingStatesToSearchParams`) to bridge flat URL parameters and complex panel UI states.

## 9. Mandatory Complete Implementation
- **Production-Ready Code Only:** Every UI component, route, and store must be fully implemented with complete production logic, DI context, and proper styling. Generating stubs, placeholders, or dummy components is strictly prohibited unless the developer explicitly asks for a stub.

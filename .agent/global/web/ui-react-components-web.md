---
description: Constraints for React Context, Storybook, UI/UX quality, responsive layout, design tokens, and localization
globs: "**/*.tsx"
alwaysApply: true
---

# React UI, UX, Context, and Previews (Web)

## 1. Design Tokens & SDK Component Reuse
- **Strict Token Enforcement:** Raw Tailwind color palette classes (`text-gray-*`, `bg-white`, `bg-slate-*`, `border-gray-*`, `ring-indigo-*`, etc.) and arbitrary hex values (`bg-[#...]`) are strictly forbidden. Use ONLY semantic design tokens from `@mudrichenkoevgeny/web-platform-sdk-core-common` (`bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-primary`, etc.).
- **Mandatory Core UI Component Reuse:** Always reuse base SDK primitives instead of building custom replacements: `CoreButton`, `CoreTextButton`, `CoreBackButton`, `CoreOutlinedTextField`, `CoreScreenTitleText`, `CoreErrorText`, `CoreIcon`, `FullscreenLoading`, `FullscreenError`, `ListingHeaderBar`, `ListingOptionsPanel`, `PagingFooter`, `ListingEmptyState`.
- **UI Error Formatting:** Format all UI errors using `useAppErrorParser()` from `SdkProvider`.

## 2. Mobile-First Responsive Design & Layout Quality
- **375px Baseline:** Every screen and component MUST render cleanly without horizontal overflow (`overflow-x`) at `375x812` (mobile) and `1440x900` (desktop).
- **Responsive Containers & Headers:**
  - Page padding must scale: use `px-4 py-4 sm:px-6 sm:py-6` (never fixed large paddings like `p-6` or `p-8` on mobile).
  - Headers and toolbars with titles + action buttons MUST wrap or stack on mobile (`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`), never squeeze elements into a single overflowing row.
- **Button Sizing:** Never stretch primary/secondary action buttons to full screen width on desktop. Use `w-full sm:w-auto` for mobile-friendly action buttons.
- **Text Overflow Protection:** All dynamic user-generated strings (titles, descriptions, badges, usernames) MUST be protected against layout breakage using `truncate`, `line-clamp-2`/`line-clamp-3`, and `min-w-0` inside flex/grid containers.
- **Visual Hierarchy & Spacing:** Maintain clear separation between header, filter/control bar, content grid/list, and pagination. Avoid redundant nested borders or heavy boxes around every section.

## 3. UI States & Perceived Performance
- **No Fullscreen Flicker on Refetch:** Use `FullscreenLoading` ONLY for the initial empty load. When refreshing, filtering, sorting, or paginating existing data, keep current items visible and indicate loading via subtle local indicators or skeletons.
- **Complete State Coverage:** Every data-driven screen must properly handle `LOADING`, `ERROR` (with working retry), `EMPTY`, and `CONTENT` states.

## 4. UI Localization Enforcement
- **Zero Hardcoded Text:** Hardcoded string literals in production JSX (including button labels, headings, placeholders, and `aria-label` attributes) are strictly forbidden.
- **Semantic Accuracy:** Never reuse unrelated localization keys to avoid hardcoding. Always check both `commonStrings` and feature-specific string dictionaries. If a required key is genuinely missing from all dictionaries, flag it explicitly in your response instead of silently hardcoding unlocalized text.

## 5. Accessibility Mandate (a11y & useId)
- **Form Field IDs (`useId`):** Always use React's `useId()` hook to generate unique IDs for form fields and link `<label htmlFor={id}>`.
- **Semantic Elements First:** Prefer native `<button>` and `<a>` elements over clickable `<div>` containers.
- **Custom Clickable Containers:** Only when wrapping complex card layouts where a native `<button>` is invalid HTML, apply:
  - `role={onClick ? 'button' : undefined}`
  - `tabIndex={onClick ? 0 : undefined}`
  - `onKeyDown` triggering `onClick` on `Enter` and `Space` (`' '`)
  - Token-based focus ring (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`)

## 6. Visual Verification Step (Browser / Playwright)
- Before considering any new screen or major UI change complete, verify the rendered output in a browser (via Playwright MCP or Storybook preview) at both **`375x812`** (mobile) and **`1440x900`** (desktop).
- Inspect for: horizontal scrollbars, stretched desktop buttons, clipped or colliding text, broken header alignment, raw unstyled elements, and poor contrast. Fix all visual defects before finishing.

## 7. Mandatory Previews (Stories) & Folder Grouping
- **Dedicated Subfolder:** Every UI component or screen (`*.tsx`) must live in its own dedicated subfolder with its test and story:
  - `src/ui/components/<category>/<component-name>/<ComponentName>.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.test.tsx`
  - `src/ui/components/<category>/<component-name>/<ComponentName>.stories.tsx`
- **Flat Lists Ban:** Placing multiple UI components or screens directly into a flat parent directory is strictly forbidden.
- **Stories:** Every component must have a Storybook file wrapping it in Mock Providers (`<AppProvider>`) with isolated mock state, covering default, empty, loading, and error states where applicable.

## 8. State Hoisting & Screen Store Context Isolation
- **No Side-Effects in Store Creation:** Never trigger API calls or data fetching inside `createStore`. Initiate loading inside `useEffect` in the component or controller after mount.
- **Per-Instance Stores:** Screen-level stores must be created per component instance using vanilla Zustand `createStore()` + React Context Provider + `useStore(context, selector)`.
- **Lazy Initializer:** Always use `useState(() => createMyStore(deps, initialState))` inside Providers. Never use `useRef` mutation. Global `create()` singletons are forbidden for screen states.

## 9. TestTags Naming & Application
- **SDK Standard Format:** Export `TestTags` constants using `PascalCase` with an underscore between screen/component name and element name:
  `export const QuizListTestTags = { TITLE: 'QuizList_Title', SUBMIT_BUTTON: 'QuizList_SubmitButton' }`
- **Mandatory Application:** Apply these tags via `data-testid` to all key structural and interactive DOM elements.

## 10. Routing Integration & URL Search Parameters
- **Library Agnosticism:** Reusable screen components must not hardcode router hooks. Receive `searchParams` and navigation callbacks (`onNavigateToX`, `onSearchParamsChanged`) via props/dependencies.
- **URL Parameter Schemas:** Use flat Zod schemas (`*SearchSchema.ts`) with array coercion (`z.union([z.string().transform(v => [v]), z.array(z.string())])`).
- **Search Parameter Callbacks:** Host router callbacks for filter/pagination updates must use `replace: true`.
- **Pure Converters:** Use pure converter functions outside components (`searchParamsToListingStates` / `listingStatesToSearchParams`).

## 11. Mandatory Complete Implementation
- **Production-Ready Code Only:** Every component, route, and store must be fully implemented with complete logic, DI context, and styling. Stubs and placeholders are prohibited unless explicitly requested.

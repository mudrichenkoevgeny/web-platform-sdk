---
description: Typed dictionary layout, naming conventions, and UI usage rules
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# Localization (Web)

## 1. Structure
- UI strings are defined as typed dictionaries in `src/locales/[lang]/strings.ts`.
- **Default:** English is the primary source of truth.

## 2. Naming Conventions
- Prefix by domain:
  - `error_common_*`
  - `error_feature_*`
  - `ui_feature_button_action`

## 3. UI Usage Enforcement & Semantic Accuracy
- **Production UI:** Hardcoded string literals in production React components are strictly forbidden. Use the translation hook/dictionary (e.g., `t('ui_feature_button_action')`).
- **Semantic Accuracy:** NEVER reuse unrelated localization keys just to avoid hardcoding (e.g., do not use `strings.secondary_action` for a "Refresh" or "Retry" button). ALWAYS use semantically accurate keys. If a required key is missing from the provided `FeatureStrings` dictionary, use a hardcoded English fallback (e.g. `'Refresh'`) rather than shoehorning an incorrect translation.
- **Tests & Stories Exception:** Raw strings are permitted only in `.test.tsx` and `.stories.tsx`.

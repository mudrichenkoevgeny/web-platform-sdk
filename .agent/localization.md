---
description: Typed dictionary layout, naming conventions, and UI usage rules
globs: "**/*.ts, **/*.tsx"
alwaysApply: true
---

# Localization

## 1. Structure
- UI strings are defined as typed dictionaries in `src/locales/[lang]/strings.ts`.
- **Default:** English is the primary source of truth.

## 2. Naming Conventions
- Prefix by domain:
  - `error_common_*`
  - `error_user_*`
  - `ui_user_button_login`

## 3. UI Usage Enforcement & Semantic Accuracy
- **Production UI:** Hardcoded string literals in production React components are strictly forbidden. Use the translation hook/dictionary (e.g., `t('ui_user_button_login')`).
- **Semantic Accuracy:** NEVER reuse unrelated localization keys just to avoid hardcoding (e.g., do not use `strings.resend_code` for a "Refresh" or "Retry" button). ALWAYS use semantically accurate keys. If a required key is missing from the provided `FeatureStrings` dictionary, use a hardcoded English fallback (e.g. `'Refresh'`) rather than shoehorning an incorrect translation.
- **Tests & Stories Exception:** Raw strings are permitted only in `.test.tsx` and `.stories.tsx`.

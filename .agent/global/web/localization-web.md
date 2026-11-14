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
- **Production UI:** Hardcoded string literals in production React components are strictly forbidden. Always use the translation hook/dictionary (e.g., `t('ui_feature_button_action')` or typed `strings.*` properties).
- **Semantic Accuracy:** NEVER reuse unrelated localization keys just to avoid adding a proper key (e.g., do not use `strings.secondary_action` or `strings.resend_code` for a "Refresh" or "Retry" button). ALWAYS use semantically accurate keys. If a required key is missing from the `FeatureStrings` interface/dictionary, add the new semantically accurate key across all supported locale dictionaries (or, if the dictionary comes from an external read-only package, extend it or provide a localized prop rather than misusing an unrelated key).
- **Tests & Stories Exception:** Raw strings are permitted only in `.test.tsx` and `.stories.tsx`.
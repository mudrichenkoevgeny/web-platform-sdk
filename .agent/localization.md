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

## 3. UI Usage Enforcement
- **Production UI:** Hardcoded string literals in production React components are strictly forbidden. Use the translation hook/dictionary (e.g., `t('ui_user_button_login')`).
- **Tests & Stories Exception:** Raw strings are permitted only in `.test.tsx` and `.stories.tsx`.
We have updated `@mudrichenkoevgeny/shared-foundation` to version `0.0.70`. It now exports global dynamic singletons (`commonStrings`, `userStrings`, `securityStrings`, `sharedLocalization`) and a global configurator `SharedLocalization` (`SharedLocalization.setLocale(locale)`, `SharedLocalization.getLocale()`).

Refactor the localization implementation across the entire web workspace according to the following strict rules:

### 1. Upgrade Dependency
Ensure `@mudrichenkoevgeny/shared-foundation` is updated to `^0.0.70` (or the latest local build if linked) across all `package.json` files.

### 2. Refactor `LocalizationProvider` & `LocalizationContext` for Hot Locale Switching
In `LocalizationContext.tsx`:
- When `locale` prop changes, synchronously update the global locale before children render: `SharedLocalization.setLocale(locale)`.
- Wrap `{children}` in `<React.Fragment key={locale}>{children}</React.Fragment>` inside `LocalizationProvider` so that changing `locale` at runtime immediately forces React to re-render the subtree and pull fresh strings from the global singletons without requiring hooks in every UI component.
- Expose `{ locale, setLocale, localization: sharedLocalization }` via `LocalizationContext` so any language switcher UI can read the current locale and trigger a language change on the fly.

Example structure for `LocalizationProvider`:

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
SharedFoundationLocalization,
SharedLocalization,
sharedLocalization
} from '@mudrichenkoevgeny/shared-foundation'

export interface LocalizationContextValue {
locale: string
setLocale: (locale: string) => void
localization: SharedFoundationLocalization
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null)

export interface LocalizationProviderProps {
locale?: string
children: React.ReactNode
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
locale: initialLocale = 'en',
children
}) => {
const [locale, setLocaleState] = useState(initialLocale)

useEffect(() => {
setLocaleState(initialLocale)
}, [initialLocale])

SharedLocalization.setLocale(locale)

const contextValue = useMemo<LocalizationContextValue>(
() => ({
locale,
setLocale: (nextLocale: string) => {
SharedLocalization.setLocale(nextLocale)
setLocaleState(nextLocale)
},
localization: sharedLocalization
}),
[locale]
)

return (
<LocalizationContext.Provider value={contextValue}>
<React.Fragment key={locale}>{children}</React.Fragment>
</LocalizationContext.Provider>
)
}

export const useLocalization = (): LocalizationContextValue => {
const context = useContext(LocalizationContext)
if (!context) {
throw new Error('useLocalization must be used within a LocalizationProvider')
}
return context
}

### 3. Eliminate All Manual Class Instantiations (`new ...ModuleStrings()`)
Search the entire repository for `new CommonModuleStrings()`, `new UserModuleStrings()`, `new SecurityModuleStrings()`, and `new SharedFoundationLocalization()`.
- Delete all file-level constants like `const defaultCommonStrings = new CommonModuleStrings()`, `const defaultUserStrings = new UserModuleStrings()`, `const defaultSecurityStrings = new SecurityModuleStrings()`.
- Replace them with direct imports of the ready-made singletons from `@mudrichenkoevgeny/shared-foundation`:
  `import { commonStrings, userStrings, securityStrings } from '@mudrichenkoevgeny/shared-foundation'`
- In React components (`CoreBackButton`, `CoreEmailTextField`, `ListingEmptyState`, `ListingHeaderBar`, `ListingChoiceDropdown`, `ListingOptionsPanel`, `PagingFooter`, `FullscreenLoading`, `FullscreenOverlayLoading`, `LoginByPhoneScreen`, `MainScreen`, `HomeScreen`, routes, etc.), read strings directly from `commonStrings.ui.*` or `userStrings.ui.*` during render.
- In `CommonErrorParser` and `SecurityErrorParser`, default constructor parameter `stringsOrGetter` to `commonStrings` and `securityStrings` respectively instead of instantiating `new ...ModuleStrings()`.

### 4. Fix Static Module-Level Configurations (Getters Required)
Never evaluate `userStrings.ui.*` or `commonStrings.ui.*` eagerly inside module-level static objects/arrays (outside of React render functions), because they will only evaluate once when the JS bundle loads and won't update on locale change.
- In `mainScreenDestinations`, convert static properties to getters:

export const mainScreenDestinations: Record<MainTabKey, MainScreenDestination> = {
management: {
key: 'management',
get label() {
return userStrings.ui.managementSettingsTitle
},
Icon: icons.home
},
user: {
key: 'user',
get label() {
return userStrings.ui.user
},
Icon: icons.user
}
}

Check all other route configs, filter definitions, or tab definitions for similar eager evaluations and convert them to getters or functions.

### 5. Fix Specific Issues Found in Code Review
1. Unused Imports: Remove unused `formatLocalizedString` imports in `LoginByPhoneScreen.tsx`, `ListingChoiceDropdown.tsx`, and `PagingFooter.tsx`.
2. `ListingChoiceDropdown.tsx`: Replace `formatLocalizedString(defaultCommonStrings.ui.selectedCount, selectedOptions.length)` with direct singleton method call `commonStrings.ui.selectedCount(selectedOptions.length)`.
3. Import Paths: Replace `@/assets/icons/index.js` with `@/assets/icons` in `CoreBackButton.tsx`, `ListingEmptyState.tsx`, and `ListingHeaderBar.tsx`.
4. Type-Only Imports: In `ComponentTestHarness.tsx`, change `import { CommonComponent }` to `import type { CommonComponent }`.
5. `ListingOptionsPanel.tsx`:
  - Fix sort direction toggle bug on line 66: use `isAscending: !(sortState?.isAscending ?? false)`.
  - Replace `if (filter.type === ...)` chain with an exhaustive `switch (filter.type)`.
  - Replace incorrect localization keys: use proper sort/filter keys instead of `defaultCommonStrings.ui.status` for the sort label and `defaultCommonStrings.ui.apply` in `ListingHeaderBar`.

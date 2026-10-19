import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  CommonLocales,
  SharedFoundationLocalization,
  SharedLocalization,
  sharedLocalization
} from '@mudrichenkoevgeny/shared-foundation'

/** Context value exposed by {@link LocalizationProvider}. */
export interface LocalizationContextValue {
  /** Active language/locale tag (e.g., {@link CommonLocales.ENGLISH}, {@link CommonLocales.RUSSIAN}). */
  locale: string
  /** Triggers runtime locale switch and updates global singletons. */
  setLocale: (locale: string) => void
  /** Resolved {@link SharedFoundationLocalization} instance. */
  localization: SharedFoundationLocalization
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null)

/** Props for {@link LocalizationProvider}. */
export interface LocalizationProviderProps {
  /** Target language/locale tag (e.g., {@link CommonLocales.ENGLISH}, {@link CommonLocales.RUSSIAN}). Defaults to {@link CommonLocales.ENGLISH}. */
  locale?: string
  /** React component child subtree. */
  children: React.ReactNode
}

/**
 * React context provider supplying localization state and global singletons to all children.
 *
 * @param props - Provider properties
 * @returns JSX Element wrapping children with localization context
 */
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  locale: initialLocale = CommonLocales.ENGLISH,
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

/**
 * React hook retrieving the current {@link LocalizationContextValue} from context.
 *
 * @returns Resolved {@link LocalizationContextValue} context value
 * @throws Error if called outside of {@link LocalizationProvider}
 */
export const useLocalization = (): LocalizationContextValue => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider')
  }
  return context
}

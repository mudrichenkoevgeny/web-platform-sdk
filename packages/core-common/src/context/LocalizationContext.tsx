import React, { createContext, useContext, useMemo } from 'react'
import { SharedFoundationLocalization } from '@mudrichenkoevgeny/shared-foundation'

const LocalizationContext = createContext<SharedFoundationLocalization | null>(null)

/** Props for {@link LocalizationProvider}. */
export interface LocalizationProviderProps {
  /** Target language/locale tag (e.g., 'en', 'ru'). Defaults to 'en'. */
  locale?: string
  /** React component child subtree. */
  children: React.ReactNode
}

/**
 * React context provider supplying SharedFoundationLocalization to all children.
 *
 * @param props - Provider properties
 * @returns JSX Element wrapping children with localization context
 */
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  locale = 'en',
  children
}) => {
  const localization = useMemo(
    () => new SharedFoundationLocalization(undefined, locale),
    [locale]
  )

  return (
    <LocalizationContext.Provider value={localization}>
      {children}
    </LocalizationContext.Provider>
  )
}

/**
 * React hook retrieving the current {@link SharedFoundationLocalization} instance from context.
 *
 * @returns Resolved {@link SharedFoundationLocalization} instance
 * @throws Error if called outside of {@link LocalizationProvider}
 */
export const useLocalization = (): SharedFoundationLocalization => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider')
  }
  return context
}

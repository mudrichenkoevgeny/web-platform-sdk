import React, { forwardRef } from 'react'
import type { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { FeatureUserStrings } from '@/locales/index'
import { AuthProviderItem } from '@/item/AuthProviderItem'

/**
 * Props for the {@link AuthProviderGrid} component.
 */
export interface AuthProviderGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * List of authentication providers to display as tile buttons.
   */
  authProviders: readonly UserAuthProvider[]
  /**
   * Callback invoked when a provider tile is clicked.
   */
  onProviderClick: (provider: UserAuthProvider) => void
  /**
   * Disabled state for all provider tile buttons in the grid.
   */
  disabled?: boolean
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Wraps authentication providers in a flexible grid layout of compact icon buttons.
 */
export const AuthProviderGrid = forwardRef<HTMLDivElement, AuthProviderGridProps>(
  (
    {
      authProviders,
      onProviderClick,
      disabled = false,
      strings,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center justify-center gap-2 w-full', className)}
        {...rest}
      >
        {authProviders.map((provider) => (
          <AuthProviderItem
            key={provider}
            authProvider={provider}
            onClick={() => onProviderClick(provider)}
            disabled={disabled}
            strings={strings}
          />
        ))}
      </div>
    )
  }
)

AuthProviderGrid.displayName = 'AuthProviderGrid'

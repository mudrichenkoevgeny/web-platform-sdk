import React, { forwardRef } from 'react'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";

/**
 * Props for the {@link AuthProviderItem} component.
 */
export interface AuthProviderItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Target authentication provider.
   */
  authProvider: UserAuthProvider
  /**
   * Event handler triggered when tile is clicked.
   */
  onClick?: () => void
  /**
   * Disabled state of the tile button.
   */
  disabled?: boolean
  /**
   * Localized strings dictionary override for accessibility label.
   */
  strings?: FeatureUserStrings
}

function getAuthProviderIcon(authProvider: UserAuthProvider): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return icons.email
    case UserAuthProvider.PHONE:
      return icons.phone
    case UserAuthProvider.GOOGLE:
      return icons.google
    case UserAuthProvider.APPLE:
      return icons.apple
    default:
      return icons.email
  }
}

function getAuthProviderTitle(authProvider: UserAuthProvider, strings: FeatureUserStrings): string {
  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return strings.sign_in_with_email
    case UserAuthProvider.PHONE:
      return strings.sign_in_with_phone
    case UserAuthProvider.GOOGLE:
      return strings.sign_in_with_google
    case UserAuthProvider.APPLE:
      return strings.sign_in_with_apple
    default:
      return strings.sign_in_with_email
  }
}

/**
 * Compact square tile showing only the authentication provider icon.
 */
export const AuthProviderItem = forwardRef<HTMLButtonElement, AuthProviderItemProps>(
  (
    {
      authProvider,
      onClick,
      disabled = false,
      strings = enUserStrings,
      className,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const IconComponent = getAuthProviderIcon(authProvider)
    const title = getAuthProviderTitle(authProvider, strings)

    const iconClassName = cn(
      authProvider === UserAuthProvider.GOOGLE ? '' : 'text-primary-foreground',
      authProvider === UserAuthProvider.APPLE ? 'scale-105 -translate-y-px' : ''
    )

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
        title={title}
        className={cn(
          'h-core-button w-core-button rounded-lg bg-primary text-primary-foreground flex items-center justify-center p-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0',
          className
        )}
        {...rest}
      >
        <CoreIcon src={IconComponent} size={22} alt={title} className={iconClassName} />
      </button>
    )
  }
)

AuthProviderItem.displayName = 'AuthProviderItem'

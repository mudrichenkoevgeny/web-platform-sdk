import React, { forwardRef } from 'react'
import { UserAuthProvider, UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'

const defaultUserStrings = new UserModuleStrings()

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
  strings?: UserModuleStrings
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

function getAuthProviderTitle(authProvider: UserAuthProvider, strings: UserModuleStrings): string {
  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return strings.ui.signInWithEmail
    case UserAuthProvider.PHONE:
      return strings.ui.signInWithPhone
    case UserAuthProvider.GOOGLE:
      return strings.ui.signInWithGoogle
    case UserAuthProvider.APPLE:
      return strings.ui.signInWithApple
    default:
      return strings.ui.signInWithEmail
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
      strings = defaultUserStrings,
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

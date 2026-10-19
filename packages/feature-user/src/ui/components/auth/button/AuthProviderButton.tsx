import { forwardRef } from 'react'
import { UserAuthProvider, UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/auth-provider-button-mode'

/**
 * Props for the {@link AuthProviderButton} component.
 */
export interface AuthProviderButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Target authentication provider.
   */
  authProvider: UserAuthProvider
  /**
   * Event handler triggered when button is clicked.
   */
  onClick?: () => void
  /**
   * Disabled state of the button.
   */
  disabled?: boolean
  /**9
   * Label formatting mode (sign-in vs add identifier).
   */
  mode?: AuthProviderButtonMode
  /**
   * Localized strings dictionary override.
   */
  strings?: UserModuleStrings
}

/**
 * Resolves the icon component associated with an authentication provider.
 *
 * @param authProvider - Target authentication provider
 * @returns SVG Icon component for the specified provider
 */
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

/**
 * Resolves localized button label text for an authentication provider and button mode.
 *
 * @param authProvider - Target authentication provider
 * @param mode - Button display mode (Sign-in or Add identifier)
 * @param strings - User module localized strings dictionary
 * @returns Localized button label string
 */
function getAuthProviderText(
  authProvider: UserAuthProvider,
  mode: AuthProviderButtonMode,
  strings: UserModuleStrings
): string {
  if (mode === AuthProviderButtonMode.SIGN_IN) {
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

  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return strings.ui.identifierAddEmail
    case UserAuthProvider.PHONE:
      return strings.ui.identifierAddPhone
    case UserAuthProvider.GOOGLE:
      return strings.ui.identifierAddGoogle
    case UserAuthProvider.APPLE:
      return strings.ui.identifierAddApple
    default:
      return strings.ui.identifierAddEmail
  }
}

/**
 * Full-width button for a single authentication provider displaying an icon and localized label.
 */
export const AuthProviderButton = forwardRef<HTMLButtonElement, AuthProviderButtonProps>(
  (
    {
      authProvider,
      onClick,
      disabled = false,
      mode = AuthProviderButtonMode.SIGN_IN,
      strings = userStrings,
      className,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const IconComponent = getAuthProviderIcon(authProvider)
    const labelText = getAuthProviderText(authProvider, mode, strings)

    const iconClassName = cn(
      authProvider === UserAuthProvider.GOOGLE ? '' : 'text-primary-foreground',
      authProvider === UserAuthProvider.APPLE ? 'scale-110 -translate-y-px' : ''
    )

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'w-full h-core-button rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          className
        )}
        {...rest}
      >
        <CoreIcon src={IconComponent} size={20} className={iconClassName} />
        <span>{labelText}</span>
      </button>
    )
  }
)

AuthProviderButton.displayName = 'AuthProviderButton'

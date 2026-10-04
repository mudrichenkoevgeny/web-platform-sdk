import { forwardRef } from 'react'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { cn, CoreIcon } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { icons } from '@/assets/icons/index'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import { AuthProviderButtonMode } from '@/ui/components/auth/button/AuthProviderButtonMode'
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
  /**
   * Label formatting mode (sign-in vs add identifier).
   */
  mode?: AuthProviderButtonMode
  /**
   * Localized strings dictionary override.
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

function getAuthProviderText(
  authProvider: UserAuthProvider,
  mode: AuthProviderButtonMode,
  strings: FeatureUserStrings
): string {
  if (mode === AuthProviderButtonMode.SIGN_IN) {
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

  switch (authProvider) {
    case UserAuthProvider.EMAIL:
      return strings.identifier_add_email
    case UserAuthProvider.PHONE:
      return strings.identifier_add_phone
    case UserAuthProvider.GOOGLE:
      return strings.identifier_add_google
    case UserAuthProvider.APPLE:
      return strings.identifier_add_apple
    default:
      return strings.identifier_add_email
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
      strings = enUserStrings,
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
      authProvider === UserAuthProvider.APPLE ? 'scale-[1.08] -translate-y-[1px]' : ''
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

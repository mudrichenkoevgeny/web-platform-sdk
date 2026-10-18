import React, { forwardRef } from 'react'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const defaultUserStrings = new UserModuleStrings()

/**
 * Props for the {@link LegalFooter} component.
 */
export interface LegalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to display the Privacy Policy link.
   */
  isPrivacyPolicyVisible?: boolean
  /**
   * Whether to display the Terms of Service link.
   */
  isTermsOfServiceVisible?: boolean
  /**
   * Event handler triggered when Privacy Policy link is clicked.
   */
  onPrivacyPolicyClick?: () => void
  /**
   * Event handler triggered when Terms of Service link is clicked.
   */
  onTermsOfServiceClick?: () => void
  /**
   * Localized strings dictionary override.
   */
  strings?: UserModuleStrings
}

/**
 * Footer block for legal links (Privacy Policy and Terms of Service).
 */
export const LegalFooter = forwardRef<HTMLDivElement, LegalFooterProps>(
  (
    {
      isPrivacyPolicyVisible = true,
      isTermsOfServiceVisible = true,
      onPrivacyPolicyClick,
      onTermsOfServiceClick,
      strings = defaultUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    if (!isPrivacyPolicyVisible && !isTermsOfServiceVisible) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'w-full px-4 text-center text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-1',
          className
        )}
        {...rest}
      >
        <span>{strings.ui.legalAgreementPrefix}</span>
        {isPrivacyPolicyVisible && (
          <button
            type="button"
            onClick={onPrivacyPolicyClick}
            className="text-primary underline hover:opacity-80 transition-opacity font-medium focus:outline-none"
          >
            {strings.ui.privacyPolicy}
          </button>
        )}
        {isPrivacyPolicyVisible && isTermsOfServiceVisible && (
          <span>{strings.ui.and}</span>
        )}
        {isTermsOfServiceVisible && (
          <button
            type="button"
            onClick={onTermsOfServiceClick}
            className="text-primary underline hover:opacity-80 transition-opacity font-medium focus:outline-none"
          >
            {strings.ui.termsOfService}
          </button>
        )}
      </div>
    )
  }
)

LegalFooter.displayName = 'LegalFooter'

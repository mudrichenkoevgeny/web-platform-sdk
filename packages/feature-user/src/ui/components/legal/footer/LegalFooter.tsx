import React, { forwardRef } from 'react'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";

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
  strings?: FeatureUserStrings
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
      strings = enUserStrings,
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
        <span>{strings.legal_agreement_prefix}</span>
        {isPrivacyPolicyVisible && (
          <button
            type="button"
            onClick={onPrivacyPolicyClick}
            className="text-primary underline hover:opacity-80 transition-opacity font-medium focus:outline-none"
          >
            {strings.privacy_policy}
          </button>
        )}
        {isPrivacyPolicyVisible && isTermsOfServiceVisible && (
          <span>{strings.and}</span>
        )}
        {isTermsOfServiceVisible && (
          <button
            type="button"
            onClick={onTermsOfServiceClick}
            className="text-primary underline hover:opacity-80 transition-opacity font-medium focus:outline-none"
          >
            {strings.terms_of_service}
          </button>
        )}
      </div>
    )
  }
)

LegalFooter.displayName = 'LegalFooter'

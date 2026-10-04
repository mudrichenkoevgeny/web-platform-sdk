import React, { forwardRef, useEffect } from 'react'
import {
  cn,
  CoreBodyText,
  CoreErrorText,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings, FeatureUserStrings } from '@/locales/index'
import { AuthProviderButton } from '@/ui/components/auth/button/AuthProviderButton'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/AuthProviderButtonMode'
import { AuthProviderGrid } from '@/ui/components/auth/grid/AuthProviderGrid'
import { LegalFooter } from '@/ui/components/legal/footer/LegalFooter'
import {
  LoginWelcomeProvider,
  LoginWelcomeStoreDependencies,
  useLoginWelcomeStore
} from './LoginWelcomeStore'

/**
 * Internal content component rendering login welcome UI states (loading, error, providers list, legal footer).
 */
const LoginWelcomeContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useLoginWelcomeStore((s) => s.screenState)
  const onRetryInitClick = useLoginWelcomeStore((s) => s.onRetryInitClick)
  const onLoginClick = useLoginWelcomeStore((s) => s.onLoginClick)
  const onPrivacyPolicyClick = useLoginWelcomeStore((s) => s.onPrivacyPolicyClick)
  const onTermsOfServiceClick = useLoginWelcomeStore((s) => s.onTermsOfServiceClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'initialization_error') {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={onRetryInitClick}
      />
    )
  }

  const {
    availableAuthProviders,
    privacyPolicyUrl,
    termsOfServiceUrl,
    actionError,
    actionLoading
  } = screenState

  const validPrivacyUrl = privacyPolicyUrl && privacyPolicyUrl.trim() !== '' ? privacyPolicyUrl : null
  const validTermsUrl = termsOfServiceUrl && termsOfServiceUrl.trim() !== '' ? termsOfServiceUrl : null

  const hasPrimary = availableAuthProviders.primary.length > 0
  const hasSecondary = availableAuthProviders.secondary.length > 0

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-between relative overflow-y-auto">
      <CoreScreenTitleText text={strings.sign_in} className="mb-4" />

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-2">
        {availableAuthProviders.primary.map((provider) => (
          <AuthProviderButton
            key={provider}
            authProvider={provider}
            mode={AuthProviderButtonMode.SIGN_IN}
            onClick={() => onLoginClick(provider)}
            strings={strings}
            className="mb-2"
          />
        ))}

        {hasPrimary && hasSecondary && (
          <CoreBodyText text={strings.or_sign_in_with} className="my-3 text-xs text-muted-foreground uppercase font-medium" />
        )}

        <AuthProviderGrid
          authProviders={availableAuthProviders.secondary}
          onProviderClick={onLoginClick}
          strings={strings}
        />

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            actionError ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {actionError && (
            <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>
      </div>

      <LegalFooter
        isPrivacyPolicyVisible={Boolean(validPrivacyUrl)}
        isTermsOfServiceVisible={Boolean(validTermsUrl)}
        onPrivacyPolicyClick={onPrivacyPolicyClick}
        onTermsOfServiceClick={onTermsOfServiceClick}
        strings={strings}
        className="mt-4"
      />

      {actionLoading && <FullscreenOverlayLoading />}
    </div>
  )
}

/**
 * Internal controller component triggering screen initialization on mount.
 */
const LoginWelcomeController: React.FC<{ strings?: FeatureUserStrings }> = ({ strings }) => {
  const initScreen = useLoginWelcomeStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <LoginWelcomeContent strings={strings} />
}

/**
 * Props for the {@link LoginWelcomeScreen} component.
 */
export interface LoginWelcomeScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for state and navigation.
   */
  dependencies: LoginWelcomeStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Login welcome screen displaying available sign-in providers, legal links, and OAuth actions.
 */
export const LoginWelcomeScreen = forwardRef<HTMLDivElement, LoginWelcomeScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <LoginWelcomeProvider dependencies={dependencies}>
          <LoginWelcomeController strings={strings} />
        </LoginWelcomeProvider>
      </div>
    )
  }
)

LoginWelcomeScreen.displayName = 'LoginWelcomeScreen'

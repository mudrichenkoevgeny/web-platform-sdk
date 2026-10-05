import React, { forwardRef } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreEmailTextField,
  CoreErrorText,
  CorePasswordTextField,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  LoginByEmailProvider,
  useLoginByEmailStore
} from '@/ui/screens/auth/login/email/login-by-email-store'
import type { LoginByEmailStoreDependencies } from "@/ui/screens/auth/login/email/login-by-email-store";

const LoginByEmailContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useLoginByEmailStore((s) => s.screenState)
  const onEmailChanged = useLoginByEmailStore((s) => s.onEmailChanged)
  const onPasswordChanged = useLoginByEmailStore((s) => s.onPasswordChanged)
  const onTogglePasswordVisibility = useLoginByEmailStore((s) => s.onTogglePasswordVisibility)
  const onLoginClick = useLoginByEmailStore((s) => s.onLoginClick)
  const onForgotPasswordClick = useLoginByEmailStore((s) => s.onForgotPasswordClick)
  const onRegistrationClick = useLoginByEmailStore((s) => s.onRegistrationClick)
  const onBackClick = useLoginByEmailStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  const {
    email,
    isEmailValid,
    password,
    isPasswordValid,
    isPasswordVisible,
    isRegistrationAvailable,
    actionLoading,
    actionError
  } = screenState

  const canLogin = isEmailValid && isPasswordValid && !actionLoading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLoginClick()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          disabled={actionLoading}
        />
        <CoreScreenTitleText
          text={strings.login_by_email}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <CoreEmailTextField
          value={email}
          onChange={(e) => onEmailChanged(e.target.value)}
          label={strings.email}
          placeholder={strings.email}
          isError={Boolean(actionError)}
          disabled={actionLoading}
        />

        <CorePasswordTextField
          value={password}
          onChange={(e) => onPasswordChanged(e.target.value)}
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          label={strings.password}
          placeholder={strings.password}
          isError={Boolean(actionError)}
          disabled={actionLoading}
        />

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            actionError ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {actionError && (
            <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>

        <div className="flex justify-end">
          <CoreTextButton
            type="button"
            label={strings.forgot_password}
            onClick={onForgotPasswordClick}
            disabled={actionLoading}
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <CoreButton
          type="submit"
          label={strings.login}
          disabled={!canLogin}
          onClick={onLoginClick}
        />

        {isRegistrationAvailable && (
          <CoreTextButton
            type="button"
            label={strings.no_account_register}
            onClick={onRegistrationClick}
            disabled={actionLoading}
          />
        )}
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

/**
 * Props for the {@link LoginByEmailScreen} component.
 */
export interface LoginByEmailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for state management and navigation.
   */
  dependencies: LoginByEmailStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for email and password authentication.
 */
export const LoginByEmailScreen = forwardRef<HTMLDivElement, LoginByEmailScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <LoginByEmailProvider dependencies={dependencies}>
          <LoginByEmailContent strings={strings} />
        </LoginByEmailProvider>
      </div>
    )
  }
)

LoginByEmailScreen.displayName = 'LoginByEmailScreen'

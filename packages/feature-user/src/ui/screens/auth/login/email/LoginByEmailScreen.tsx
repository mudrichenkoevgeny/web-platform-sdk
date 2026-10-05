import React, { forwardRef, useId } from 'react'
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
import type { FeatureUserStrings } from '@/locales/index'
import {
  LoginByEmailProvider,
  useLoginByEmailStore
} from '@/ui/screens/auth/login/email/login-by-email-store'
import type { LoginByEmailStoreDependencies } from '@/ui/screens/auth/login/email/login-by-email-store'

export const LoginByEmailTestTags = {
  BACK_BUTTON: 'LoginByEmail_BackButton',
  TITLE: 'LoginByEmail_Title',
  EMAIL_INPUT: 'LoginByEmail_EmailInput',
  PASSWORD_INPUT: 'LoginByEmail_PasswordInput',
  ACTION_ERROR_TEXT: 'LoginByEmail_ActionErrorText',
  FORGOT_PASSWORD_BUTTON: 'LoginByEmail_ForgotPasswordButton',
  LOGIN_BUTTON: 'LoginByEmail_LoginButton',
  REGISTER_BUTTON: 'LoginByEmail_RegisterButton'
}

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

  const emailId = useId()
  const passwordId = useId()

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
          data-testid={LoginByEmailTestTags.BACK_BUTTON}
          onClick={onBackClick}
          disabled={actionLoading}
        />
        <CoreScreenTitleText
          data-testid={LoginByEmailTestTags.TITLE}
          text={strings.login_by_email}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <CoreEmailTextField
          id={emailId}
          data-testid={LoginByEmailTestTags.EMAIL_INPUT}
          value={email}
          onChange={(e) => onEmailChanged(e.target.value)}
          label={strings.email}
          placeholder={strings.email}
          isError={Boolean(actionError)}
          disabled={actionLoading}
        />

        <CorePasswordTextField
          id={passwordId}
          data-testid={LoginByEmailTestTags.PASSWORD_INPUT}
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
            <CoreErrorText data-testid={LoginByEmailTestTags.ACTION_ERROR_TEXT} text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>

        <div className="flex justify-end">
          <CoreTextButton
            type="button"
            data-testid={LoginByEmailTestTags.FORGOT_PASSWORD_BUTTON}
            label={strings.forgot_password}
            onClick={onForgotPasswordClick}
            disabled={actionLoading}
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <CoreButton
          type="submit"
          data-testid={LoginByEmailTestTags.LOGIN_BUTTON}
          label={strings.login}
          disabled={!canLogin}
          onClick={onLoginClick}
        />

        {isRegistrationAvailable && (
          <CoreTextButton
            type="button"
            data-testid={LoginByEmailTestTags.REGISTER_BUTTON}
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

export interface LoginByEmailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: LoginByEmailStoreDependencies
  strings?: FeatureUserStrings
}

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

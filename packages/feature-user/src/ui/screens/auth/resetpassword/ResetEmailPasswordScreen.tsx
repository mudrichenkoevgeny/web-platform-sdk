import React, { forwardRef } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreCodeTextField,
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
  ResetEmailPasswordProvider,
  useResetEmailPasswordStore
} from '@/ui/screens/auth/resetpassword/ResetEmailPasswordStore'
import type { ResetEmailPasswordStoreDependencies } from "@/ui/screens/auth/resetpassword/ResetEmailPasswordStore";

const EmailInputStep: React.FC<{ strings: FeatureUserStrings }> = ({ strings }) => {
  const screenState = useResetEmailPasswordStore((s) => s.screenState)
  const onEmailChanged = useResetEmailPasswordStore((s) => s.onEmailChanged)
  const onSendCodeClick = useResetEmailPasswordStore((s) => s.onSendCodeClick)
  const onBackClick = useResetEmailPasswordStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status !== 'email_input') {
    return null
  }

  const { email, isEmailValid, actionLoading, actionError } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEmailValid) {
      onSendCodeClick()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} disabled={actionLoading} />
        <CoreScreenTitleText
          text={strings.reset_password}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <CoreEmailTextField
          data-testid="ResetEmailPassword_EmailInput"
          value={email}
          onChange={(e) => onEmailChanged(e.target.value)}
          label={strings.email}
          placeholder={strings.email}
          isError={Boolean(actionError)}
          disabled={actionLoading}
          autoFocus
        />

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            actionError ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {actionError && (
            <CoreErrorText data-testid="ResetEmailPassword_EmailStepErrorText" text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <CoreButton
          data-testid="ResetEmailPassword_SendCodeButton"
          type="submit"
          label={strings.send_code}
          disabled={!isEmailValid || actionLoading}
          onClick={onSendCodeClick}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

const ResetInputStep: React.FC<{ strings: FeatureUserStrings }> = ({ strings }) => {
  const screenState = useResetEmailPasswordStore((s) => s.screenState)
  const onCodeChanged = useResetEmailPasswordStore((s) => s.onCodeChanged)
  const onPasswordChanged = useResetEmailPasswordStore((s) => s.onPasswordChanged)
  const onTogglePasswordVisibility = useResetEmailPasswordStore((s) => s.onTogglePasswordVisibility)
  const onConfirmResetClick = useResetEmailPasswordStore((s) => s.onConfirmResetClick)
  const onSendCodeClick = useResetEmailPasswordStore((s) => s.onSendCodeClick)
  const onResetEmailClick = useResetEmailPasswordStore((s) => s.onResetEmailClick)
  const onBackClick = useResetEmailPasswordStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status !== 'reset_input') {
    return null
  }

  const {
    email,
    code,
    newPassword,
    isPasswordValid,
    isPasswordVisible,
    codeLength,
    resendTimerSeconds,
    actionLoading,
    actionError
  } = screenState

  const isCodeFullLength = code.length === codeLength
  const canConfirm = isCodeFullLength && isPasswordValid && !actionLoading
  const canResendCode = resendTimerSeconds === 0 && !actionLoading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canConfirm) {
      onConfirmResetClick()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} disabled={actionLoading} />
        <CoreScreenTitleText
          text={strings.enter_confirmation_code}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <p className="text-center text-muted-foreground text-sm">
          {strings.code_sent_to(email)}
        </p>

        <CoreCodeTextField
          data-testid="ResetEmailPassword_CodeInput"
          value={code}
          onChange={(e) => onCodeChanged(e.target.value)}
          label={strings.confirmation_code}
          placeholder={strings.confirmation_code}
          isError={Boolean(actionError)}
          disabled={actionLoading}
          autoFocus
        />

        <CorePasswordTextField
          data-testid="ResetEmailPassword_PasswordInput"
          value={newPassword}
          onChange={(e) => onPasswordChanged(e.target.value)}
          isPasswordVisible={isPasswordVisible}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          label={strings.new_password}
          placeholder={strings.new_password}
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
            <CoreErrorText data-testid="ResetEmailPassword_ResetStepErrorText" text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>

        <div className="flex justify-center text-xs text-muted-foreground pt-1">
          {resendTimerSeconds > 0 ? (
            <span>{strings.resend_code_timer(resendTimerSeconds)}</span>
          ) : (
            <CoreTextButton
              data-testid="ResetEmailPassword_ResendButton"
              type="button"
              label={strings.resend_code}
              onClick={onSendCodeClick}
              disabled={!canResendCode}
            />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <CoreButton
          data-testid="ResetEmailPassword_ConfirmButton"
          type="submit"
          label={strings.confirm}
          disabled={!canConfirm}
          onClick={onConfirmResetClick}
        />

        <CoreTextButton
          data-testid="ResetEmailPassword_ChangeEmailButton"
          type="button"
          label={strings.change_email}
          onClick={onResetEmailClick}
          disabled={actionLoading}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

const ResetEmailPasswordContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useResetEmailPasswordStore((s) => s.screenState)

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'email_input') {
    return <EmailInputStep strings={strings} />
  }

  return <ResetInputStep strings={strings} />
}

/**
 * Props for the {@link ResetEmailPasswordScreen} component.
 */
export interface ResetEmailPasswordScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for password reset state management.
   */
  dependencies: ResetEmailPasswordStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for requesting a password reset email OTP code and applying a new password.
 */
export const ResetEmailPasswordScreen = forwardRef<HTMLDivElement, ResetEmailPasswordScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <ResetEmailPasswordProvider dependencies={dependencies}>
          <ResetEmailPasswordContent strings={strings} />
        </ResetEmailPasswordProvider>
      </div>
    )
  }
)

ResetEmailPasswordScreen.displayName = 'ResetEmailPasswordScreen'

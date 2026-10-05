import React, { forwardRef, useId } from 'react'
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
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { FeatureUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  RegistrationByEmailProvider,
  useRegistrationByEmailStore
} from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'

export const RegistrationByEmailTestTags = {
  BACK_BUTTON: 'RegistrationByEmail_BackButton',
  TITLE: 'RegistrationByEmail_Title',
  EMAIL_INPUT: 'RegistrationByEmail_EmailInput',
  SEND_CODE_BUTTON: 'RegistrationByEmail_SendCodeButton',
  CODE_INPUT: 'RegistrationByEmail_CodeInput',
  PASSWORD_INPUT: 'RegistrationByEmail_PasswordInput',
  RESEND_CODE_BUTTON: 'RegistrationByEmail_ResendCodeButton',
  RESEND_TIMER_TEXT: 'RegistrationByEmail_ResendTimerText',
  REGISTER_BUTTON: 'RegistrationByEmail_RegisterButton',
  ACTION_ERROR_TEXT: 'RegistrationByEmail_ActionErrorText'
}

const RegistrationByEmailContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useRegistrationByEmailStore((s) => s.screenState)
  const onEmailChanged = useRegistrationByEmailStore((s) => s.onEmailChanged)
  const onSendCodeClick = useRegistrationByEmailStore((s) => s.onSendCodeClick)
  const onCodeChanged = useRegistrationByEmailStore((s) => s.onCodeChanged)
  const onPasswordChanged = useRegistrationByEmailStore((s) => s.onPasswordChanged)
  const onTogglePasswordVisibility = useRegistrationByEmailStore((s) => s.onTogglePasswordVisibility)
  const onRegisterClick = useRegistrationByEmailStore((s) => s.onRegisterClick)
  const onBackClick = useRegistrationByEmailStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const emailId = useId()
  const codeId = useId()
  const passwordId = useId()

  const { actionLoading, actionError } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (screenState.step === 'email_input') {
      onSendCodeClick()
    } else {
      onRegisterClick()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          data-testid={RegistrationByEmailTestTags.BACK_BUTTON}
          onClick={onBackClick}
          disabled={actionLoading}
        />
        <CoreScreenTitleText
          data-testid={RegistrationByEmailTestTags.TITLE}
          text={strings.registration_by_email}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 my-auto">
        {screenState.step === 'email_input' ? (
          <CoreEmailTextField
            id={emailId}
            data-testid={RegistrationByEmailTestTags.EMAIL_INPUT}
            value={screenState.email}
            onChange={(e) => onEmailChanged(e.target.value)}
            label={strings.email}
            placeholder={strings.email}
            isError={Boolean(actionError)}
            disabled={actionLoading}
          />
        ) : (
          <>
            <div className="text-xl font-bold text-center">
              {strings.enter_confirmation_code}
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {strings.code_sent_to(screenState.email)}
            </div>

            <CoreCodeTextField
              id={codeId}
              data-testid={RegistrationByEmailTestTags.CODE_INPUT}
              value={screenState.code}
              onChange={(e) => onCodeChanged(e.target.value)}
              label={strings.confirmation_code}
              placeholder={strings.enter_confirmation_code}
              isError={Boolean(actionError)}
              disabled={actionLoading}
            />

            <CorePasswordTextField
              id={passwordId}
              data-testid={RegistrationByEmailTestTags.PASSWORD_INPUT}
              value={screenState.password}
              onChange={(e) => onPasswordChanged(e.target.value)}
              isPasswordVisible={screenState.isPasswordVisible}
              onTogglePasswordVisibility={onTogglePasswordVisibility}
              label={strings.password}
              placeholder={strings.password}
              isError={!screenState.isPasswordValid || Boolean(actionError)}
              disabled={actionLoading}
            />

            {screenState.resendTimerSeconds > 0 ? (
              <span
                data-testid={RegistrationByEmailTestTags.RESEND_TIMER_TEXT}
                className="text-xs text-muted-foreground"
              >
                {strings.resend_code_timer(screenState.resendTimerSeconds)}
              </span>
            ) : (
              <CoreTextButton
                type="button"
                data-testid={RegistrationByEmailTestTags.RESEND_CODE_BUTTON}
                label={strings.resend_code}
                onClick={onSendCodeClick}
                disabled={actionLoading}
              />
            )}
          </>
        )}

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            actionError ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {actionError && (
            <CoreErrorText
              data-testid={RegistrationByEmailTestTags.ACTION_ERROR_TEXT}
              text={errorParser.parse(actionError) ?? ''}
            />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        {screenState.step === 'email_input' ? (
          <CoreButton
            type="submit"
            data-testid={RegistrationByEmailTestTags.SEND_CODE_BUTTON}
            label={strings.send_code}
            disabled={!screenState.isEmailValid || actionLoading}
            onClick={onSendCodeClick}
          />
        ) : (
          <CoreButton
            type="submit"
            data-testid={RegistrationByEmailTestTags.REGISTER_BUTTON}
            label={strings.register}
            disabled={
              screenState.code.length !== screenState.codeLength ||
              !screenState.isPasswordValid ||
              screenState.password.length === 0 ||
              actionLoading
            }
            onClick={onRegisterClick}
          />
        )}
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

export interface RegistrationByEmailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: RegistrationByEmailStoreDependencies
  strings?: FeatureUserStrings
}

export const RegistrationByEmailScreen = forwardRef<HTMLDivElement, RegistrationByEmailScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <RegistrationByEmailProvider dependencies={dependencies}>
          <RegistrationByEmailContent strings={strings} />
        </RegistrationByEmailProvider>
      </div>
    )
  }
)

RegistrationByEmailScreen.displayName = 'RegistrationByEmailScreen'

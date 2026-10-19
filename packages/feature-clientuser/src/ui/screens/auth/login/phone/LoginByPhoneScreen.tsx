import React, { forwardRef, useId } from 'react'
import { UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreCodeTextField,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  LoginByPhoneProvider,
  LoginByPhoneStep,
  useLoginByPhoneStore
} from '@/ui/screens/auth/login/phone/LoginByPhoneStore'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

const LoginByPhoneContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useLoginByPhoneStore((s) => s.screenState)
  const onPhoneChanged = useLoginByPhoneStore((s) => s.onPhoneChanged)
  const onCodeChanged = useLoginByPhoneStore((s) => s.onCodeChanged)
  const onSendCodeClick = useLoginByPhoneStore((s) => s.onSendCodeClick)
  const onConfirmCodeClick = useLoginByPhoneStore((s) => s.onConfirmCodeClick)
  const onResetPhoneClick = useLoginByPhoneStore((s) => s.onResetPhoneClick)
  const onBackClick = useLoginByPhoneStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const phoneInputId = useId()
  const codeInputId = useId()

  const { actionLoading, actionError } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    switch (screenState.step) {
      case LoginByPhoneStep.PHONE:
        void onSendCodeClick()
        break
      case LoginByPhoneStep.CODE:
        void onConfirmCodeClick()
        break
    }
  }

  const renderStepContent = () => {
    switch (screenState.step) {
      case LoginByPhoneStep.PHONE:
        return (
          <>
            <div className="text-xl font-bold text-center">
              {strings.ui.enterPhoneNumber}
            </div>

            <CoreOutlinedTextField
              id={phoneInputId}
              value={screenState.phoneNumber}
              onChange={(e) => onPhoneChanged(e.target.value)}
              label={strings.ui.phoneNumber}
              placeholder={strings.ui.phoneNumber}
              isError={Boolean(actionError)}
              disabled={actionLoading}
            />
          </>
        )
      case LoginByPhoneStep.CODE:
        return (
          <>
            <div className="text-xl font-bold text-center">
              {strings.ui.enterConfirmationCode}
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {strings.ui.codeSentTo(screenState.phoneNumber)}
            </div>

            <CoreCodeTextField
              id={codeInputId}
              value={screenState.code}
              onChange={(e) => onCodeChanged(e.target.value)}
              label={strings.ui.confirmationCode}
              placeholder={strings.ui.enterConfirmationCode}
              isError={Boolean(actionError)}
              disabled={actionLoading}
            />

            {screenState.resendTimerSeconds > 0 ? (
              <span className="text-xs text-muted-foreground">
                {strings.ui.resendCodeTimer(screenState.resendTimerSeconds)}
              </span>
            ) : (
              <CoreTextButton
                type="button"
                label={strings.ui.resendCode}
                onClick={onSendCodeClick}
                disabled={actionLoading}
              />
            )}
          </>
        )
    }
  }

  const renderStepButtons = () => {
    switch (screenState.step) {
      case LoginByPhoneStep.PHONE:
        return (
          <CoreButton
            type="submit"
            label={strings.ui.sendCode}
            disabled={!screenState.isPhoneNumberValid || actionLoading}
            onClick={onSendCodeClick}
          />
        )
      case LoginByPhoneStep.CODE:
        return (
          <>
            <CoreButton
              type="submit"
              label={strings.ui.confirm}
              disabled={screenState.code.length !== screenState.codeLength || actionLoading}
              onClick={onConfirmCodeClick}
            />
            <CoreTextButton
              type="button"
              label={strings.ui.changePhoneNumber}
              onClick={onResetPhoneClick}
              disabled={actionLoading}
            />
          </>
        )
    }
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
          text={strings.ui.signInWithPhone}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 my-auto">
        {renderStepContent()}

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
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        {renderStepButtons()}
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

/** Props for {@link LoginByPhoneScreen}. */
export interface LoginByPhoneScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: LoginByPhoneStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/**
 * Screen component for signing in via phone number with OTP code verification.
 */
export const LoginByPhoneScreen = forwardRef<HTMLDivElement, LoginByPhoneScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <LoginByPhoneProvider dependencies={dependencies}>
          <LoginByPhoneContent strings={strings} />
        </LoginByPhoneProvider>
      </div>
    )
  }
)

LoginByPhoneScreen.displayName = 'LoginByPhoneScreen'

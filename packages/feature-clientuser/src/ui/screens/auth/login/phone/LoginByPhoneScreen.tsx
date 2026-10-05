import React, { forwardRef } from 'react'
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
import { enUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { FeatureUserStrings } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import {
  LoginByPhoneProvider,
  useLoginByPhoneStore
} from '@/ui/screens/auth/login/phone/LoginByPhoneStore'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

const LoginByPhoneContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useLoginByPhoneStore((s) => s.screenState)
  const onPhoneChanged = useLoginByPhoneStore((s) => s.onPhoneChanged)
  const onCodeChanged = useLoginByPhoneStore((s) => s.onCodeChanged)
  const onSendCodeClick = useLoginByPhoneStore((s) => s.onSendCodeClick)
  const onConfirmCodeClick = useLoginByPhoneStore((s) => s.onConfirmCodeClick)
  const onResetPhoneClick = useLoginByPhoneStore((s) => s.onResetPhoneClick)
  const onBackClick = useLoginByPhoneStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const { actionLoading, actionError } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (screenState.step === 'phone') {
      onSendCodeClick()
    } else {
      onConfirmCodeClick()
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
          text={strings.sign_in_with_phone}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center items-center gap-4 my-auto">
        {screenState.step === 'phone' ? (
          <>
            <div className="text-xl font-bold text-center">
              {strings.enter_phone_number}
            </div>

            <CoreOutlinedTextField
              value={screenState.phoneNumber}
              onChange={(e) => onPhoneChanged(e.target.value)}
              label={strings.phone_number}
              placeholder={strings.phone_number}
              isError={Boolean(actionError)}
              disabled={actionLoading}
            />
          </>
        ) : (
          <>
            <div className="text-xl font-bold text-center">
              {strings.enter_confirmation_code}
            </div>

            <div className="text-sm text-muted-foreground text-center">
              {strings.code_sent_to(screenState.phoneNumber)}
            </div>

            <CoreCodeTextField
              value={screenState.code}
              onChange={(e) => onCodeChanged(e.target.value)}
              label={strings.confirmation_code}
              placeholder={strings.enter_confirmation_code}
              isError={Boolean(actionError)}
              disabled={actionLoading}
            />

            {screenState.resendTimerSeconds > 0 ? (
              <span className="text-xs text-muted-foreground">
                {strings.resend_code_timer(screenState.resendTimerSeconds)}
              </span>
            ) : (
              <CoreTextButton
                type="button"
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
            <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        {screenState.step === 'phone' ? (
          <CoreButton
            type="submit"
            label={strings.send_code}
            disabled={!screenState.isPhoneNumberValid || actionLoading}
            onClick={onSendCodeClick}
          />
        ) : (
          <>
            <CoreButton
              type="submit"
              label={strings.confirm}
              disabled={screenState.code.length !== screenState.codeLength || actionLoading}
              onClick={onConfirmCodeClick}
            />
            <CoreTextButton
              type="button"
              label={strings.change_phone_number}
              onClick={onResetPhoneClick}
              disabled={actionLoading}
            />
          </>
        )}
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

export interface LoginByPhoneScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: LoginByPhoneStoreDependencies
  strings?: FeatureUserStrings
}

export const LoginByPhoneScreen = forwardRef<HTMLDivElement, LoginByPhoneScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
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

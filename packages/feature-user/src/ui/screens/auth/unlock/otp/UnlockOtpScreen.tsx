import React, { forwardRef, useEffect } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreCodeTextField,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  UnlockOtpProvider,
  useUnlockOtpStore
} from '@/ui/screens/auth/unlock/otp/unlock-otp-store'
import type { UnlockOtpStoreDependencies } from "@/ui/screens/auth/unlock/otp/unlock-otp-store";

const UnlockOtpContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useUnlockOtpStore((s) => s.screenState)
  const onCodeChanged = useUnlockOtpStore((s) => s.onCodeChanged)
  const onUnlockClick = useUnlockOtpStore((s) => s.onUnlockClick)
  const onResendCodeClick = useUnlockOtpStore((s) => s.onResendCodeClick)
  const onBackClick = useUnlockOtpStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  const { target, codeInput, remainingDelaySeconds, actionLoading, actionError } = screenState

  const canUnlock = !actionLoading && codeInput.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canUnlock) {
      onUnlockClick()
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
          text={strings.unlock_account}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <p className="text-center text-muted-foreground text-sm font-medium">
          {target}
        </p>

        <CoreCodeTextField
          value={codeInput}
          onChange={(e) => onCodeChanged(e.target.value)}
          label={strings.confirmation_code}
          placeholder={strings.enter_confirmation_code}
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
            <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>

        <div className="flex justify-center text-xs text-muted-foreground pt-1">
          {remainingDelaySeconds > 0 ? (
            <span>{strings.resend_code_timer(remainingDelaySeconds)}</span>
          ) : (
            <CoreTextButton
              type="button"
              label={strings.resend_code}
              onClick={onResendCodeClick}
              disabled={actionLoading}
            />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4">
        <CoreButton
          type="submit"
          label={strings.unlock_account}
          disabled={!canUnlock}
          onClick={onUnlockClick}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

const UnlockOtpController: React.FC<{ strings?: FeatureUserStrings }> = ({ strings }) => {
  const initTimer = useUnlockOtpStore((s) => s.initTimer)

  useEffect(() => {
    initTimer()
  }, [initTimer])

  return <UnlockOtpContent strings={strings} />
}

/**
 * Props for the {@link UnlockOtpScreen} component.
 */
export interface UnlockOtpScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for unlock OTP verification.
   */
  dependencies: UnlockOtpStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for confirming an unlock OTP code sent via email or phone.
 */
export const UnlockOtpScreen = forwardRef<HTMLDivElement, UnlockOtpScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UnlockOtpProvider dependencies={dependencies}>
          <UnlockOtpController strings={strings} />
        </UnlockOtpProvider>
      </div>
    )
  }
)

UnlockOtpScreen.displayName = 'UnlockOtpScreen'

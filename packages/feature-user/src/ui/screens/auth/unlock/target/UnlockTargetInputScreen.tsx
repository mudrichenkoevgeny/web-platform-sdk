import React, { forwardRef } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreEmailTextField,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@/validator/FieldValidator'
import {
  UnlockTargetInputProvider,
  useUnlockTargetInputStore
} from '@/ui/screens/auth/unlock/target/UnlockTargetInputStore'
import type { UnlockTargetInputStoreDependencies } from "@/ui/screens/auth/unlock/target/UnlockTargetInputStore";

const UnlockTargetInputContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useUnlockTargetInputStore((s) => s.screenState)
  const onInputChanged = useUnlockTargetInputStore((s) => s.onInputChanged)
  const onSendCodeClick = useUnlockTargetInputStore((s) => s.onSendCodeClick)
  const onBackClick = useUnlockTargetInputStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  const { method, input, actionLoading, actionError } = screenState

  const isInputValid =
    method === UnlockMethod.EMAIL
      ? FieldValidator.isValidEmail(input.trim())
      : FieldValidator.isValidPhone(input.trim())

  const canSendCode = isInputValid && !actionLoading

  const title =
    method === UnlockMethod.EMAIL
      ? strings.unlock_by_email
      : strings.unlock_by_phone

  const description =
    method === UnlockMethod.EMAIL
      ? strings.unlock_email_input_desc
      : strings.unlock_phone_input_desc

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSendCode) {
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
          text={title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <p className="text-center text-muted-foreground text-sm">
          {description}
        </p>

        {method === UnlockMethod.EMAIL ? (
          <CoreEmailTextField
            value={input}
            onChange={(e) => onInputChanged(e.target.value)}
            label={strings.email}
            placeholder={strings.email}
            isError={Boolean(actionError)}
            disabled={actionLoading}
            autoFocus
          />
        ) : (
          <CoreOutlinedTextField
            value={input}
            onChange={(e) => onInputChanged(e.target.value)}
            label={strings.phone_number}
            placeholder={strings.enter_phone_number}
            type="tel"
            inputMode="tel"
            isError={Boolean(actionError)}
            disabled={actionLoading}
            autoFocus
          />
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
        <CoreButton
          type="submit"
          label={strings.send_code}
          disabled={!canSendCode}
          onClick={onSendCodeClick}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

/**
 * Props for the {@link UnlockTargetInputScreen} component.
 */
export interface UnlockTargetInputScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for unlock target input.
   */
  dependencies: UnlockTargetInputStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for entering an email address or phone number to request an unlock OTP code.
 */
export const UnlockTargetInputScreen = forwardRef<HTMLDivElement, UnlockTargetInputScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UnlockTargetInputProvider dependencies={dependencies}>
          <UnlockTargetInputContent strings={strings} />
        </UnlockTargetInputProvider>
      </div>
    )
  }
)

UnlockTargetInputScreen.displayName = 'UnlockTargetInputScreen'

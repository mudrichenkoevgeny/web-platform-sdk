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
import { UnlockMethod, UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@/validator/field-validator'
import {
  UnlockTargetInputProvider,
  UnlockTargetInputStatus,
  useUnlockTargetInputStore
} from '@/ui/screens/auth/unlock/target/unlock-target-input-store'
import type { UnlockTargetInputStoreDependencies } from '@/ui/screens/auth/unlock/target/unlock-target-input-store'

const UnlockTargetInputContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const deps = useUnlockTargetInputStore((s) => s.dependencies)
  const screenState = useUnlockTargetInputStore((s) => s.screenState)
  const onInputChanged = useUnlockTargetInputStore((s) => s.onInputChanged)
  const onSendCodeClick = useUnlockTargetInputStore((s) => s.onSendCodeClick)
  const onBackClick = useUnlockTargetInputStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  switch (screenState.status) {
    case UnlockTargetInputStatus.LOADING:
      return <FullscreenLoading />

    case UnlockTargetInputStatus.CONTENT: {
      const { input, actionLoading, actionError } = screenState
      const method = deps.method ?? UnlockMethod.EMAIL

      const isInputValid =
        method === UnlockMethod.EMAIL
          ? FieldValidator.isValidEmail(input.trim())
          : FieldValidator.isValidPhone(input.trim())

      const canSendCode = isInputValid && !actionLoading

      const title =
        method === UnlockMethod.EMAIL
          ? strings.ui.unlockByEmail
          : strings.ui.unlockByPhone

      const description =
        method === UnlockMethod.EMAIL
          ? strings.ui.unlockEmailInputDesc
          : strings.ui.unlockPhoneInputDesc

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (canSendCode) {
          void onSendCodeClick()
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
                label={strings.ui.email}
                placeholder={strings.ui.email}
                isError={Boolean(actionError)}
                disabled={actionLoading}
                autoFocus
              />
            ) : (
              <CoreOutlinedTextField
                value={input}
                onChange={(e) => onInputChanged(e.target.value)}
                label={strings.ui.phoneNumber}
                placeholder={strings.ui.enterPhoneNumber}
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
              label={strings.ui.sendCode}
              disabled={!canSendCode}
              onClick={onSendCodeClick}
            />
          </div>

          {actionLoading && <FullscreenOverlayLoading />}
        </form>
      )
    }
  }
}

/** Props for {@link UnlockTargetInputScreen}. */
export interface UnlockTargetInputScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: UnlockTargetInputStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/**
 * Screen component for entering target email/phone number to request account unlock code.
 */
export const UnlockTargetInputScreen = forwardRef<HTMLDivElement, UnlockTargetInputScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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

import React, { forwardRef, useEffect } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  formatEpochMillisToDateTime,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AccountLockoutType, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  UnlockMethodSelectionProvider,
  useUnlockMethodSelectionStore
} from '@/ui/screens/auth/unlock/selection/unlock-method-selection-store'
import type { UnlockMethodSelectionStoreDependencies } from "@/ui/screens/auth/unlock/selection/unlock-method-selection-store";

const UnlockMethodSelectionContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const lockoutType = useUnlockMethodSelectionStore((s) => s.lockoutType)
  const lockoutUntil = useUnlockMethodSelectionStore((s) => s.lockoutUntil)
  const knownIdentifiers = useUnlockMethodSelectionStore((s) => s.knownIdentifiers)
  const actionLoading = useUnlockMethodSelectionStore((s) => s.actionLoading)
  const actionError = useUnlockMethodSelectionStore((s) => s.actionError)

  const onSelectEmailUnlock = useUnlockMethodSelectionStore((s) => s.onSelectEmailUnlock)
  const onSelectPhoneUnlock = useUnlockMethodSelectionStore((s) => s.onSelectPhoneUnlock)
  const onSelectGoogleUnlock = useUnlockMethodSelectionStore((s) => s.onSelectGoogleUnlock)
  const onSelectAppleUnlock = useUnlockMethodSelectionStore((s) => s.onSelectAppleUnlock)
  const onBackClick = useUnlockMethodSelectionStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const isEmailAvailable =
    knownIdentifiers.length === 0 ||
    knownIdentifiers.some((i: UserIdentifierSummary) => i.userAuthProvider === UserAuthProvider.EMAIL)

  const isPhoneAvailable =
    knownIdentifiers.length === 0 ||
    knownIdentifiers.some((i: UserIdentifierSummary) => i.userAuthProvider === UserAuthProvider.PHONE)

  const isGoogleAvailable =
    knownIdentifiers.length === 0 ||
    knownIdentifiers.some((i: UserIdentifierSummary) => i.userAuthProvider === UserAuthProvider.GOOGLE)

  const isAppleAvailable =
    knownIdentifiers.length === 0 ||
    knownIdentifiers.some((i: UserIdentifierSummary) => i.userAuthProvider === UserAuthProvider.APPLE)

  let lockoutText: string | null = null
  if (lockoutType === AccountLockoutType.TEMPORARY && lockoutUntil != null) {
    const formatted = formatEpochMillisToDateTime(lockoutUntil)
    lockoutText = formatted
      ? strings.error_user_locked_until(formatted)
      : strings.error_user_locked
  } else if (lockoutType != null && lockoutType !== AccountLockoutType.NONE) {
    lockoutText = strings.error_user_locked
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton onClick={onBackClick} disabled={actionLoading} />
        <CoreScreenTitleText
          text={strings.unlock_choose_method}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-3 my-auto">
        {lockoutText && (
          <div className="mb-4 text-center">
            <CoreErrorText text={lockoutText} />
          </div>
        )}

        {isEmailAvailable && (
          <CoreButton
            type="button"
            label={strings.unlock_by_email}
            disabled={actionLoading}
            onClick={onSelectEmailUnlock}
          />
        )}

        {isPhoneAvailable && (
          <CoreButton
            type="button"
            label={strings.unlock_by_phone}
            disabled={actionLoading}
            onClick={onSelectPhoneUnlock}
          />
        )}

        {isGoogleAvailable && (
          <CoreButton
            type="button"
            label={strings.unlock_by_google}
            disabled={actionLoading}
            onClick={onSelectGoogleUnlock}
          />
        )}

        {isAppleAvailable && (
          <CoreButton
            type="button"
            label={strings.unlock_by_apple}
            disabled={actionLoading}
            onClick={onSelectAppleUnlock}
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

      {actionLoading && <FullscreenLoading />}
    </div>
  )
}

const UnlockMethodSelectionController: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings
}) => {
  const loadIdentifiers = useUnlockMethodSelectionStore((s) => s.loadIdentifiers)

  useEffect(() => {
    loadIdentifiers()
  }, [loadIdentifiers])

  return <UnlockMethodSelectionContent strings={strings} />
}

/**
 * Props for the {@link UnlockMethodSelectionScreen} component.
 */
export interface UnlockMethodSelectionScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for unlock method selection.
   */
  dependencies: UnlockMethodSelectionStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for choosing an account unlock method (email, phone, Google).
 */
export const UnlockMethodSelectionScreen = forwardRef<
  HTMLDivElement,
  UnlockMethodSelectionScreenProps
>(({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
  return (
    <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
      <UnlockMethodSelectionProvider dependencies={dependencies}>
        <UnlockMethodSelectionController strings={strings} />
      </UnlockMethodSelectionProvider>
    </div>
  )
})

UnlockMethodSelectionScreen.displayName = 'UnlockMethodSelectionScreen'

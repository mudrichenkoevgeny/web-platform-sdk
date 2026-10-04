import React, { forwardRef } from 'react'
import {
  cn,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  PendingDeletionProvider,
  usePendingDeletionStore
} from '@/ui/screens/auth/login/pendingdeletion/PendingDeletionStore'
import type { PendingDeletionStoreDependencies } from "@/ui/screens/auth/login/pendingdeletion/PendingDeletionStore";

const PendingDeletionContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = usePendingDeletionStore((s) => s.screenState)
  const onRestoreAccountClick = usePendingDeletionStore((s) => s.onRestoreAccountClick)
  const onSignOutClick = usePendingDeletionStore((s) => s.onSignOutClick)
  const errorParser = useAppErrorParser()

  const { actionLoading, actionError } = screenState

  return (
    <div className="w-full h-full p-6 flex flex-col items-center justify-between relative overflow-y-auto">
      <CoreScreenTitleText
        text={strings.account_pending_deletion_title}
        className="mb-4 text-center"
      />

      <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 my-auto">
        <div className="w-full p-4 rounded-lg bg-error/10 border border-error/20 text-center flex flex-col gap-2">
          <span className="text-base font-bold text-error">
            {strings.account_pending_deletion_title}
          </span>
          <span className="text-sm text-surface-foreground">
            {strings.account_pending_deletion_desc}
          </span>
        </div>

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
          type="button"
          label={strings.restore_account}
          disabled={actionLoading}
          onClick={onRestoreAccountClick}
        />

        <CoreTextButton
          type="button"
          label={strings.logout}
          disabled={actionLoading}
          onClick={onSignOutClick}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </div>
  )
}

/**
 * Props for the {@link PendingDeletionScreen} component.
 */
export interface PendingDeletionScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for state management and account restoration.
   */
  dependencies: PendingDeletionStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component displayed when an account is scheduled for permanent deletion, allowing restoration.
 */
export const PendingDeletionScreen = forwardRef<HTMLDivElement, PendingDeletionScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <PendingDeletionProvider dependencies={dependencies}>
          <PendingDeletionContent strings={strings} />
        </PendingDeletionProvider>
      </div>
    )
  }
)

PendingDeletionScreen.displayName = 'PendingDeletionScreen'

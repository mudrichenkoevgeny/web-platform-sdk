import React, { forwardRef } from 'react'
import { UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreButton,
  CoreScreenTitleText
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Props for the {@link UnlockSuccessScreen} component.
 */
export interface UnlockSuccessScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Flow completion callback.
   */
  onFinished: () => void
  /**
   * Localized strings dictionary override.
   */
  strings?: UserModuleStrings
}

/**
 * Screen component displaying successful account unlock confirmation.
 */
export const UnlockSuccessScreen = forwardRef<HTMLDivElement, UnlockSuccessScreenProps>(
  ({ onFinished, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full p-6 flex flex-col items-center justify-between text-center relative overflow-y-auto',
          className
        )}
        {...rest}
      >
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 my-auto">
          <CoreScreenTitleText text={strings.ui.unlockSuccessTitle} />

          <p className="text-muted-foreground text-sm">
            {strings.ui.unlockSuccessDesc}
          </p>
        </div>

        <div className="w-full pt-4">
          <CoreButton
            type="button"
            label={strings.ui.dialogConfirm}
            onClick={onFinished}
          />
        </div>
      </div>
    )
  }
)

UnlockSuccessScreen.displayName = 'UnlockSuccessScreen'

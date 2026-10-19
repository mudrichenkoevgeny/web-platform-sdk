import React, { forwardRef, useEffect, useState } from 'react'
import { UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenError,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  TotpRecoveryCodesProvider,
  TotpRecoveryCodesStatus,
  useTotpRecoveryCodesStore
} from '@/ui/screens/user/totp/recovery/totp-recovery-codes-store'
import type { TotpRecoveryCodesStoreDependencies } from "@/ui/screens/user/totp/recovery/totp-recovery-codes-store";

/**
 * Automation test tags for {@link TotpRecoveryCodesScreen}.
 */
export const TotpRecoveryCodesTestTags = {
  TITLE: 'TotpRecoveryCodes_Title',
  BACK_BUTTON: 'TotpRecoveryCodes_BackButton',
  GLOBAL_ERROR_TEXT: 'TotpRecoveryCodes_GlobalErrorText',
  RECOVERY_CODES_TITLE: 'TotpRecoveryCodes_TitleText',
  RECOVERY_CODES_DESC: 'TotpRecoveryCodes_DescText',
  RECOVERY_CODES_CONTAINER: 'TotpRecoveryCodes_Container',
  COPY_ALL_RECOVERY_CODES_BUTTON: 'TotpRecoveryCodes_CopyAllButton',
  REGENERATE_RECOVERY_CODES_BUTTON: 'TotpRecoveryCodes_RegenerateButton',
  ACTION_ERROR_TEXT: 'TotpRecoveryCodes_ActionErrorText'
}

const TotpRecoveryCodesContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useTotpRecoveryCodesStore((s) => s.screenState)
  const loadRecoveryCodes = useTotpRecoveryCodesStore((s) => s.loadRecoveryCodes)
  const onRegenerateClick = useTotpRecoveryCodesStore((s) => s.onRegenerateClick)
  const onConfirmRegenerate = useTotpRecoveryCodesStore((s) => s.onConfirmRegenerate)
  const onDismissDialogs = useTotpRecoveryCodesStore((s) => s.onDismissDialogs)
  const onBackClick = useTotpRecoveryCodesStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const [isCopied, setIsCopied] = useState(false)

  switch (screenState.status) {
    case TotpRecoveryCodesStatus.LOADING:
      return <FullscreenLoading />

    case TotpRecoveryCodesStatus.ERROR:
      return (
        <FullscreenError
          data-testid={TotpRecoveryCodesTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={loadRecoveryCodes}
          onBack={onBackClick}
          title={strings.ui.recoveryCodesTitle}
        />
      )

    case TotpRecoveryCodesStatus.CONTENT: {
      const { recoveryCodes, showRegenerateConfirmation, actionLoading, actionError } = screenState

      const handleCopyAll = async () => {
        const textToCopy = recoveryCodes.codes.join('\n')
        await navigator.clipboard.writeText(textToCopy)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton
              onClick={onBackClick}
              data-testid={TotpRecoveryCodesTestTags.BACK_BUTTON}
            />
            <CoreScreenTitleText
              text={strings.ui.recoveryCodesTitle}
              className="absolute left-1/2 -translate-x-1/2"
              data-testid={TotpRecoveryCodesTestTags.TITLE}
            />
            <div className="w-10" />
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center gap-4 my-auto text-center max-w-sm">
            <h3
              className="text-base font-bold text-surface-foreground"
              data-testid={TotpRecoveryCodesTestTags.RECOVERY_CODES_TITLE}
            >
              {strings.ui.recoveryCodesTitle}
            </h3>

            <p
              className="text-xs text-muted-foreground"
              data-testid={TotpRecoveryCodesTestTags.RECOVERY_CODES_DESC}
            >
              {strings.ui.recoveryCodesDesc}
            </p>

            <div
              className="w-full p-4 bg-accent/30 rounded-lg border border-border grid grid-cols-2 gap-2 my-2 text-center"
              data-testid={TotpRecoveryCodesTestTags.RECOVERY_CODES_CONTAINER}
            >
              {recoveryCodes.codes.map((code) => (
                <span key={code} className="font-mono text-sm font-semibold tracking-wider text-surface-foreground">
                  {code}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <CoreTextButton
                type="button"
                label={strings.ui.copyAll}
                onClick={handleCopyAll}
                data-testid={TotpRecoveryCodesTestTags.COPY_ALL_RECOVERY_CODES_BUTTON}
              />
              {isCopied && (
                <span className="text-xs text-primary font-semibold animate-pulse">
                  Copied!
                </span>
              )}
            </div>

            <div className="w-full pt-4">
              <CoreButton
                type="button"
                label={strings.ui.regenerateRecoveryCodes}
                onClick={onRegenerateClick}
                disabled={actionLoading}
                data-testid={TotpRecoveryCodesTestTags.REGENERATE_RECOVERY_CODES_BUTTON}
              />
            </div>

            {actionError && (
              <CoreErrorText
                text={errorParser.parse(actionError) ?? ''}
                data-testid={TotpRecoveryCodesTestTags.ACTION_ERROR_TEXT}
              />
            )}
          </div>

          {showRegenerateConfirmation && (
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="regenerate-codes-dialog-title"
              aria-describedby="regenerate-codes-dialog-desc"
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={onDismissDialogs}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
              >
                <h3 id="regenerate-codes-dialog-title" className="text-lg font-bold text-surface-foreground">
                  {strings.ui.dialogConfirmTitle}
                </h3>
                <p id="regenerate-codes-dialog-desc" className="text-sm text-muted-foreground">
                  {strings.ui.regenerateCodesConfirmMsg}
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogCancel}
                    onClick={onDismissDialogs}
                  />
                  <CoreTextButton
                    type="button"
                    label={strings.ui.dialogConfirm}
                    onClick={onConfirmRegenerate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }
}

const TotpRecoveryCodesController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const loadRecoveryCodes = useTotpRecoveryCodesStore((s) => s.loadRecoveryCodes)

  useEffect(() => {
    loadRecoveryCodes()
  }, [loadRecoveryCodes])

  return <TotpRecoveryCodesContent strings={strings} />
}

/**
 * Props for {@link TotpRecoveryCodesScreen}.
 */
export interface TotpRecoveryCodesScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: TotpRecoveryCodesStoreDependencies
  strings?: UserModuleStrings
}

/**
 * Screen component for viewing and regenerating MFA TOTP backup recovery codes.
 */
export const TotpRecoveryCodesScreen = forwardRef<HTMLDivElement, TotpRecoveryCodesScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <TotpRecoveryCodesProvider dependencies={dependencies}>
          <TotpRecoveryCodesController strings={strings} />
        </TotpRecoveryCodesProvider>
      </div>
    )
  }
)

TotpRecoveryCodesScreen.displayName = 'TotpRecoveryCodesScreen'

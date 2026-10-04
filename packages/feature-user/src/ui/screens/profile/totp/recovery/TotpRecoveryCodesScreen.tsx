import React, { forwardRef, useState } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings, FeatureUserStrings } from '@/locales/index'
import {
  TotpRecoveryCodesProvider,
  TotpRecoveryCodesStoreDependencies,
  useTotpRecoveryCodesStore
} from './TotpRecoveryCodesStore'

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

const TotpRecoveryCodesContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useTotpRecoveryCodesStore((s) => s.screenState)
  const onRegenerateClick = useTotpRecoveryCodesStore((s) => s.onRegenerateClick)
  const onConfirmRegenerate = useTotpRecoveryCodesStore((s) => s.onConfirmRegenerate)
  const onDismissDialogs = useTotpRecoveryCodesStore((s) => s.onDismissDialogs)
  const onBackClick = useTotpRecoveryCodesStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const [isCopied, setIsCopied] = useState(false)

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={TotpRecoveryCodesTestTags.GLOBAL_ERROR_TEXT}
        />
      </div>
    )
  }

  const { recoveryCodes, showRegenerateConfirmation, actionLoading, actionError } = screenState

  const handleCopyAll = async () => {
    const textToCopy = recoveryCodes.totpRecoveryCodes.join('\n')
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
          text={strings.recovery_codes_title}
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
          {strings.recovery_codes_title}
        </h3>

        <p
          className="text-xs text-muted-foreground"
          data-testid={TotpRecoveryCodesTestTags.RECOVERY_CODES_DESC}
        >
          {strings.recovery_codes_desc}
        </p>

        <div
          className="w-full p-4 bg-accent/30 rounded-lg border border-border grid grid-cols-2 gap-2 my-2 text-center"
          data-testid={TotpRecoveryCodesTestTags.RECOVERY_CODES_CONTAINER}
        >
          {recoveryCodes.totpRecoveryCodes.map((code) => (
            <span key={code} className="font-mono text-sm font-semibold tracking-wider text-surface-foreground">
              {code}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1">
          <CoreTextButton
            type="button"
            label={strings.copy_all}
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
            label={strings.regenerate_recovery_codes}
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
              {strings.dialog_confirm_title}
            </h3>
            <p id="regenerate-codes-dialog-desc" className="text-sm text-muted-foreground">
              {strings.regenerate_codes_confirm_msg}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.dialog_cancel}
                onClick={onDismissDialogs}
              />
              <CoreTextButton
                type="button"
                label={strings.dialog_confirm}
                onClick={onConfirmRegenerate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Props for {@link TotpRecoveryCodesScreen}.
 */
export interface TotpRecoveryCodesScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: TotpRecoveryCodesStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component for viewing and regenerating MFA TOTP backup recovery codes.
 */
export const TotpRecoveryCodesScreen = forwardRef<HTMLDivElement, TotpRecoveryCodesScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <TotpRecoveryCodesProvider dependencies={dependencies}>
          <TotpRecoveryCodesContent strings={strings} />
        </TotpRecoveryCodesProvider>
      </div>
    )
  }
)

TotpRecoveryCodesScreen.displayName = 'TotpRecoveryCodesScreen'

import React, { forwardRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreCodeTextField,
  CoreErrorText,
  CoreIcon,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  icons,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  TotpMainProvider,
  useTotpMainStore
} from '@/ui/screens/profile/totp/main/TotpMainStore'
import type { TotpMainStoreDependencies } from "@/ui/screens/profile/totp/main/TotpMainStore";

/**
 * Automation test tags for {@link TotpMainScreen}.
 */
export const TotpMainTestTags = {
  TITLE: 'TotpMain_Title',
  BACK_BUTTON: 'TotpMain_BackButton',
  GLOBAL_ERROR_TEXT: 'TotpMain_GlobalErrorText',
  DISABLED_DESC_TEXT: 'TotpMain_DisabledDescText',
  SETUP_TOTP_BUTTON: 'TotpMain_SetupTotpButton',
  DISABLED_ACTION_ERROR_TEXT: 'TotpMain_DisabledActionErrorText',
  STEP1_TITLE: 'TotpMain_Step1Title',
  STEP1_DESC: 'TotpMain_Step1Desc',
  QR_CODE_BOX: 'TotpMain_QrCodeBox',
  MANUAL_KEY_LABEL: 'TotpMain_ManualKeyLabel',
  SECRET_KEY_TEXT: 'TotpMain_SecretKeyText',
  COPY_SECRET_KEY_BUTTON: 'TotpMain_CopySecretKeyButton',
  STEP2_TITLE: 'TotpMain_Step2Title',
  STEP2_DESC: 'TotpMain_Step2Desc',
  CODE_INPUT: 'TotpMain_CodeInput',
  CONFIRM_SETUP_BUTTON: 'TotpMain_ConfirmSetupButton',
  SETUP_ACTION_ERROR_TEXT: 'TotpMain_SetupActionErrorText',
  ENABLED_TITLE: 'TotpMain_EnabledTitle',
  ENABLED_DESC: 'TotpMain_EnabledDescText',
  RECOVERY_CODES_BUTTON: 'TotpMain_RecoveryCodesButton',
  DISABLE_TOTP_BUTTON: 'TotpMain_DisableTotpButton',
  ENABLED_ACTION_ERROR_TEXT: 'TotpMain_EnabledActionErrorText'
}

const TotpMainContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useTotpMainStore((s) => s.screenState)
  const onSetupClick = useTotpMainStore((s) => s.onSetupClick)
  const onCodeChanged = useTotpMainStore((s) => s.onCodeChanged)
  const onConfirmSetupClick = useTotpMainStore((s) => s.onConfirmSetupClick)
  const onRecoveryCodesClick = useTotpMainStore((s) => s.onRecoveryCodesClick)
  const onDisableClick = useTotpMainStore((s) => s.onDisableClick)
  const onConfirmDisable = useTotpMainStore((s) => s.onConfirmDisable)
  const onDismissDialogs = useTotpMainStore((s) => s.onDismissDialogs)
  const onBackClick = useTotpMainStore((s) => s.onBackClick)
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
          data-testid={TotpMainTestTags.GLOBAL_ERROR_TEXT}
        />
      </div>
    )
  }

  const handleCopySecretKey = async (secretKey: string) => {
    await navigator.clipboard.writeText(secretKey)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          data-testid={TotpMainTestTags.BACK_BUTTON}
        />
        <CoreScreenTitleText
          text={strings.totp_main}
          className="absolute left-1/2 -translate-x-1/2"
          data-testid={TotpMainTestTags.TITLE}
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center my-auto">
        {screenState.status === 'disabled' && (
          <div className="w-full flex flex-col items-center gap-4 text-center">
            <p
              className="text-sm text-muted-foreground max-w-sm"
              data-testid={TotpMainTestTags.DISABLED_DESC_TEXT}
            >
              {strings.totp_disabled_desc}
            </p>

            <div className="w-full max-w-xs pt-4">
              <CoreButton
                type="button"
                label={strings.setup_totp}
                onClick={onSetupClick}
                disabled={screenState.actionLoading}
                data-testid={TotpMainTestTags.SETUP_TOTP_BUTTON}
              />
            </div>

            {screenState.actionError && (
              <CoreErrorText
                text={errorParser.parse(screenState.actionError) ?? ''}
                data-testid={TotpMainTestTags.DISABLED_ACTION_ERROR_TEXT}
              />
            )}
          </div>
        )}

        {screenState.status === 'setupInProgress' && (
          <div className="w-full flex flex-col items-center gap-4 text-center max-w-md">
            <h3
              className="text-base font-bold text-surface-foreground"
              data-testid={TotpMainTestTags.STEP1_TITLE}
            >
              {strings.totp_setup_step1}
            </h3>
            <p
              className="text-xs text-muted-foreground"
              data-testid={TotpMainTestTags.STEP1_DESC}
            >
              {strings.totp_setup_step1_desc}
            </p>

            <div
              className="p-3 bg-white rounded-lg border border-border shadow-sm my-2 flex items-center justify-center"
              data-testid={TotpMainTestTags.QR_CODE_BOX}
            >
              <QRCodeSVG
                value={screenState.setup.totpOtpAuthUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="M"
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <span
                className="text-xs text-muted-foreground"
                data-testid={TotpMainTestTags.MANUAL_KEY_LABEL}
              >
                {strings.totp_manual_key}
              </span>
              <div className="flex items-center gap-2 bg-accent/40 px-3 py-1.5 rounded-md border border-border">
                <span
                  className="font-mono text-sm font-bold tracking-wider text-primary"
                  data-testid={TotpMainTestTags.SECRET_KEY_TEXT}
                >
                  {screenState.setup.totpSecretKey}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySecretKey(screenState.setup.totpSecretKey)}
                  className="p-1 hover:bg-accent rounded text-muted-foreground transition-colors"
                  title="Copy secret key"
                  data-testid={TotpMainTestTags.COPY_SECRET_KEY_BUTTON}
                >
                  <CoreIcon src={icons.copy} size={16} />
                </button>
              </div>
              {isCopied && (
                <span className="text-xs text-primary font-semibold animate-pulse">
                  Copied!
                </span>
              )}
            </div>

            <div className="w-full border-t border-border my-2 pt-4 flex flex-col items-center gap-3">
              <h3
                className="text-base font-bold text-surface-foreground"
                data-testid={TotpMainTestTags.STEP2_TITLE}
              >
                {strings.totp_setup_step2}
              </h3>
              <p
                className="text-xs text-muted-foreground"
                data-testid={TotpMainTestTags.STEP2_DESC}
              >
                {strings.totp_setup_step2_desc}
              </p>

              <CoreCodeTextField
                value={screenState.code}
                onChange={(e) => onCodeChanged(e.target.value)}
                maxLength={6}
                placeholder="000000"
                disabled={screenState.actionLoading}
                isError={Boolean(screenState.actionError)}
                data-testid={TotpMainTestTags.CODE_INPUT}
              />

              {screenState.actionError && (
                <CoreErrorText
                  text={errorParser.parse(screenState.actionError) ?? ''}
                  data-testid={TotpMainTestTags.SETUP_ACTION_ERROR_TEXT}
                />
              )}

              <div className="w-full pt-2">
                <CoreButton
                  type="button"
                  label={strings.confirm}
                  onClick={onConfirmSetupClick}
                  disabled={!screenState.canConfirm}
                  data-testid={TotpMainTestTags.CONFIRM_SETUP_BUTTON}
                />
              </div>
            </div>
          </div>
        )}

        {screenState.status === 'enabled' && (
          <div className="w-full flex flex-col items-center gap-4 text-center max-w-sm">
            <h3
              className="text-base font-bold text-primary"
              data-testid={TotpMainTestTags.ENABLED_TITLE}
            >
              {strings.totp_enabled_title}
            </h3>
            <p
              className="text-xs text-muted-foreground"
              data-testid={TotpMainTestTags.ENABLED_DESC}
            >
              {strings.totp_enabled_desc}
            </p>

            <div className="w-full flex flex-col gap-2 pt-4">
              <CoreButton
                type="button"
                label={strings.recovery_codes_title}
                onClick={onRecoveryCodesClick}
                disabled={screenState.actionLoading}
                data-testid={TotpMainTestTags.RECOVERY_CODES_BUTTON}
              />

              <CoreButton
                type="button"
                label={strings.disable_totp}
                onClick={onDisableClick}
                disabled={screenState.actionLoading}
                className="bg-error hover:bg-error/90 text-error-foreground"
                data-testid={TotpMainTestTags.DISABLE_TOTP_BUTTON}
              />
            </div>

            {screenState.actionError && (
              <CoreErrorText
                text={errorParser.parse(screenState.actionError) ?? ''}
                data-testid={TotpMainTestTags.ENABLED_ACTION_ERROR_TEXT}
              />
            )}
          </div>
        )}
      </div>

      {screenState.status === 'enabled' && screenState.showDisableConfirmation && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="disable-totp-dialog-title"
          aria-describedby="disable-totp-dialog-desc"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismissDialogs}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <h3 id="disable-totp-dialog-title" className="text-lg font-bold text-surface-foreground">
              {strings.dialog_confirm_title}
            </h3>
            <p id="disable-totp-dialog-desc" className="text-sm text-muted-foreground">
              {strings.disable_totp_confirm_msg}
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
                onClick={onConfirmDisable}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Props for {@link TotpMainScreen}.
 */
export interface TotpMainScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: TotpMainStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component for managing Two-Factor Authentication (TOTP setup, QR code display, and disabling).
 */
export const TotpMainScreen = forwardRef<HTMLDivElement, TotpMainScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <TotpMainProvider dependencies={dependencies}>
          <TotpMainContent strings={strings} />
        </TotpMainProvider>
      </div>
    )
  }
)

TotpMainScreen.displayName = 'TotpMainScreen'

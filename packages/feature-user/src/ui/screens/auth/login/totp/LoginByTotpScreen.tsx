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
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import { FieldValidator } from '@/validator/field-validator'
import {
  LoginByTotpMode,
  LoginByTotpProvider,
  useLoginByTotpStore
} from '@/ui/screens/auth/login/totp/login-by-totp-store'
import type { LoginByTotpStoreDependencies } from "@/ui/screens/auth/login/totp/login-by-totp-store";

const LoginByTotpContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useLoginByTotpStore((s) => s.screenState)
  const onCodeChanged = useLoginByTotpStore((s) => s.onCodeChanged)
  const onToggleModeClick = useLoginByTotpStore((s) => s.onToggleModeClick)
  const onSubmitClick = useLoginByTotpStore((s) => s.onSubmitClick)
  const onBackClick = useLoginByTotpStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  const { code, mode, actionLoading, actionError } = screenState

  const isCodeValid =
    mode === LoginByTotpMode.TOTP
      ? FieldValidator.isValidTotp(code)
      : code.trim().length > 0

  const canSubmit = isCodeValid && !actionLoading

  const title =
    mode === LoginByTotpMode.TOTP
      ? strings.login_by_totp
      : strings.login_by_recovery_code

  const description =
    mode === LoginByTotpMode.TOTP
      ? strings.login_by_totp_desc(6)
      : strings.login_by_recovery_code_desc

  const fieldLabel =
    mode === LoginByTotpMode.TOTP
      ? strings.totp_code
      : strings.recovery_code

  const toggleModeLabel =
    mode === LoginByTotpMode.TOTP
      ? strings.use_recovery_code
      : strings.use_totp

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitClick()
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
          text={title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 my-auto">
        <p className="text-center text-muted-foreground text-sm">
          {description}
        </p>

        {mode === LoginByTotpMode.TOTP ? (
          <CoreCodeTextField
            value={code}
            onChange={(e) => onCodeChanged(e.target.value)}
            label={fieldLabel}
            placeholder={fieldLabel}
            isError={Boolean(actionError)}
            disabled={actionLoading}
            autoFocus
          />
        ) : (
          <CoreOutlinedTextField
            value={code}
            onChange={(e) => onCodeChanged(e.target.value)}
            label={fieldLabel}
            placeholder={fieldLabel}
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
          label={strings.login}
          disabled={!canSubmit}
          onClick={onSubmitClick}
        />

        <CoreTextButton
          type="button"
          label={toggleModeLabel}
          onClick={onToggleModeClick}
          disabled={actionLoading}
        />
      </div>

      {actionLoading && <FullscreenOverlayLoading />}
    </form>
  )
}

/**
 * Props for the {@link LoginByTotpScreen} component.
 */
export interface LoginByTotpScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Screen dependencies for state management and MFA verification.
   */
  dependencies: LoginByTotpStoreDependencies
  /**
   * Localized strings dictionary override.
   */
  strings?: FeatureUserStrings
}

/**
 * Screen component for MFA TOTP verification and backup recovery code sign-in.
 */
export const LoginByTotpScreen = forwardRef<HTMLDivElement, LoginByTotpScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <LoginByTotpProvider dependencies={dependencies}>
          <LoginByTotpContent strings={strings} />
        </LoginByTotpProvider>
      </div>
    )
  }
)

LoginByTotpScreen.displayName = 'LoginByTotpScreen'

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
import { LoginByTotpMode, UserModuleStrings, formatLocalizedString } from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@/validator/field-validator'
import {
  LoginByTotpProvider,
  useLoginByTotpStore
} from '@/ui/screens/auth/login/totp/login-by-totp-store'
import type { LoginByTotpStoreDependencies } from '@/ui/screens/auth/login/totp/login-by-totp-store'

const defaultUserStrings = new UserModuleStrings()

const LoginByTotpContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const deps = useLoginByTotpStore((s) => s.dependencies)
  const screenState = useLoginByTotpStore((s) => s.screenState)
  const onCodeChanged = useLoginByTotpStore((s) => s.onCodeChanged)
  const onToggleModeClick = useLoginByTotpStore((s) => s.onToggleModeClick)
  const onSubmitClick = useLoginByTotpStore((s) => s.onSubmitClick)
  const onBackClick = useLoginByTotpStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  const { code, actionLoading, actionError } = screenState
  const mode = deps.loginTotpMode ?? LoginByTotpMode.TOTP

  const isCodeValid =
    mode === LoginByTotpMode.TOTP
      ? FieldValidator.isValidTotp(code)
      : code.trim().length > 0

  const canSubmit = isCodeValid && !actionLoading

  const title =
    mode === LoginByTotpMode.TOTP
      ? strings.ui.loginByTotp
      : strings.ui.loginByRecoveryCode

  const description =
    mode === LoginByTotpMode.TOTP
      ? strings.ui.loginByTotpDesc(6)
      : strings.ui.loginByRecoveryCodeDesc

  const fieldLabel =
    mode === LoginByTotpMode.TOTP
      ? strings.ui.totpCode
      : strings.ui.recoveryCode

  const toggleModeLabel =
    mode === LoginByTotpMode.TOTP
      ? strings.ui.useRecoveryCode
      : strings.ui.useTotp

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
          label={strings.ui.login}
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

export interface LoginByTotpScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: LoginByTotpStoreDependencies
  strings?: UserModuleStrings
}

export const LoginByTotpScreen = forwardRef<HTMLDivElement, LoginByTotpScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
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

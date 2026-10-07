import React, { forwardRef, useEffect, useId } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  CoreTextButton,
  CoreTitleText,
  FullscreenError,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'
import {
  EditSecuritySettingsProvider,
  useEditSecuritySettingsStore
} from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'
import type { EditSecuritySettingsStoreDependencies } from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'

const EditSecuritySettingsContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useEditSecuritySettingsStore((s) => s.screenState)
  const onRetry = useEditSecuritySettingsStore((s) => s.onRetry)
  const onRecentAuthenticationValidityForOpenUserChanged = useEditSecuritySettingsStore((s) => s.onRecentAuthenticationValidityForOpenUserChanged)
  const onRecentAuthenticationValidityForManagementUserChanged = useEditSecuritySettingsStore((s) => s.onRecentAuthenticationValidityForManagementUserChanged)
  const onMfaTokenExpirationSecondsChanged = useEditSecuritySettingsStore((s) => s.onMfaTokenExpirationSecondsChanged)
  const onPasswordMinLengthChanged = useEditSecuritySettingsStore((s) => s.onPasswordMinLengthChanged)
  const onPasswordRequireLetterToggled = useEditSecuritySettingsStore((s) => s.onPasswordRequireLetterToggled)
  const onPasswordRequireUpperCaseToggled = useEditSecuritySettingsStore((s) => s.onPasswordRequireUpperCaseToggled)
  const onPasswordRequireLowerCaseToggled = useEditSecuritySettingsStore((s) => s.onPasswordRequireLowerCaseToggled)
  const onPasswordRequireDigitToggled = useEditSecuritySettingsStore((s) => s.onPasswordRequireDigitToggled)
  const onPasswordRequireSpecialCharToggled = useEditSecuritySettingsStore((s) => s.onPasswordRequireSpecialCharToggled)
  const onCommonPasswordsChanged = useEditSecuritySettingsStore((s) => s.onCommonPasswordsChanged)
  const onAccountLockoutMaxFailedPasswordAttemptsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutMaxFailedPasswordAttemptsChanged)
  const onAccountLockoutMaxFailedOtpAttemptsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutMaxFailedOtpAttemptsChanged)
  const onAccountLockoutMaxFailedTotpAttemptsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutMaxFailedTotpAttemptsChanged)
  const onAccountLockoutFailedAttemptsWindowSecondsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutFailedAttemptsWindowSecondsChanged)
  const onAccountLockoutDurationSecondsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutDurationSecondsChanged)
  const onAccountLockoutIndefiniteLockoutThresholdChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutIndefiniteLockoutThresholdChanged)
  const onAccountLockoutIsSelfServiceUnlockEnabledToggled = useEditSecuritySettingsStore((s) => s.onAccountLockoutIsSelfServiceUnlockEnabledToggled)
  const onAccountLockoutCheckIntervalSecondsChanged = useEditSecuritySettingsStore((s) => s.onAccountLockoutCheckIntervalSecondsChanged)
  const onRefreshTokenRotationGracePeriodSecondsChanged = useEditSecuritySettingsStore((s) => s.onRefreshTokenRotationGracePeriodSecondsChanged)
  const onOpenIpBlacklistEnabledToggled = useEditSecuritySettingsStore((s) => s.onOpenIpBlacklistEnabledToggled)
  const onOpenIpBlacklistChanged = useEditSecuritySettingsStore((s) => s.onOpenIpBlacklistChanged)
  const onOpenIpWhitelistEnabledToggled = useEditSecuritySettingsStore((s) => s.onOpenIpWhitelistEnabledToggled)
  const onOpenIpWhitelistChanged = useEditSecuritySettingsStore((s) => s.onOpenIpWhitelistChanged)
  const onManagementIpBlacklistEnabledToggled = useEditSecuritySettingsStore((s) => s.onManagementIpBlacklistEnabledToggled)
  const onManagementIpBlacklistChanged = useEditSecuritySettingsStore((s) => s.onManagementIpBlacklistChanged)
  const onManagementIpWhitelistEnabledToggled = useEditSecuritySettingsStore((s) => s.onManagementIpWhitelistEnabledToggled)
  const onManagementIpWhitelistChanged = useEditSecuritySettingsStore((s) => s.onManagementIpWhitelistChanged)
  const onOtpRetryAfterSecondsChanged = useEditSecuritySettingsStore((s) => s.onOtpRetryAfterSecondsChanged)
  const onOtpNumberOfSymbolsChanged = useEditSecuritySettingsStore((s) => s.onOtpNumberOfSymbolsChanged)
  const onOtpExpirationSecondsChanged = useEditSecuritySettingsStore((s) => s.onOtpExpirationSecondsChanged)
  const onMaxRequestsPerPeriodChanged = useEditSecuritySettingsStore((s) => s.onMaxRequestsPerPeriodChanged)
  const onRateLimitPeriodSecondsChanged = useEditSecuritySettingsStore((s) => s.onRateLimitPeriodSecondsChanged)
  const onSaveClick = useEditSecuritySettingsStore((s) => s.onSaveClick)
  const onResetClick = useEditSecuritySettingsStore((s) => s.onResetClick)
  const onBackClick = useEditSecuritySettingsStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const reqLetterId = useId()
  const reqUpperId = useId()
  const reqLowerId = useId()
  const reqDigitId = useId()
  const reqSpecialId = useId()
  const selfServiceUnlockId = useId()
  const openIpBlacklistId = useId()
  const openIpWhitelistId = useId()
  const mgmtIpBlacklistId = useId()
  const mgmtIpWhitelistId = useId()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={onRetry}
        onBack={onBackClick}
        title={strings.edit_security_settings_title}
        strings={strings}
      />
    )
  }

  const {
    recentAuthenticationValiditySecondsForOpenUser,
    recentAuthenticationValiditySecondsForManagementUser,
    mfaTokenExpirationSeconds,
    passwordMinLength,
    passwordRequireLetter,
    passwordRequireUpperCase,
    passwordRequireLowerCase,
    passwordRequireDigit,
    passwordRequireSpecialChar,
    commonPasswords,
    accountLockoutMaxFailedPasswordAttempts,
    accountLockoutMaxFailedOtpAttempts,
    accountLockoutMaxFailedTotpAttempts,
    accountLockoutFailedAttemptsWindowSeconds,
    accountLockoutDurationSeconds,
    accountLockoutIndefiniteLockoutThreshold,
    accountLockoutIsSelfServiceUnlockEnabled,
    accountLockoutCheckIntervalSeconds,
    refreshTokenRotationGracePeriodSeconds,
    openIpBlacklistEnabled,
    openIpBlacklist,
    openIpWhitelistEnabled,
    openIpWhitelist,
    managementIpBlacklistEnabled,
    managementIpBlacklist,
    managementIpWhitelistEnabled,
    managementIpWhitelist,
    otpRetryAfterSeconds,
    otpNumberOfSymbols,
    otpExpirationSeconds,
    maxRequestsPerPeriod,
    rateLimitPeriodSeconds,
    isSaving,
    saveError
  } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveClick()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
    >
      <div className="w-full flex items-center justify-between relative mb-6">
        <CoreBackButton
          onClick={onBackClick}
          disabled={isSaving}
        />
        <CoreScreenTitleText
          text={strings.edit_security_settings_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6 mb-6">
        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.general_security} />

          <CoreOutlinedTextField
            value={recentAuthenticationValiditySecondsForOpenUser}
            onChange={(e) => onRecentAuthenticationValidityForOpenUserChanged(e.target.value)}
            label={strings.recent_authentication_validity_seconds}
            placeholder={strings.recent_authentication_validity_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={recentAuthenticationValiditySecondsForManagementUser}
            onChange={(e) => onRecentAuthenticationValidityForManagementUserChanged(e.target.value)}
            label={strings.recent_authentication_validity_for_management}
            placeholder={strings.recent_authentication_validity_for_management}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={mfaTokenExpirationSeconds}
            onChange={(e) => onMfaTokenExpirationSecondsChanged(e.target.value)}
            label={strings.mfa_token_expiration_seconds}
            placeholder={strings.mfa_token_expiration_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={refreshTokenRotationGracePeriodSeconds}
            onChange={(e) => onRefreshTokenRotationGracePeriodSecondsChanged(e.target.value)}
            label={strings.refresh_token_rotation_grace_period_seconds}
            placeholder={strings.refresh_token_rotation_grace_period_seconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.rate_limiting} />

          <CoreOutlinedTextField
            value={maxRequestsPerPeriod}
            onChange={(e) => onMaxRequestsPerPeriodChanged(e.target.value)}
            label={strings.max_requests_per_period}
            placeholder={strings.max_requests_per_period}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={rateLimitPeriodSeconds}
            onChange={(e) => onRateLimitPeriodSecondsChanged(e.target.value)}
            label={strings.rate_limit_period_seconds}
            placeholder={strings.rate_limit_period_seconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.password_policy} />

          <CoreOutlinedTextField
            value={passwordMinLength}
            onChange={(e) => onPasswordMinLengthChanged(e.target.value)}
            label={strings.password_min_length}
            placeholder={strings.password_min_length}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={reqLetterId}
              type="checkbox"
              checked={passwordRequireLetter}
              disabled={isSaving}
              onChange={(e) => onPasswordRequireLetterToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={reqLetterId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.password_require_letter}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={reqUpperId}
              type="checkbox"
              checked={passwordRequireUpperCase}
              disabled={isSaving}
              onChange={(e) => onPasswordRequireUpperCaseToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={reqUpperId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.password_require_uppercase}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={reqLowerId}
              type="checkbox"
              checked={passwordRequireLowerCase}
              disabled={isSaving}
              onChange={(e) => onPasswordRequireLowerCaseToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={reqLowerId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.password_require_lowercase}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={reqDigitId}
              type="checkbox"
              checked={passwordRequireDigit}
              disabled={isSaving}
              onChange={(e) => onPasswordRequireDigitToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={reqDigitId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.password_require_digit}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={reqSpecialId}
              type="checkbox"
              checked={passwordRequireSpecialChar}
              disabled={isSaving}
              onChange={(e) => onPasswordRequireSpecialCharToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={reqSpecialId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.password_require_special_char}
            </label>
          </div>

          <CoreOutlinedTextField
            value={commonPasswords}
            onChange={(e) => onCommonPasswordsChanged(e.target.value)}
            label={strings.common_passwords_placeholder}
            placeholder={strings.common_passwords_placeholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.account_lockout_policy_section} />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedPasswordAttempts}
            onChange={(e) => onAccountLockoutMaxFailedPasswordAttemptsChanged(e.target.value)}
            label={strings.max_failed_password_attempts}
            placeholder={strings.max_failed_password_attempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedOtpAttempts}
            onChange={(e) => onAccountLockoutMaxFailedOtpAttemptsChanged(e.target.value)}
            label={strings.max_failed_otp_attempts}
            placeholder={strings.max_failed_otp_attempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedTotpAttempts}
            onChange={(e) => onAccountLockoutMaxFailedTotpAttemptsChanged(e.target.value)}
            label={strings.max_failed_totp_attempts}
            placeholder={strings.max_failed_totp_attempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutFailedAttemptsWindowSeconds}
            onChange={(e) => onAccountLockoutFailedAttemptsWindowSecondsChanged(e.target.value)}
            label={strings.failed_attempts_window_seconds}
            placeholder={strings.failed_attempts_window_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutDurationSeconds}
            onChange={(e) => onAccountLockoutDurationSecondsChanged(e.target.value)}
            label={strings.lockout_duration_seconds}
            placeholder={strings.lockout_duration_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutIndefiniteLockoutThreshold}
            onChange={(e) => onAccountLockoutIndefiniteLockoutThresholdChanged(e.target.value)}
            label={strings.indefinite_lockout_threshold}
            placeholder={strings.indefinite_lockout_threshold}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={selfServiceUnlockId}
              type="checkbox"
              checked={accountLockoutIsSelfServiceUnlockEnabled}
              disabled={isSaving}
              onChange={(e) => onAccountLockoutIsSelfServiceUnlockEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={selfServiceUnlockId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.self_service_unlock_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={accountLockoutCheckIntervalSeconds}
            onChange={(e) => onAccountLockoutCheckIntervalSecondsChanged(e.target.value)}
            label={strings.account_lockout_check_interval_seconds}
            placeholder={strings.account_lockout_check_interval_seconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.open_ip_restriction_policy} />

          <div className="flex items-center gap-2">
            <input
              id={openIpBlacklistId}
              type="checkbox"
              checked={openIpBlacklistEnabled}
              disabled={isSaving}
              onChange={(e) => onOpenIpBlacklistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={openIpBlacklistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.blacklist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openIpBlacklist}
            onChange={(e) => onOpenIpBlacklistChanged(e.target.value)}
            label={strings.blacklist_placeholder}
            placeholder={strings.blacklist_placeholder}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={openIpWhitelistId}
              type="checkbox"
              checked={openIpWhitelistEnabled}
              disabled={isSaving}
              onChange={(e) => onOpenIpWhitelistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={openIpWhitelistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.whitelist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openIpWhitelist}
            onChange={(e) => onOpenIpWhitelistChanged(e.target.value)}
            label={strings.whitelist_placeholder}
            placeholder={strings.whitelist_placeholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.management_ip_restriction_policy} />

          <div className="flex items-center gap-2">
            <input
              id={mgmtIpBlacklistId}
              type="checkbox"
              checked={managementIpBlacklistEnabled}
              disabled={isSaving}
              onChange={(e) => onManagementIpBlacklistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={mgmtIpBlacklistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.blacklist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementIpBlacklist}
            onChange={(e) => onManagementIpBlacklistChanged(e.target.value)}
            label={strings.blacklist_placeholder}
            placeholder={strings.blacklist_placeholder}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={mgmtIpWhitelistId}
              type="checkbox"
              checked={managementIpWhitelistEnabled}
              disabled={isSaving}
              onChange={(e) => onManagementIpWhitelistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={mgmtIpWhitelistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.whitelist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementIpWhitelist}
            onChange={(e) => onManagementIpWhitelistChanged(e.target.value)}
            label={strings.whitelist_placeholder}
            placeholder={strings.whitelist_placeholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.otp_confirmation} />

          <CoreOutlinedTextField
            value={otpRetryAfterSeconds}
            onChange={(e) => onOtpRetryAfterSecondsChanged(e.target.value)}
            label={strings.otp_retry_after_seconds}
            placeholder={strings.otp_retry_after_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={otpNumberOfSymbols}
            onChange={(e) => onOtpNumberOfSymbolsChanged(e.target.value)}
            label={strings.otp_number_of_symbols}
            placeholder={strings.otp_number_of_symbols}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={otpExpirationSeconds}
            onChange={(e) => onOtpExpirationSecondsChanged(e.target.value)}
            label={strings.otp_expiration_seconds}
            placeholder={strings.otp_expiration_seconds}
            disabled={isSaving}
          />
        </div>

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden w-full text-center',
            saveError ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          )}
        >
          {saveError && (
            <CoreErrorText text={errorParser.parse(saveError) ?? ''} />
          )}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 pt-4 border-t border-border">
        <CoreButton
          type="submit"
          label={isSaving ? strings.saving : strings.save}
          disabled={isSaving}
          onClick={onSaveClick}
        />
        <CoreTextButton
          type="button"
          label={strings.reset_to_defaults}
          disabled={isSaving}
          onClick={onResetClick}
        />
      </div>
    </form>
  )
}

const EditSecuritySettingsController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useEditSecuritySettingsStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <EditSecuritySettingsContent strings={strings} />
}

export interface EditSecuritySettingsScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: EditSecuritySettingsStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const EditSecuritySettingsScreen = forwardRef<HTMLDivElement, EditSecuritySettingsScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <EditSecuritySettingsProvider dependencies={dependencies}>
          <EditSecuritySettingsController strings={strings} />
        </EditSecuritySettingsProvider>
      </div>
    )
  }
)

EditSecuritySettingsScreen.displayName = 'EditSecuritySettingsScreen'

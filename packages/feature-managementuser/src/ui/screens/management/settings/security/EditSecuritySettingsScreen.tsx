import React, { forwardRef, useEffect, useId } from 'react'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
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
import {
  EditSecuritySettingsProvider,
  useEditSecuritySettingsStore
} from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'
import type { EditSecuritySettingsStoreDependencies } from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'

const defaultUserStrings = new UserModuleStrings()

const EditSecuritySettingsContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
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
        title={strings.ui.editSecuritySettingsTitle}
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
          text={strings.ui.editSecuritySettingsTitle}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6 mb-6">
        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.generalSecurity} />

          <CoreOutlinedTextField
            value={recentAuthenticationValiditySecondsForOpenUser}
            onChange={(e) => onRecentAuthenticationValidityForOpenUserChanged(e.target.value)}
            label={strings.ui.recentAuthenticationValiditySeconds}
            placeholder={strings.ui.recentAuthenticationValiditySeconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={recentAuthenticationValiditySecondsForManagementUser}
            onChange={(e) => onRecentAuthenticationValidityForManagementUserChanged(e.target.value)}
            label={strings.ui.recentAuthenticationValidityForManagement}
            placeholder={strings.ui.recentAuthenticationValidityForManagement}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={mfaTokenExpirationSeconds}
            onChange={(e) => onMfaTokenExpirationSecondsChanged(e.target.value)}
            label={strings.ui.mfaTokenExpirationSeconds}
            placeholder={strings.ui.mfaTokenExpirationSeconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={refreshTokenRotationGracePeriodSeconds}
            onChange={(e) => onRefreshTokenRotationGracePeriodSecondsChanged(e.target.value)}
            label={strings.ui.refreshTokenRotationGracePeriodSeconds}
            placeholder={strings.ui.refreshTokenRotationGracePeriodSeconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.rateLimiting} />

          <CoreOutlinedTextField
            value={maxRequestsPerPeriod}
            onChange={(e) => onMaxRequestsPerPeriodChanged(e.target.value)}
            label={strings.ui.maxRequestsPerPeriod}
            placeholder={strings.ui.maxRequestsPerPeriod}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={rateLimitPeriodSeconds}
            onChange={(e) => onRateLimitPeriodSecondsChanged(e.target.value)}
            label={strings.ui.rateLimitPeriodSeconds}
            placeholder={strings.ui.rateLimitPeriodSeconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.passwordPolicy} />

          <CoreOutlinedTextField
            value={passwordMinLength}
            onChange={(e) => onPasswordMinLengthChanged(e.target.value)}
            label={strings.ui.passwordMinLength}
            placeholder={strings.ui.passwordMinLength}
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
              {strings.ui.passwordRequireLetter}
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
              {strings.ui.passwordRequireUppercase}
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
              {strings.ui.passwordRequireLowercase}
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
              {strings.ui.passwordRequireDigit}
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
              {strings.ui.passwordRequireSpecialChar}
            </label>
          </div>

          <CoreOutlinedTextField
            value={commonPasswords}
            onChange={(e) => onCommonPasswordsChanged(e.target.value)}
            label={strings.ui.commonPasswordsPlaceholder}
            placeholder={strings.ui.commonPasswordsPlaceholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.accountLockoutPolicySection} />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedPasswordAttempts}
            onChange={(e) => onAccountLockoutMaxFailedPasswordAttemptsChanged(e.target.value)}
            label={strings.ui.maxFailedPasswordAttempts}
            placeholder={strings.ui.maxFailedPasswordAttempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedOtpAttempts}
            onChange={(e) => onAccountLockoutMaxFailedOtpAttemptsChanged(e.target.value)}
            label={strings.ui.maxFailedOtpAttempts}
            placeholder={strings.ui.maxFailedOtpAttempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutMaxFailedTotpAttempts}
            onChange={(e) => onAccountLockoutMaxFailedTotpAttemptsChanged(e.target.value)}
            label={strings.ui.maxFailedTotpAttempts}
            placeholder={strings.ui.maxFailedTotpAttempts}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutFailedAttemptsWindowSeconds}
            onChange={(e) => onAccountLockoutFailedAttemptsWindowSecondsChanged(e.target.value)}
            label={strings.ui.failedAttemptsWindowSeconds}
            placeholder={strings.ui.failedAttemptsWindowSeconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutDurationSeconds}
            onChange={(e) => onAccountLockoutDurationSecondsChanged(e.target.value)}
            label={strings.ui.lockoutDurationSeconds}
            placeholder={strings.ui.lockoutDurationSeconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountLockoutIndefiniteLockoutThreshold}
            onChange={(e) => onAccountLockoutIndefiniteLockoutThresholdChanged(e.target.value)}
            label={strings.ui.indefiniteLockoutThreshold}
            placeholder={strings.ui.indefiniteLockoutThreshold}
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
              {strings.ui.selfServiceUnlockEnabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={accountLockoutCheckIntervalSeconds}
            onChange={(e) => onAccountLockoutCheckIntervalSecondsChanged(e.target.value)}
            label={strings.ui.accountLockoutCheckIntervalSeconds}
            placeholder={strings.ui.accountLockoutCheckIntervalSeconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.openIpRestrictionPolicy} />

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
              {strings.ui.blacklistEnabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openIpBlacklist}
            onChange={(e) => onOpenIpBlacklistChanged(e.target.value)}
            label={strings.ui.blacklistPlaceholder}
            placeholder={strings.ui.blacklistPlaceholder}
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
              {strings.ui.whitelistEnabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openIpWhitelist}
            onChange={(e) => onOpenIpWhitelistChanged(e.target.value)}
            label={strings.ui.whitelistPlaceholder}
            placeholder={strings.ui.whitelistPlaceholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.managementIpRestrictionPolicy} />

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
              {strings.ui.blacklistEnabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementIpBlacklist}
            onChange={(e) => onManagementIpBlacklistChanged(e.target.value)}
            label={strings.ui.blacklistPlaceholder}
            placeholder={strings.ui.blacklistPlaceholder}
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
              {strings.ui.whitelistEnabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementIpWhitelist}
            onChange={(e) => onManagementIpWhitelistChanged(e.target.value)}
            label={strings.ui.whitelistPlaceholder}
            placeholder={strings.ui.whitelistPlaceholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.otpConfirmation} />

          <CoreOutlinedTextField
            value={otpRetryAfterSeconds}
            onChange={(e) => onOtpRetryAfterSecondsChanged(e.target.value)}
            label={strings.ui.otpRetryAfterSeconds}
            placeholder={strings.ui.otpRetryAfterSeconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={otpNumberOfSymbols}
            onChange={(e) => onOtpNumberOfSymbolsChanged(e.target.value)}
            label={strings.ui.otpNumberOfSymbols}
            placeholder={strings.ui.otpNumberOfSymbols}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={otpExpirationSeconds}
            onChange={(e) => onOtpExpirationSecondsChanged(e.target.value)}
            label={strings.ui.otpExpirationSeconds}
            placeholder={strings.ui.otpExpirationSeconds}
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
          label={isSaving ? strings.ui.saving : strings.ui.save}
          disabled={isSaving}
          onClick={onSaveClick}
        />
        <CoreTextButton
          type="button"
          label={strings.ui.resetToDefaults}
          disabled={isSaving}
          onClick={onResetClick}
        />
      </div>
    </form>
  )
}

const EditSecuritySettingsController: React.FC<{ strings?: UserModuleStrings }> = ({
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
  strings?: UserModuleStrings
}

export const EditSecuritySettingsScreen = forwardRef<HTMLDivElement, EditSecuritySettingsScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
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

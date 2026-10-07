import React, { forwardRef, useEffect, useId } from 'react'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
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
  EditAuthSettingsProvider,
  useEditAuthSettingsStore
} from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'

const EditAuthSettingsContent: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings = enManagementUserStrings
}) => {
  const screenState = useEditAuthSettingsStore((s) => s.screenState)
  const onRetry = useEditAuthSettingsStore((s) => s.onRetry)
  const onProviderToggled = useEditAuthSettingsStore((s) => s.onProviderToggled)
  const onMaxTotalIdentifiersChanged = useEditAuthSettingsStore((s) => s.onMaxTotalIdentifiersChanged)
  const onMaxEmailIdentifiersChanged = useEditAuthSettingsStore((s) => s.onMaxEmailIdentifiersChanged)
  const onMaxPhoneIdentifiersChanged = useEditAuthSettingsStore((s) => s.onMaxPhoneIdentifiersChanged)
  const onMaxIdentifiersPerExternalProviderChanged = useEditAuthSettingsStore((s) => s.onMaxIdentifiersPerExternalProviderChanged)
  const onMaxActiveSessionsForOpenUserChanged = useEditAuthSettingsStore((s) => s.onMaxActiveSessionsForOpenUserChanged)
  const onMaxActiveSessionsForManagementUserChanged = useEditAuthSettingsStore((s) => s.onMaxActiveSessionsForManagementUserChanged)
  const onAccessTokenExpirationSecondsChanged = useEditAuthSettingsStore((s) => s.onAccessTokenExpirationSecondsChanged)
  const onRefreshTokenExpirationSecondsChanged = useEditAuthSettingsStore((s) => s.onRefreshTokenExpirationSecondsChanged)
  const onAccountDeletionGracePeriodSecondsChanged = useEditAuthSettingsStore((s) => s.onAccountDeletionGracePeriodSecondsChanged)
  const onAccountDeletionCheckIntervalSecondsChanged = useEditAuthSettingsStore((s) => s.onAccountDeletionCheckIntervalSecondsChanged)
  const onRegistrationEnabledToggled = useEditAuthSettingsStore((s) => s.onRegistrationEnabledToggled)
  const onOpenEmailBlacklistEnabledToggled = useEditAuthSettingsStore((s) => s.onOpenEmailBlacklistEnabledToggled)
  const onOpenEmailBlacklistChanged = useEditAuthSettingsStore((s) => s.onOpenEmailBlacklistChanged)
  const onOpenEmailWhitelistEnabledToggled = useEditAuthSettingsStore((s) => s.onOpenEmailWhitelistEnabledToggled)
  const onOpenEmailWhitelistChanged = useEditAuthSettingsStore((s) => s.onOpenEmailWhitelistChanged)
  const onManagementEmailBlacklistEnabledToggled = useEditAuthSettingsStore((s) => s.onManagementEmailBlacklistEnabledToggled)
  const onManagementEmailBlacklistChanged = useEditAuthSettingsStore((s) => s.onManagementEmailBlacklistChanged)
  const onManagementEmailWhitelistEnabledToggled = useEditAuthSettingsStore((s) => s.onManagementEmailWhitelistEnabledToggled)
  const onManagementEmailWhitelistChanged = useEditAuthSettingsStore((s) => s.onManagementEmailWhitelistChanged)
  const onSaveClick = useEditAuthSettingsStore((s) => s.onSaveClick)
  const onResetClick = useEditAuthSettingsStore((s) => s.onResetClick)
  const onBackClick = useEditAuthSettingsStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const providerBaseId = useId()
  const isRegistrationId = useId()
  const openBlacklistId = useId()
  const openWhitelistId = useId()
  const managementBlacklistId = useId()
  const managementWhitelistId = useId()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={onRetry}
        onBack={onBackClick}
        title={strings.edit_auth_settings_title}
        strings={strings}
      />
    )
  }

  const {
    enabledProviders,
    maxTotalIdentifiers,
    maxEmailIdentifiers,
    maxPhoneIdentifiers,
    maxIdentifiersPerExternalProvider,
    maxActiveSessionsForOpenUser,
    maxActiveSessionsForManagementUser,
    accessTokenExpirationSeconds,
    refreshTokenExpirationSeconds,
    accountDeletionGracePeriodSeconds,
    accountDeletionCheckIntervalSeconds,
    isRegistrationEnabled,
    openEmailBlacklistEnabled,
    openEmailBlacklist,
    openEmailWhitelistEnabled,
    openEmailWhitelist,
    managementEmailBlacklistEnabled,
    managementEmailBlacklist,
    managementEmailWhitelistEnabled,
    managementEmailWhitelist,
    isSaving,
    saveError
  } = screenState

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveClick()
  }

  const allProviders = [
    UserAuthProvider.EMAIL,
    UserAuthProvider.PHONE,
    UserAuthProvider.GOOGLE,
    UserAuthProvider.APPLE
  ]

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
          text={strings.edit_auth_settings_title}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6 mb-6">
        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.enabled_auth_providers} />
          <div className="flex flex-col gap-2">
            {allProviders.map((provider) => {
              const inputId = `${providerBaseId}_${provider}`
              return (
                <div key={provider} className="flex items-center gap-2">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={enabledProviders.has(provider)}
                    disabled={isSaving}
                    onChange={(e) => onProviderToggled(provider, e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor={inputId} className="text-sm text-surface-foreground cursor-pointer">
                    {provider}
                  </label>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              id={isRegistrationId}
              type="checkbox"
              checked={isRegistrationEnabled}
              disabled={isSaving}
              onChange={(e) => onRegistrationEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={isRegistrationId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.is_registration_enabled}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.limits_and_expirations} />

          <CoreOutlinedTextField
            value={maxTotalIdentifiers}
            onChange={(e) => onMaxTotalIdentifiersChanged(e.target.value)}
            label={strings.max_total_identifiers}
            placeholder={strings.max_total_identifiers}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={maxEmailIdentifiers}
            onChange={(e) => onMaxEmailIdentifiersChanged(e.target.value)}
            label={strings.max_email_identifiers}
            placeholder={strings.max_email_identifiers}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={maxPhoneIdentifiers}
            onChange={(e) => onMaxPhoneIdentifiersChanged(e.target.value)}
            label={strings.max_phone_identifiers}
            placeholder={strings.max_phone_identifiers}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={maxIdentifiersPerExternalProvider}
            onChange={(e) => onMaxIdentifiersPerExternalProviderChanged(e.target.value)}
            label={strings.max_identifiers_per_external_provider}
            placeholder={strings.max_identifiers_per_external_provider}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={maxActiveSessionsForOpenUser}
            onChange={(e) => onMaxActiveSessionsForOpenUserChanged(e.target.value)}
            label={strings.max_active_sessions_open}
            placeholder={strings.max_active_sessions_open}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={maxActiveSessionsForManagementUser}
            onChange={(e) => onMaxActiveSessionsForManagementUserChanged(e.target.value)}
            label={strings.max_active_sessions_management}
            placeholder={strings.max_active_sessions_management}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accessTokenExpirationSeconds}
            onChange={(e) => onAccessTokenExpirationSecondsChanged(e.target.value)}
            label={strings.access_token_expiration_seconds}
            placeholder={strings.access_token_expiration_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={refreshTokenExpirationSeconds}
            onChange={(e) => onRefreshTokenExpirationSecondsChanged(e.target.value)}
            label={strings.refresh_token_expiration_seconds}
            placeholder={strings.refresh_token_expiration_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountDeletionGracePeriodSeconds}
            onChange={(e) => onAccountDeletionGracePeriodSecondsChanged(e.target.value)}
            label={strings.account_deletion_delay_seconds}
            placeholder={strings.account_deletion_delay_seconds}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={accountDeletionCheckIntervalSeconds}
            onChange={(e) => onAccountDeletionCheckIntervalSecondsChanged(e.target.value)}
            label={strings.account_deletion_check_interval_seconds}
            placeholder={strings.account_deletion_check_interval_seconds}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.open_email_restriction_policy} />

          <div className="flex items-center gap-2">
            <input
              id={openBlacklistId}
              type="checkbox"
              checked={openEmailBlacklistEnabled}
              disabled={isSaving}
              onChange={(e) => onOpenEmailBlacklistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={openBlacklistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.blacklist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openEmailBlacklist}
            onChange={(e) => onOpenEmailBlacklistChanged(e.target.value)}
            label={strings.email_blacklist_placeholder}
            placeholder={strings.email_blacklist_placeholder}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={openWhitelistId}
              type="checkbox"
              checked={openEmailWhitelistEnabled}
              disabled={isSaving}
              onChange={(e) => onOpenEmailWhitelistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={openWhitelistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.whitelist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={openEmailWhitelist}
            onChange={(e) => onOpenEmailWhitelistChanged(e.target.value)}
            label={strings.email_whitelist_placeholder}
            placeholder={strings.email_whitelist_placeholder}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.management_email_restriction_policy} />

          <div className="flex items-center gap-2">
            <input
              id={managementBlacklistId}
              type="checkbox"
              checked={managementEmailBlacklistEnabled}
              disabled={isSaving}
              onChange={(e) => onManagementEmailBlacklistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={managementBlacklistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.blacklist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementEmailBlacklist}
            onChange={(e) => onManagementEmailBlacklistChanged(e.target.value)}
            label={strings.email_blacklist_placeholder}
            placeholder={strings.email_blacklist_placeholder}
            disabled={isSaving}
          />

          <div className="flex items-center gap-2">
            <input
              id={managementWhitelistId}
              type="checkbox"
              checked={managementEmailWhitelistEnabled}
              disabled={isSaving}
              onChange={(e) => onManagementEmailWhitelistEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={managementWhitelistId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.whitelist_enabled}
            </label>
          </div>

          <CoreOutlinedTextField
            value={managementEmailWhitelist}
            onChange={(e) => onManagementEmailWhitelistChanged(e.target.value)}
            label={strings.email_whitelist_placeholder}
            placeholder={strings.email_whitelist_placeholder}
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

const EditAuthSettingsController: React.FC<{ strings?: FeatureManagementUserStrings }> = ({
  strings
}) => {
  const initScreen = useEditAuthSettingsStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <EditAuthSettingsContent strings={strings} />
}

export interface EditAuthSettingsScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: EditAuthSettingsStoreDependencies
  strings?: FeatureManagementUserStrings
}

export const EditAuthSettingsScreen = forwardRef<HTMLDivElement, EditAuthSettingsScreenProps>(
  ({ dependencies, strings = enManagementUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <EditAuthSettingsProvider dependencies={dependencies}>
          <EditAuthSettingsController strings={strings} />
        </EditAuthSettingsProvider>
      </div>
    )
  }
)

EditAuthSettingsScreen.displayName = 'EditAuthSettingsScreen'

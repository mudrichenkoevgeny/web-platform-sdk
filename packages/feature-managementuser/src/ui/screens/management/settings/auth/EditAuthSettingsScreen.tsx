import React, { forwardRef, useEffect, useId } from 'react'
import { UserAuthProvider, UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
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
  EditAuthSettingsProvider,
  EditAuthSettingsStatus,
  useEditAuthSettingsStore
} from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'

const EditAuthSettingsContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
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

  switch (screenState.status) {
    case EditAuthSettingsStatus.LOADING:
      return <FullscreenLoading />

    case EditAuthSettingsStatus.ERROR:
      return (
        <FullscreenError
          error={screenState.error}
          onRetry={onRetry}
          onBack={onBackClick}
          title={strings.ui.editAuthSettingsTitle}
        />
      )

    case EditAuthSettingsStatus.CONTENT: {
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
        void onSaveClick()
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
              text={strings.ui.editAuthSettingsTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <div className="w-10" />
          </div>

          <div className="w-full flex-1 flex flex-col gap-6 mb-6">
            <div className="flex flex-col gap-3">
              <CoreTitleText text={strings.ui.enabledAuthProviders} />
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
                  {strings.ui.isRegistrationEnabled}
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <CoreTitleText text={strings.ui.limitsAndExpirations} />

              <CoreOutlinedTextField
                value={maxTotalIdentifiers}
                onChange={(e) => onMaxTotalIdentifiersChanged(e.target.value)}
                label={strings.ui.maxTotalIdentifiers}
                placeholder={strings.ui.maxTotalIdentifiers}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={maxEmailIdentifiers}
                onChange={(e) => onMaxEmailIdentifiersChanged(e.target.value)}
                label={strings.ui.maxEmailIdentifiers}
                placeholder={strings.ui.maxEmailIdentifiers}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={maxPhoneIdentifiers}
                onChange={(e) => onMaxPhoneIdentifiersChanged(e.target.value)}
                label={strings.ui.maxPhoneIdentifiers}
                placeholder={strings.ui.maxPhoneIdentifiers}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={maxIdentifiersPerExternalProvider}
                onChange={(e) => onMaxIdentifiersPerExternalProviderChanged(e.target.value)}
                label={strings.ui.maxIdentifiersPerExternalProvider}
                placeholder={strings.ui.maxIdentifiersPerExternalProvider}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={maxActiveSessionsForOpenUser}
                onChange={(e) => onMaxActiveSessionsForOpenUserChanged(e.target.value)}
                label={strings.ui.maxActiveSessionsOpen}
                placeholder={strings.ui.maxActiveSessionsOpen}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={maxActiveSessionsForManagementUser}
                onChange={(e) => onMaxActiveSessionsForManagementUserChanged(e.target.value)}
                label={strings.ui.maxActiveSessionsManagement}
                placeholder={strings.ui.maxActiveSessionsManagement}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={accessTokenExpirationSeconds}
                onChange={(e) => onAccessTokenExpirationSecondsChanged(e.target.value)}
                label={strings.ui.accessTokenExpirationSeconds}
                placeholder={strings.ui.accessTokenExpirationSeconds}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={refreshTokenExpirationSeconds}
                onChange={(e) => onRefreshTokenExpirationSecondsChanged(e.target.value)}
                label={strings.ui.refreshTokenExpirationSeconds}
                placeholder={strings.ui.refreshTokenExpirationSeconds}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={accountDeletionGracePeriodSeconds}
                onChange={(e) => onAccountDeletionGracePeriodSecondsChanged(e.target.value)}
                label={strings.ui.accountDeletionDelaySeconds}
                placeholder={strings.ui.accountDeletionDelaySeconds}
                disabled={isSaving}
              />

              <CoreOutlinedTextField
                value={accountDeletionCheckIntervalSeconds}
                onChange={(e) => onAccountDeletionCheckIntervalSecondsChanged(e.target.value)}
                label={strings.ui.accountDeletionCheckIntervalSeconds}
                placeholder={strings.ui.accountDeletionCheckIntervalSeconds}
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-3">
              <CoreTitleText text={strings.ui.openEmailRestrictionPolicy} />

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
                  {strings.ui.blacklistEnabled}
                </label>
              </div>

              <CoreOutlinedTextField
                value={openEmailBlacklist}
                onChange={(e) => onOpenEmailBlacklistChanged(e.target.value)}
                label={strings.ui.emailBlacklistPlaceholder}
                placeholder={strings.ui.emailBlacklistPlaceholder}
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
                  {strings.ui.whitelistEnabled}
                </label>
              </div>

              <CoreOutlinedTextField
                value={openEmailWhitelist}
                onChange={(e) => onOpenEmailWhitelistChanged(e.target.value)}
                label={strings.ui.emailWhitelistPlaceholder}
                placeholder={strings.ui.emailWhitelistPlaceholder}
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-3">
              <CoreTitleText text={strings.ui.managementEmailRestrictionPolicy} />

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
                  {strings.ui.blacklistEnabled}
                </label>
              </div>

              <CoreOutlinedTextField
                value={managementEmailBlacklist}
                onChange={(e) => onManagementEmailBlacklistChanged(e.target.value)}
                label={strings.ui.emailBlacklistPlaceholder}
                placeholder={strings.ui.emailBlacklistPlaceholder}
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
                  {strings.ui.whitelistEnabled}
                </label>
              </div>

              <CoreOutlinedTextField
                value={managementEmailWhitelist}
                onChange={(e) => onManagementEmailWhitelistChanged(e.target.value)}
                label={strings.ui.emailWhitelistPlaceholder}
                placeholder={strings.ui.emailWhitelistPlaceholder}
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
  }
}

const EditAuthSettingsController: React.FC<{ strings?: UserModuleStrings }> = ({
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
  strings?: UserModuleStrings
}

export const EditAuthSettingsScreen = forwardRef<HTMLDivElement, EditAuthSettingsScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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

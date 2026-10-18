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
  EditGlobalSettingsProvider,
  useEditGlobalSettingsStore
} from '@/ui/screens/management/settings/global/EditGlobalSettingsStore'
import type { EditGlobalSettingsStoreDependencies } from '@/ui/screens/management/settings/global/EditGlobalSettingsStore'

const defaultUserStrings = new UserModuleStrings()

const EditGlobalSettingsContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const screenState = useEditGlobalSettingsStore((s) => s.screenState)
  const onRetry = useEditGlobalSettingsStore((s) => s.onRetry)
  const onPrivacyPolicyUrlChanged = useEditGlobalSettingsStore((s) => s.onPrivacyPolicyUrlChanged)
  const onTermsOfServiceUrlChanged = useEditGlobalSettingsStore((s) => s.onTermsOfServiceUrlChanged)
  const onContactSupportEmailChanged = useEditGlobalSettingsStore((s) => s.onContactSupportEmailChanged)
  const onMinVersionAndroidChanged = useEditGlobalSettingsStore((s) => s.onMinVersionAndroidChanged)
  const onMinVersionIosChanged = useEditGlobalSettingsStore((s) => s.onMinVersionIosChanged)
  const onMinVersionWebChanged = useEditGlobalSettingsStore((s) => s.onMinVersionWebChanged)
  const onMinVersionDesktopChanged = useEditGlobalSettingsStore((s) => s.onMinVersionDesktopChanged)
  const onTracingEnabledToggled = useEditGlobalSettingsStore((s) => s.onTracingEnabledToggled)
  const onMetricsEnabledToggled = useEditGlobalSettingsStore((s) => s.onMetricsEnabledToggled)
  const onVerboseLoggingEnabledToggled = useEditGlobalSettingsStore((s) => s.onVerboseLoggingEnabledToggled)
  const onSaveClick = useEditGlobalSettingsStore((s) => s.onSaveClick)
  const onResetClick = useEditGlobalSettingsStore((s) => s.onResetClick)
  const onBackClick = useEditGlobalSettingsStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const isTracingId = useId()
  const isMetricsId = useId()
  const isVerboseLoggingId = useId()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        error={screenState.error}
        onRetry={onRetry}
        onBack={onBackClick}
        title={strings.ui.editGlobalSettingsTitle}
      />
    )
  }

  const {
    privacyPolicyUrl,
    termsOfServiceUrl,
    contactSupportEmail,
    minVersionAndroid,
    minVersionIos,
    minVersionWeb,
    minVersionDesktop,
    isTracingEnabled,
    isMetricsEnabled,
    isVerboseLoggingEnabled,
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
          text={strings.ui.editGlobalSettingsTitle}
          className="absolute left-1/2 -translate-x-1/2"
        />
        <div className="w-10" />
      </div>

      <div className="w-full flex-1 flex flex-col gap-6 mb-6">
        <div className="flex flex-col gap-3">
          <CoreOutlinedTextField
            value={privacyPolicyUrl}
            onChange={(e) => onPrivacyPolicyUrlChanged(e.target.value)}
            label={strings.ui.privacyPolicyUrl}
            placeholder={strings.ui.privacyPolicyUrl}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={termsOfServiceUrl}
            onChange={(e) => onTermsOfServiceUrlChanged(e.target.value)}
            label={strings.ui.termsOfServiceUrl}
            placeholder={strings.ui.termsOfServiceUrl}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={contactSupportEmail}
            onChange={(e) => onContactSupportEmailChanged(e.target.value)}
            label={strings.ui.contactSupportEmail}
            placeholder={strings.ui.contactSupportEmail}
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.telemetryAndLogging} />

          <div className="flex items-center gap-2">
            <input
              id={isTracingId}
              type="checkbox"
              checked={isTracingEnabled}
              disabled={isSaving}
              onChange={(e) => onTracingEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={isTracingId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.ui.isTracingEnabled}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={isMetricsId}
              type="checkbox"
              checked={isMetricsEnabled}
              disabled={isSaving}
              onChange={(e) => onMetricsEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={isMetricsId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.ui.isMetricsEnabled}
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id={isVerboseLoggingId}
              type="checkbox"
              checked={isVerboseLoggingEnabled}
              disabled={isSaving}
              onChange={(e) => onVerboseLoggingEnabledToggled(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor={isVerboseLoggingId} className="text-sm text-surface-foreground cursor-pointer">
              {strings.ui.isVerboseLoggingEnabled}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <CoreTitleText text={strings.ui.minSupportedAppVersions} />

          <CoreOutlinedTextField
            value={minVersionAndroid}
            onChange={(e) => onMinVersionAndroidChanged(e.target.value)}
            label={strings.ui.minVersionAndroid}
            placeholder={strings.ui.minVersionAndroid}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={minVersionIos}
            onChange={(e) => onMinVersionIosChanged(e.target.value)}
            label={strings.ui.minVersionIos}
            placeholder={strings.ui.minVersionIos}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={minVersionWeb}
            onChange={(e) => onMinVersionWebChanged(e.target.value)}
            label={strings.ui.minVersionWeb}
            placeholder={strings.ui.minVersionWeb}
            disabled={isSaving}
          />

          <CoreOutlinedTextField
            value={minVersionDesktop}
            onChange={(e) => onMinVersionDesktopChanged(e.target.value)}
            label={strings.ui.minVersionDesktop}
            placeholder={strings.ui.minVersionDesktop}
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

const EditGlobalSettingsController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const initScreen = useEditGlobalSettingsStore((s) => s.initScreen)

  useEffect(() => {
    initScreen()
  }, [initScreen])

  return <EditGlobalSettingsContent strings={strings} />
}

export interface EditGlobalSettingsScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: EditGlobalSettingsStoreDependencies
  strings?: UserModuleStrings
}

export const EditGlobalSettingsScreen = forwardRef<HTMLDivElement, EditGlobalSettingsScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <EditGlobalSettingsProvider dependencies={dependencies}>
          <EditGlobalSettingsController strings={strings} />
        </EditGlobalSettingsProvider>
      </div>
    )
  }
)

EditGlobalSettingsScreen.displayName = 'EditGlobalSettingsScreen'

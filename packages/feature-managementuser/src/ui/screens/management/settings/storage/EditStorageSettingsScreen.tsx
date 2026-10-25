import React, { forwardRef, useEffect, useId } from 'react'
import { StorageModuleStrings, storageStrings, commonStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenError,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  EditStorageSettingsProvider,
  EditStorageSettingsStatus,
  useEditStorageSettingsStore
} from '@/ui/screens/management/settings/storage/edit-storage-settings-store'
import type { EditStorageSettingsStoreDependencies } from '@/ui/screens/management/settings/storage/edit-storage-settings-store'

/**
 * DOM data-testid tags for UI testing {@link EditStorageSettingsScreen}.
 */
export const EditStorageSettingsTestTags = {
  BACK_BUTTON: 'EditStorageSettings_BackButton',
  TITLE: 'EditStorageSettings_Title',
  RESET_BUTTON: 'EditStorageSettings_ResetButton',
  SAVE_BUTTON: 'EditStorageSettings_SaveButton',
  ERROR_TEXT: 'EditStorageSettings_ErrorText'
}

const EditStorageSettingsContent: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings = storageStrings
}) => {
  const screenState = useEditStorageSettingsStore((s) => s.screenState)
  const onRetry = useEditStorageSettingsStore((s) => s.onRetry)
  const onMinUploadSizeBytesChanged = useEditStorageSettingsStore((s) => s.onMinUploadSizeBytesChanged)
  const onMaxUploadSizeBytesChanged = useEditStorageSettingsStore((s) => s.onMaxUploadSizeBytesChanged)
  const onTotalStorageQuotaForOpenUserBytesChanged = useEditStorageSettingsStore((s) => s.onTotalStorageQuotaForOpenUserBytesChanged)
  const onTotalStorageQuotaForManagementUserBytesChanged = useEditStorageSettingsStore((s) => s.onTotalStorageQuotaForManagementUserBytesChanged)
  const onPresignedUrlExpirationSecondsChanged = useEditStorageSettingsStore((s) => s.onPresignedUrlExpirationSecondsChanged)
  const onMaxPendingUploadsForOpenUserChanged = useEditStorageSettingsStore((s) => s.onMaxPendingUploadsForOpenUserChanged)
  const onMaxPendingUploadsForManagementUserChanged = useEditStorageSettingsStore((s) => s.onMaxPendingUploadsForManagementUserChanged)
  const onIsDeduplicationEnabledToggled = useEditStorageSettingsStore((s) => s.onIsDeduplicationEnabledToggled)
  const onDeletedFilesCleanupIntervalSecondsChanged = useEditStorageSettingsStore((s) => s.onDeletedFilesCleanupIntervalSecondsChanged)

  const onSaveClick = useEditStorageSettingsStore((s) => s.onSaveClick)
  const onResetClick = useEditStorageSettingsStore((s) => s.onResetClick)
  const onBackClick = useEditStorageSettingsStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const deduplicationId = useId()

  switch (screenState.status) {
    case EditStorageSettingsStatus.LOADING:
      return <FullscreenLoading />

    case EditStorageSettingsStatus.ERROR:
      return (
        <FullscreenError
          error={screenState.error}
          onRetry={onRetry}
          onBack={onBackClick}
          title={strings.ui.storageSettingsTitle}
        />
      )

    case EditStorageSettingsStatus.CONTENT: {
      const {
        minUploadSizeBytes,
        maxUploadSizeBytes,
        totalStorageQuotaForOpenUserBytes,
        totalStorageQuotaForManagementUserBytes,
        presignedUrlExpirationSeconds,
        maxPendingUploadsForOpenUser,
        maxPendingUploadsForManagementUser,
        isDeduplicationEnabled,
        deletedFilesCleanupIntervalSeconds,
        isSaving,
        saveError
      } = screenState

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        void onSaveClick()
      }

      return (
        <form
          onSubmit={handleSubmit}
          className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto"
        >
          <div className="w-full flex items-center justify-between relative mb-6">
            <CoreBackButton
              data-testid={EditStorageSettingsTestTags.BACK_BUTTON}
              onClick={onBackClick}
              disabled={isSaving}
            />
            <CoreScreenTitleText
              data-testid={EditStorageSettingsTestTags.TITLE}
              text={strings.ui.storageSettingsTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <CoreTextButton
              type="button"
              data-testid={EditStorageSettingsTestTags.RESET_BUTTON}
              label={commonStrings.ui.reset}
              disabled={isSaving}
              onClick={() => void onResetClick()}
            />
          </div>

          <div className="w-full max-w-lg mx-auto flex-1 flex flex-col gap-4">
            <CoreOutlinedTextField
              value={minUploadSizeBytes}
              onChange={(e) => onMinUploadSizeBytesChanged(e.target.value)}
              label={strings.ui.minUploadSizeBytes}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={maxUploadSizeBytes}
              onChange={(e) => onMaxUploadSizeBytesChanged(e.target.value)}
              label={strings.ui.maxUploadSizeBytes}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={totalStorageQuotaForOpenUserBytes}
              onChange={(e) => onTotalStorageQuotaForOpenUserBytesChanged(e.target.value)}
              label={strings.ui.totalStorageQuotaForOpenUserBytes}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={totalStorageQuotaForManagementUserBytes}
              onChange={(e) => onTotalStorageQuotaForManagementUserBytesChanged(e.target.value)}
              label={strings.ui.totalStorageQuotaForManagementUserBytes}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={presignedUrlExpirationSeconds}
              onChange={(e) => onPresignedUrlExpirationSecondsChanged(e.target.value)}
              label={strings.ui.presignedUrlExpirationSeconds}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={maxPendingUploadsForOpenUser}
              onChange={(e) => onMaxPendingUploadsForOpenUserChanged(e.target.value)}
              label={strings.ui.maxPendingUploadsForOpenUser}
              disabled={isSaving}
            />

            <CoreOutlinedTextField
              value={maxPendingUploadsForManagementUser}
              onChange={(e) => onMaxPendingUploadsForManagementUserChanged(e.target.value)}
              label={strings.ui.maxPendingUploadsForManagementUser}
              disabled={isSaving}
            />

            <div className="flex items-center gap-2 py-2">
              <input
                id={deduplicationId}
                type="checkbox"
                checked={isDeduplicationEnabled}
                onChange={(e) => onIsDeduplicationEnabledToggled(e.target.checked)}
                disabled={isSaving}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor={deduplicationId} className="text-sm font-medium text-surface-foreground">
                {strings.ui.isDeduplicationEnabled}
              </label>
            </div>

            <CoreOutlinedTextField
              value={deletedFilesCleanupIntervalSeconds}
              onChange={(e) => onDeletedFilesCleanupIntervalSecondsChanged(e.target.value)}
              label={strings.ui.deletedFilesCleanupIntervalSeconds}
              disabled={isSaving}
            />

            {saveError && (
              <CoreErrorText
                data-testid={EditStorageSettingsTestTags.ERROR_TEXT}
                text={errorParser.parse(saveError) ?? ''}
              />
            )}
          </div>

          <div className="w-full max-w-lg mx-auto pt-4">
            <CoreButton
              type="submit"
              data-testid={EditStorageSettingsTestTags.SAVE_BUTTON}
              label={isSaving ? commonStrings.ui.loading : commonStrings.ui.save}
              disabled={isSaving}
            />
          </div>
        </form>
      )
    }
  }
}

const EditStorageSettingsController: React.FC<{ strings?: StorageModuleStrings }> = ({
  strings
}) => {
  const initScreen = useEditStorageSettingsStore((s) => s.initScreen)

  useEffect(() => {
    void initScreen()
  }, [initScreen])

  return <EditStorageSettingsContent strings={strings} />
}

/**
 * Props for {@link EditStorageSettingsScreen}.
 */
export interface EditStorageSettingsScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: EditStorageSettingsStoreDependencies
  /** Optional localized strings override. */
  strings?: StorageModuleStrings
}

/**
 * Management screen component for editing platform storage settings.
 */
export const EditStorageSettingsScreen = forwardRef<HTMLDivElement, EditStorageSettingsScreenProps>(
  ({ dependencies, strings = storageStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <EditStorageSettingsProvider dependencies={dependencies}>
          <EditStorageSettingsController strings={strings} />
        </EditStorageSettingsProvider>
      </div>
    )
  }
)

EditStorageSettingsScreen.displayName = 'EditStorageSettingsScreen'

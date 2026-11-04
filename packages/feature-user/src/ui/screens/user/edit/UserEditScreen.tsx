import React, { forwardRef, useEffect, useRef } from 'react'
import { UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CoreOutlinedTextField,
  CoreScreenTitleText,
  FullscreenError,
  FullscreenLoading,
  FullscreenOverlayLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  hasUserEditChanges,
  SelectedFilePayload,
  UserEditProvider,
  UserEditStatus,
  useUserEditStore
} from '@/ui/screens/user/edit/user-edit-store'
import type { UserEditStoreDependencies } from '@/ui/screens/user/edit/user-edit-store'

/** Automation test tags for {@link UserEditScreen}. */
export const UserEditTestTags = {
  /** Test tag for back button. */
  BACK_BUTTON: 'UserEdit_BackButton',
  /** Test tag for screen title. */
  TITLE: 'UserEdit_Title',
  /** Test tag for avatar image. */
  AVATAR_IMAGE: 'UserEdit_AvatarImage',
  /** Test tag for avatar change button. */
  AVATAR_CHANGE_BUTTON: 'UserEdit_AvatarChangeButton',
  /** Test tag for upload avatar button. */
  UPLOAD_AVATAR_BUTTON: 'UserEdit_UploadAvatarButton',
  /** Test tag for remove avatar button. */
  REMOVE_AVATAR_BUTTON: 'UserEdit_RemoveAvatarButton',
  /** Test tag for display name input field. */
  DISPLAY_NAME_INPUT: 'UserEdit_DisplayNameInput',
  /** Test tag for nickname input field. */
  NICKNAME_INPUT: 'UserEdit_NicknameInput',
  /** Test tag for birthdate input field. */
  BIRTHDATE_INPUT: 'UserEdit_BirthdateInput',
  /** Test tag for save profile button. */
  SAVE_BUTTON: 'UserEdit_SaveButton',
  /** Test tag for retry button. */
  RETRY_BUTTON: 'UserEdit_RetryButton',
  /** Test tag for global error container. */
  GLOBAL_ERROR_TEXT: 'UserEdit_GlobalErrorText',
  /** Test tag for action error text. */
  ACTION_ERROR_TEXT: 'UserEdit_ActionErrorText',
  /** Test tag for save error text. */
  SAVE_ERROR_TEXT: 'UserEdit_SaveErrorText',
  /** Test tag for upload error text. */
  UPLOAD_ERROR_TEXT: 'UserEdit_UploadErrorText'
}

const UserEditContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useUserEditStore((s) => s.screenState)
  const initScreen = useUserEditStore((s) => s.initScreen)
  const onNicknameChanged = useUserEditStore((s) => s.onNicknameChanged)
  const onDisplayNameChanged = useUserEditStore((s) => s.onDisplayNameChanged)
  const onBirthdateChanged = useUserEditStore((s) => s.onBirthdateChanged)
  const onAvatarFileSelected = useUserEditStore((s) => s.onAvatarFileSelected)
  const onRemoveAvatarClick = useUserEditStore((s) => s.onRemoveAvatarClick)
  const onSaveClick = useUserEditStore((s) => s.onSaveClick)
  const onRetry = useUserEditStore((s) => s.onRetry)
  const onBackClick = useUserEditStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previousAvatarUrlRef = useRef<string | null>(null)

  useEffect(() => {
    void initScreen()
  }, [initScreen])

  useEffect(() => {
    return () => {
      if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previousAvatarUrlRef.current)
      }
    }
  }, [])

  switch (screenState.status) {
    case UserEditStatus.LOADING:
      return <FullscreenLoading />

    case UserEditStatus.ERROR:
      return (
        <FullscreenError
          error={screenState.error}
          onRetry={onRetry}
          onBack={onBackClick}
          title={strings.ui.editProfileTitle}
        />
      )

    case UserEditStatus.CONTENT: {
      const {
        nicknameInput,
        displayNameInput,
        birthdateInput,
        avatarUrl,
        nicknameError,
        displayNameError,
        isSaving,
        actionError
      } = screenState

      const hasChanges = hasUserEditChanges(screenState)

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(previousAvatarUrlRef.current)
          }
          const localUri = URL.createObjectURL(file)
          previousAvatarUrlRef.current = localUri

          const payload: SelectedFilePayload = {
            file,
            fileName: file.name,
            fileSizeBytes: file.size,
            mimeType: file.type || 'application/octet-stream',
            localUri
          }
          onAvatarFileSelected(payload)
        }
      }

      const handleRemoveAvatar = () => {
        if (previousAvatarUrlRef.current && previousAvatarUrlRef.current.startsWith('blob:')) {
          URL.revokeObjectURL(previousAvatarUrlRef.current)
          previousAvatarUrlRef.current = null
        }
        onRemoveAvatarClick()
      }

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
          <div className="w-full flex items-center justify-between relative mb-6">
            <CoreBackButton data-testid={UserEditTestTags.BACK_BUTTON} onClick={onBackClick} />
            <CoreScreenTitleText
              data-testid={UserEditTestTags.TITLE}
              text={strings.ui.editProfileTitle}
              className="absolute left-1/2 -translate-x-1/2"
            />
            <div className="w-10" />
          </div>

          <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-4 mb-6">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-accent flex items-center justify-center relative">
                {avatarUrl ? (
                  <img
                    data-testid={UserEditTestTags.AVATAR_IMAGE}
                    src={avatarUrl}
                    alt={strings.ui.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-muted-foreground font-bold">
                    {(displayNameInput || nicknameInput || strings.ui.user || strings.ui.editProfileTitle).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex gap-2">
                <CoreButton
                  type="button"
                  data-testid={UserEditTestTags.AVATAR_CHANGE_BUTTON}
                  label={`${strings.ui.editProfileTitle} (${strings.ui.avatar})`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                />
                {avatarUrl && (
                  <CoreButton
                    type="button"
                    data-testid={UserEditTestTags.REMOVE_AVATAR_BUTTON}
                    label={strings.ui.removeAvatar}
                    onClick={handleRemoveAvatar}
                    disabled={isSaving}
                  />
                )}
              </div>
            </div>

            <CoreOutlinedTextField
              data-testid={UserEditTestTags.DISPLAY_NAME_INPUT}
              value={displayNameInput}
              onChange={(e) => onDisplayNameChanged(e.target.value)}
              label={strings.ui.user}
              isError={Boolean(displayNameError)}
              disabled={isSaving}
            />
            {displayNameError && (
              <CoreErrorText text={errorParser.parse(displayNameError) ?? ''} />
            )}

            <CoreOutlinedTextField
              data-testid={UserEditTestTags.NICKNAME_INPUT}
              value={nicknameInput}
              onChange={(e) => onNicknameChanged(e.target.value)}
              label={strings.ui.userLabel}
              isError={Boolean(nicknameError)}
              disabled={isSaving}
            />
            {nicknameError && (
              <CoreErrorText text={errorParser.parse(nicknameError) ?? ''} />
            )}

            <CoreOutlinedTextField
              data-testid={UserEditTestTags.BIRTHDATE_INPUT}
              type="number"
              value={birthdateInput}
              onChange={(e) => onBirthdateChanged(e.target.value)}
              label={strings.ui.birthdate}
              disabled={isSaving}
            />

            <div className="flex flex-col gap-2 pt-4">
              <CoreButton
                type="button"
                data-testid={UserEditTestTags.SAVE_BUTTON}
                label={isSaving ? strings.ui.saving : strings.ui.saveProfile}
                onClick={() => void onSaveClick()}
                disabled={!hasChanges || isSaving}
              />

              {actionError && (
                <CoreErrorText
                  data-testid={UserEditTestTags.ACTION_ERROR_TEXT}
                  text={errorParser.parse(actionError) ?? ''}
                />
              )}
            </div>
          </div>

          {isSaving && <FullscreenOverlayLoading />}
        </div>
      )
    }
  }
}

/** Props for {@link UserEditScreen}. */
export interface UserEditScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Store dependencies required for initialization. */
  dependencies: UserEditStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Screen component allowing users to edit their own profile fields (nickname, displayName, birthdate, avatar). */
export const UserEditScreen = forwardRef<HTMLDivElement, UserEditScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UserEditProvider dependencies={dependencies}>
          <UserEditContent strings={strings} />
        </UserEditProvider>
      </div>
    )
  }
)

UserEditScreen.displayName = 'UserEditScreen'

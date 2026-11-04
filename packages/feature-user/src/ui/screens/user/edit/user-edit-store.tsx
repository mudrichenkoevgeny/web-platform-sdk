import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  StorageCategory,
  StorageFileVisibility,
  UserStorageTargetScopes,
  toFileIdOrNull
} from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetUserUseCase } from '@/usecase/user/get-user-use-case'
import type { SelfUpdateUserUseCase } from '@/usecase/user/self-update-user-use-case'
import type { ValidateNicknameUseCase } from '@/usecase/user/validation/validate-nickname-use-case'
import type { ValidateDisplayNameUseCase } from '@/usecase/user/validation/validate-display-name-use-case'

/** Selected file payload containing file details and local preview URI for avatar upload. */
export interface SelectedFilePayload {
  /** The native File object to upload. */
  file: File
  /** Name of the selected file. */
  fileName: string
  /** Size of the selected file in bytes. */
  fileSizeBytes: number
  /** MIME type of the selected file. */
  mimeType: string
  /** Local object URL for rendering a preview before upload. */
  localUri: string
}

/** Status values representing lifecycle phases of {@link UserEditScreenState}. */
export enum UserEditStatus {
  /** Loading state while initial user profile and settings are fetched. */
  LOADING = 'loading',
  /** Error state when loading or processing fails. */
  ERROR = 'error',
  /** Content state displaying profile edit fields and validation controls. */
  CONTENT = 'content'
}

/** Discriminated union representing active screen state for user profile editing. */
export type UserEditScreenState =
  | {
      status: UserEditStatus.LOADING
    }
  | {
      status: UserEditStatus.ERROR
      error: AppError
    }
  | {
      status: UserEditStatus.CONTENT
      user: UserPrivate
      nicknameInput: string
      displayNameInput: string
      birthdateInput: string
      avatarFileId: string | null
      avatarUrl: string | null
      selectedAvatarPayload: SelectedFilePayload | null
      nicknameError: AppError | null
      displayNameError: AppError | null
      isSaving: boolean
      actionError: AppError | null
    }

/**
 * Checks whether the current screen state has unsaved profile changes.
 *
 * @param state - Current content screen state
 * @returns True if input values differ from original user data or a new avatar was selected
 */
export const hasUserEditChanges = (
  state: Extract<UserEditScreenState, { status: UserEditStatus.CONTENT }>
): boolean => {
  const initialNickname = state.user.nickname ?? ''
  const initialDisplayName = state.user.displayName ?? ''
  const initialBirthdate = state.user.birthdate != null ? String(state.user.birthdate) : ''
  const initialAvatarFileId = state.user.avatarFileId ?? null

  return (
    state.nicknameInput.trim() !== initialNickname ||
    state.displayNameInput.trim() !== initialDisplayName ||
    state.birthdateInput.trim() !== initialBirthdate ||
    state.avatarFileId !== initialAvatarFileId ||
    state.selectedAvatarPayload !== null
  )
}

/** External dependencies required by {@link createUserEditStore}. */
export interface UserEditStoreDependencies {
  /** Use case for loading active user details. */
  getUserUseCase: Pick<GetUserUseCase, 'execute'>
  /** Use case for updating active user profile. */
  selfUpdateUserUseCase: Pick<SelfUpdateUserUseCase, 'execute'>
  /** Validator for nickname constraints via remote settings. */
  validateNicknameUseCase: Pick<ValidateNicknameUseCase, 'execute'>
  /** Validator for display name constraints via remote settings. */
  validateDisplayNameUseCase: Pick<ValidateDisplayNameUseCase, 'execute'>
  /** Optional use case for uploading avatar file with typed domain parameters. */
  uploadFileUseCase?: {
    execute(params: {
      file: File
      category: StorageCategory
      visibility: StorageFileVisibility
      targetScope: UserStorageTargetScopes[keyof typeof UserStorageTargetScopes]
      onProgress?: (percent: number) => void
    }): Promise<AppResult<{ id: string; fileUrls?: { originalUrl: string } | null }, AppError>>
  }
  /** Callback on successful profile update. */
  onSuccess?: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** Reactive store state and action interface for user edit screen. */
export interface UserEditStoreState {
  /** Current screen state discriminated union. */
  screenState: UserEditScreenState
  /** Initializes screen data by loading active user details. */
  initScreen: () => Promise<void>
  /** Invoked when nickname input value changes. */
  onNicknameChanged: (value: string) => void
  /** Invoked when display name input value changes. */
  onDisplayNameChanged: (value: string) => void
  /** Invoked when birthdate input value changes. */
  onBirthdateChanged: (value: string) => void
  /** Invoked when a new avatar file is selected. */
  onAvatarFileSelected: (payload: SelectedFilePayload) => void
  /** Invoked when the user clicks remove avatar. */
  onRemoveAvatarClick: () => void
  /** Triggers validation and profile update submission. */
  onSaveClick: () => Promise<void>
  /** Retries loading data after an error. */
  onRetry: () => Promise<void>
  /** Invoked on back navigation click. */
  onBackClick: () => void
}

/** Type alias for the user edit store instance. */
export type UserEditStore = ReturnType<typeof createUserEditStore>

/**
 * Factory function creating a Zustand store instance for user edit screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createUserEditStore = (
  deps: UserEditStoreDependencies,
  initialState?: UserEditScreenState
) => {
  let isFetching = false

  return createStore<UserEditStoreState>()((set, get) => ({
    screenState: initialState ?? { status: UserEditStatus.LOADING },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === UserEditStatus.CONTENT) {
        return
      }
      isFetching = true

      try {
        set({ screenState: { status: UserEditStatus.LOADING } })
        const userResult = await deps.getUserUseCase.execute()

        if (isSuccess(userResult)) {
          const user = userResult.data
          const avatarUrl = user.avatarUrls?.originalUrl ?? null
          set({
            screenState: {
              status: UserEditStatus.CONTENT,
              user,
              nicknameInput: user.nickname ?? '',
              displayNameInput: user.displayName ?? '',
              birthdateInput: user.birthdate != null ? String(user.birthdate) : '',
              avatarFileId: user.avatarFileId ?? null,
              avatarUrl,
              selectedAvatarPayload: null,
              nicknameError: null,
              displayNameError: null,
              isSaving: false,
              actionError: null
            }
          })
        } else {
          set({
            screenState: {
              status: UserEditStatus.ERROR,
              error: userResult.error
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onNicknameChanged: (value: string) => {
      const current = get().screenState
      if (current.status === UserEditStatus.CONTENT) {
        set({ screenState: { ...current, nicknameInput: value, nicknameError: null, actionError: null } })
      }
    },

    onDisplayNameChanged: (value: string) => {
      const current = get().screenState
      if (current.status === UserEditStatus.CONTENT) {
        set({ screenState: { ...current, displayNameInput: value, displayNameError: null, actionError: null } })
      }
    },

    onBirthdateChanged: (value: string) => {
      const current = get().screenState
      if (current.status === UserEditStatus.CONTENT) {
        set({ screenState: { ...current, birthdateInput: value, actionError: null } })
      }
    },

    onAvatarFileSelected: (payload: SelectedFilePayload) => {
      const current = get().screenState
      if (current.status === UserEditStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            selectedAvatarPayload: payload,
            avatarUrl: payload.localUri,
            actionError: null
          }
        })
      }
    },

    onRemoveAvatarClick: () => {
      const current = get().screenState
      if (current.status === UserEditStatus.CONTENT) {
        set({
          screenState: {
            ...current,
            avatarFileId: null,
            avatarUrl: null,
            selectedAvatarPayload: null,
            actionError: null
          }
        })
      }
    },

    onSaveClick: async () => {
      const current = get().screenState
      if (current.status !== UserEditStatus.CONTENT || current.isSaving) {
        return
      }

      const nicknameResult = await deps.validateNicknameUseCase.execute(
        current.nicknameInput,
        current.user.nickname
      )

      const displayNameResult = await deps.validateDisplayNameUseCase.execute(
        current.displayNameInput
      )

      const nickError = !isSuccess(nicknameResult) ? nicknameResult.error : null
      const nameError = !isSuccess(displayNameResult) ? displayNameResult.error : null

      if (nickError || nameError) {
        set({
          screenState: {
            ...current,
            nicknameError: nickError,
            displayNameError: nameError
          }
        })
        return
      }

      set({ screenState: { ...current, isSaving: true, actionError: null } })

      let uploadedAvatarFileId = current.avatarFileId
      const avatarPayload = current.selectedAvatarPayload

      if (avatarPayload != null && deps.uploadFileUseCase != null) {
        const uploadResult = await deps.uploadFileUseCase.execute({
          file: avatarPayload.file,
          category: StorageCategory.IMAGE,
          visibility: StorageFileVisibility.PUBLIC,
          targetScope: UserStorageTargetScopes.AVATAR
        })

        if (isSuccess(uploadResult)) {
          uploadedAvatarFileId = uploadResult.data.id
        } else {
          const latest = get().screenState
          if (latest.status === UserEditStatus.CONTENT) {
            set({ screenState: { ...latest, isSaving: false, actionError: uploadResult.error } })
          }
          return
        }
      }

      const birthdateNum = current.birthdateInput.trim()
        ? parseInt(current.birthdateInput.trim(), 10)
        : null

      const updateResult = await deps.selfUpdateUserUseCase.execute({
        nickname: current.nicknameInput.trim() || null,
        displayName: current.displayNameInput.trim() || null,
        avatarFileId: toFileIdOrNull(uploadedAvatarFileId),
        birthdate: isNaN(birthdateNum ?? NaN) ? null : birthdateNum
      })

      if (isSuccess(updateResult)) {
        deps.onSuccess?.()
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === UserEditStatus.CONTENT) {
          set({ screenState: { ...updated, isSaving: false, actionError: updateResult.error } })
        }
      }
    },

    onRetry: async () => {
      await get().initScreen()
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const UserEditContext = createContext<UserEditStore | null>(null)

/** Properties for {@link UserEditProvider}. */
export interface UserEditProviderProps {
  /** Store dependencies required for initialization. */
  dependencies: UserEditStoreDependencies
  /** Optional initial screen state override for testing or stories. */
  initialState?: UserEditScreenState
  /** React child nodes. */
  children: React.ReactNode
}

/** React context provider component for user edit store. */
export const UserEditProvider: React.FC<UserEditProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createUserEditStore(dependencies, initialState))

  return (
    <UserEditContext.Provider value={store}>
      {children}
    </UserEditContext.Provider>
  )
}

/**
 * Hook to consume user edit store state or actions using a selector.
 *
 * @param selector - Selector function extracting part of store state
 * @returns Selected state or action value
 */
export const useUserEditStore = <T,>(
  selector: (state: UserEditStoreState) => T
): T => {
  const store = useContext(UserEditContext)
  if (!store) {
    throw new Error('useUserEditStore must be used within UserEditProvider')
  }
  return useStore(store, selector)
}

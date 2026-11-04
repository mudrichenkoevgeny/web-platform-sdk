import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import {
  StorageCategory,
  StorageFileVisibility,
  UserStorageTargetScopes,
  UserAccountStatus,
  UserRole,
  toFileIdOrNull,
  type UserStorageConfiguration
} from '@mudrichenkoevgeny/shared-foundation'
import { FieldValidator } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { CreateUserUseCase } from '@/usecase/user/create-user-use-case'

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

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

const parseNullableInteger = (value: string): number | null => {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  const parsed = parseInt(trimmed, 10)
  return isNaN(parsed) ? null : parsed
}

/** Screen state for administrative user creation form. */
export interface CreateUserScreenState {
  /** Email address input value. */
  email: string
  /** Password input value. */
  password: string
  /** Nickname handle input value. */
  nickname: string
  /** Display name input value. */
  displayName: string
  /** Whether password input characters are visible. */
  isPasswordVisible: boolean
  /** Avatar file ID string. */
  avatarFileId: string
  /** Selected local avatar file payload. */
  selectedAvatarPayload: SelectedFilePayload | null
  /** Birthdate epoch millis input value. */
  birthdate: string
  /** Selected user role. */
  role: UserRole
  /** Selected initial account status. */
  status: UserAccountStatus
  /** Authority level input value. */
  authorityLevel: string
  /** Storage quota bytes input value. */
  storageQuotaBytes: string
  /** Max upload size bytes input value. */
  storageMaxUploadSizeBytes: string
  /** Max pending uploads input value. */
  storageMaxPendingUploads: string
  /** Whether user creation request is in progress. */
  isLoading: boolean
  /** Error from the last create attempt, or null. */
  error: AppError | null
}

/** External dependencies required by {@link createCreateUserStore}. */
export interface CreateUserStoreDependencies {
  /** Use case for administratively creating a new user account. */
  createUserUseCase: Pick<CreateUserUseCase, 'execute'>
  /** Optional use case for uploading avatar file with typed domain parameters. */
  uploadFileUseCase?: {
    execute(params: {
      file: File
      category: StorageCategory
      visibility: StorageFileVisibility
      targetScope: UserStorageTargetScopes
      onProgress?: (percent: number) => void
    }): Promise<AppResult<{ id: string; fileUrls?: { originalUrl: string } | null }, AppError>>
  }
  /** Callback invoked when user creation succeeds. */
  onSuccess: () => void
  /** Navigation callback to return to previous screen. */
  onBack: () => void
}

/** Reactive store state and action interface for create user screen. */
export interface CreateUserStoreState {
  /** Current screen state. */
  screenState: CreateUserScreenState
  /** Handles email input value change. */
  onEmailChanged: (value: string) => void
  /** Handles password input value change. */
  onPasswordChanged: (value: string) => void
  /** Handles nickname input value change. */
  onNicknameChanged: (value: string) => void
  /** Handles display name input value change. */
  onDisplayNameChanged: (value: string) => void
  /** Toggles password visibility state. */
  onTogglePasswordVisibility: () => void
  /** Handles avatar file selection. */
  onAvatarFileSelected: (payload: SelectedFilePayload) => void
  /** Handles avatar removal click. */
  onRemoveAvatarClick: () => void
  /** Handles birthdate input value change. */
  onBirthdateChanged: (value: string) => void
  /** Handles role selection change. */
  onRoleChanged: (value: UserRole) => void
  /** Handles account status selection change. */
  onStatusChanged: (value: UserAccountStatus) => void
  /** Handles authority level input value change. */
  onAuthorityLevelChanged: (value: string) => void
  /** Handles storage quota bytes input change. */
  onStorageQuotaBytesChanged: (value: string) => void
  /** Handles max upload size bytes input change. */
  onStorageMaxUploadSizeBytesChanged: (value: string) => void
  /** Handles max pending uploads input change. */
  onStorageMaxPendingUploadsChanged: (value: string) => void
  /** Submits new user account creation request. */
  onCreateClick: () => Promise<void>
  /** Handles back navigation button click. */
  onBackClick: () => void
}

/** Type alias for Zustand store instance returned by {@link createCreateUserStore}. */
export type CreateUserStore = ReturnType<typeof createCreateUserStore>

/**
 * Factory function creating a Zustand store instance for create user screen.
 *
 * @param deps - Injected store dependencies
 * @param initialState - Optional initial screen state override
 * @returns Initialized store instance
 */
export const createCreateUserStore = (
  deps: CreateUserStoreDependencies,
  initialState?: Partial<CreateUserScreenState>
) => {
  const defaultState: CreateUserScreenState = {
    email: '',
    password: '',
    nickname: '',
    displayName: '',
    isPasswordVisible: false,
    avatarFileId: '',
    selectedAvatarPayload: null,
    birthdate: '',
    role: UserRole.USER,
    status: UserAccountStatus.ACTIVE,
    authorityLevel: '0',
    storageQuotaBytes: '',
    storageMaxUploadSizeBytes: '',
    storageMaxPendingUploads: '',
    isLoading: false,
    error: null,
    ...initialState
  }

  return createStore<CreateUserStoreState>()((set, get) => ({
    screenState: defaultState,

    onEmailChanged: (value: string) => {
      set({ screenState: { ...get().screenState, email: value, error: null } })
    },

    onPasswordChanged: (value: string) => {
      set({ screenState: { ...get().screenState, password: value, error: null } })
    },

    onNicknameChanged: (value: string) => {
      set({ screenState: { ...get().screenState, nickname: value, error: null } })
    },

    onDisplayNameChanged: (value: string) => {
      set({ screenState: { ...get().screenState, displayName: value, error: null } })
    },

    onTogglePasswordVisibility: () => {
      set({ screenState: { ...get().screenState, isPasswordVisible: !get().screenState.isPasswordVisible } })
    },

    onAvatarFileSelected: (payload: SelectedFilePayload) => {
      set({ screenState: { ...get().screenState, selectedAvatarPayload: payload, error: null } })
    },

    onRemoveAvatarClick: () => {
      set({ screenState: { ...get().screenState, selectedAvatarPayload: null, avatarFileId: '', error: null } })
    },

    onBirthdateChanged: (value: string) => {
      set({ screenState: { ...get().screenState, birthdate: value, error: null } })
    },

    onRoleChanged: (value: UserRole) => {
      set({ screenState: { ...get().screenState, role: value, error: null } })
    },

    onStatusChanged: (value: UserAccountStatus) => {
      set({ screenState: { ...get().screenState, status: value, error: null } })
    },

    onAuthorityLevelChanged: (value: string) => {
      if (value === '') {
        set({ screenState: { ...get().screenState, authorityLevel: value, error: null } })
        return
      }
      const trimmed = value.trim()
      if (/^\d+$/.test(trimmed)) {
        const num = parseInt(trimmed, 10)
        if (num >= 0 && num <= 100) {
          set({ screenState: { ...get().screenState, authorityLevel: trimmed, error: null } })
        }
      }
    },

    onStorageQuotaBytesChanged: (value: string) => {
      set({ screenState: { ...get().screenState, storageQuotaBytes: value, error: null } })
    },

    onStorageMaxUploadSizeBytesChanged: (value: string) => {
      set({ screenState: { ...get().screenState, storageMaxUploadSizeBytes: value, error: null } })
    },

    onStorageMaxPendingUploadsChanged: (value: string) => {
      set({ screenState: { ...get().screenState, storageMaxPendingUploads: value, error: null } })
    },

    onCreateClick: async () => {
      const current = get().screenState
      if (current.isLoading || !FieldValidator.isValidEmail(current.email)) {
        return
      }

      set({ screenState: { ...current, isLoading: true, error: null } })

      let uploadedAvatarFileId = current.avatarFileId.trim() || null
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
          set({ screenState: { ...get().screenState, isLoading: false, error: uploadResult.error } })
          return
        }
      }

      const authLevel = parseIntegerOrDefault(current.authorityLevel, 0)
      const quota = parseNullableInteger(current.storageQuotaBytes)
      const maxUpload = parseNullableInteger(current.storageMaxUploadSizeBytes)
      const maxPending = parseNullableInteger(current.storageMaxPendingUploads)

      const hasStorageConfig = quota !== null || maxUpload !== null || maxPending !== null
      const storageConfiguration: UserStorageConfiguration | null = hasStorageConfig
        ? {
            quotaBytes: quota,
            maxUploadSizeBytes: maxUpload,
            maxPendingUploads: maxPending
          }
        : null

      const birthdateMillis = current.birthdate.trim() ? parseInt(current.birthdate.trim(), 10) : null

      const createUserResult = await deps.createUserUseCase.execute({
        email: current.email.trim(),
        password: current.password.trim() || null,
        nickname: current.nickname.trim() || null,
        displayName: current.displayName.trim() || null,
        avatarFileId: toFileIdOrNull(uploadedAvatarFileId),
        birthdate: birthdateMillis,
        role: current.role,
        status: current.status,
        authorityLevel: authLevel,
        storageConfiguration
      })

      if (isSuccess(createUserResult)) {
        deps.onSuccess()
      } else {
        set({ screenState: { ...get().screenState, isLoading: false, error: createUserResult.error } })
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const CreateUserContext = createContext<CreateUserStore | null>(null)

/** Props for {@link CreateUserProvider}. */
export interface CreateUserProviderProps {
  /** Store dependencies required for initialization. */
  dependencies: CreateUserStoreDependencies
  /** Optional initial screen state override. */
  initialState?: Partial<CreateUserScreenState>
  /** React child nodes. */
  children: React.ReactNode
}

/** Context provider wrapping React components with create user store state. */
export const CreateUserProvider: React.FC<CreateUserProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createCreateUserStore(dependencies, initialState))

  return (
    <CreateUserContext.Provider value={store}>
      {children}
    </CreateUserContext.Provider>
  )
}

/**
 * Custom React hook for selecting reactive state from {@link CreateUserStore}.
 *
 * @param selector - Selector function transforming store state
 * @returns Selected slice of store state
 */
export const useCreateUserStore = <T,>(
  selector: (state: CreateUserStoreState) => T
): T => {
  const store = useContext(CreateUserContext)
  if (!store) {
    throw new Error('useCreateUserStore must be used within CreateUserProvider')
  }
  return useStore(store, selector)
}

import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetManagementStorageSettingsUseCase } from '@/usecase/storage/settings/get-management-storage-settings-use-case'
import type { UpdateManagementStorageSettingsUseCase } from '@/usecase/storage/settings/update-management-storage-settings-use-case'
import type { ResetManagementStorageSettingsUseCase } from '@/usecase/storage/settings/reset-management-storage-settings-use-case'

/**
 * Status enumeration for {@link EditStorageSettingsScreenState}.
 */
export enum EditStorageSettingsStatus {
  /** Screen is currently fetching management storage settings. */
  LOADING = 'loading',
  /** Fetching storage settings resulted in an error. */
  ERROR = 'error',
  /** Storage settings form data is loaded and ready for editing. */
  CONTENT = 'content'
}

/**
 * Discriminated union representing active UI state for {@link EditStorageSettingsScreen}.
 */
export type EditStorageSettingsScreenState =
  | {
      /** Loading state while settings are being retrieved. */
      status: EditStorageSettingsStatus.LOADING
    }
  | {
      /** Error state when loading settings failed. */
      status: EditStorageSettingsStatus.ERROR
      /** AppError instance describing the failure. */
      error: AppError
    }
  | {
      /** Content state displaying form field values. */
      status: EditStorageSettingsStatus.CONTENT
      /** Minimum upload file size string in bytes. */
      minUploadSizeBytes: string
      /** Maximum upload file size string in bytes. */
      maxUploadSizeBytes: string
      /** Total storage quota string for client users in bytes. */
      totalStorageQuotaForOpenUserBytes: string
      /** Total storage quota string for management users in bytes. */
      totalStorageQuotaForManagementUserBytes: string
      /** Presigned upload URL expiration string in seconds. */
      presignedUrlExpirationSeconds: string
      /** Max pending uploads count string for client users. */
      maxPendingUploadsForOpenUser: string
      /** Max pending uploads count string for management users. */
      maxPendingUploadsForManagementUser: string
      /** Whether file deduplication is enabled. */
      isDeduplicationEnabled: boolean
      /** Cleanup interval string for deleted files in seconds. */
      deletedFilesCleanupIntervalSeconds: string
      /** Whether save operation is currently in progress. */
      isSaving: boolean
      /** Error instance if saving settings failed. */
      saveError: AppError | null
    }

/**
 * Dependencies required to construct and run {@link EditStorageSettingsStore}.
 */
export interface EditStorageSettingsStoreDependencies {
  /** Use case execution contract for retrieving storage settings. */
  getManagementStorageSettingsUseCase: Pick<GetManagementStorageSettingsUseCase, 'execute'>
  /** Use case execution contract for updating storage settings. */
  updateManagementStorageSettingsUseCase: Pick<UpdateManagementStorageSettingsUseCase, 'execute'>
  /** Use case execution contract for resetting storage settings to defaults. */
  resetManagementStorageSettingsUseCase: Pick<ResetManagementStorageSettingsUseCase, 'execute'>
  /** Callback invoked when user triggers back navigation. */
  onBack: () => void
}

/**
 * Internal state and actions contract for {@link EditStorageSettingsStore}.
 */
export interface EditStorageSettingsStoreState {
  /** Current screen UI state. */
  screenState: EditStorageSettingsScreenState
  /** Asynchronously loads initial storage settings. */
  initScreen: () => Promise<void>
  /** Retries loading storage settings. */
  onRetry: () => Promise<void>
  /** Updates the minimum upload size value in bytes. */
  onMinUploadSizeBytesChanged: (value: string) => void
  /** Updates the maximum upload size value in bytes. */
  onMaxUploadSizeBytesChanged: (value: string) => void
  /** Updates the total storage quota string for client users. */
  onTotalStorageQuotaForOpenUserBytesChanged: (value: string) => void
  /** Updates the total storage quota string for management users. */
  onTotalStorageQuotaForManagementUserBytesChanged: (value: string) => void
  /** Updates presigned URL expiration duration in seconds. */
  onPresignedUrlExpirationSecondsChanged: (value: string) => void
  /** Updates max pending uploads limit for client users. */
  onMaxPendingUploadsForOpenUserChanged: (value: string) => void
  /** Updates max pending uploads limit for management users. */
  onMaxPendingUploadsForManagementUserChanged: (value: string) => void
  /** Toggles file deduplication setting. */
  onIsDeduplicationEnabledToggled: (enabled: boolean) => void
  /** Updates cleanup interval duration for deleted files in seconds. */
  onDeletedFilesCleanupIntervalSecondsChanged: (value: string) => void
  /** Persists updated storage settings via `updateManagementStorageSettingsUseCase`. */
  onSaveClick: () => Promise<void>
  /** Resets storage settings to default values via `resetManagementStorageSettingsUseCase`. */
  onResetClick: () => Promise<void>
  /** Triggers back navigation. */
  onBackClick: () => void
}

/**
 * Store instance type returned by {@link createEditStorageSettingsStore}.
 */
export type EditStorageSettingsStore = ReturnType<typeof createEditStorageSettingsStore>

/**
 * Factory function creating a Zustand store instance for managing storage settings editing.
 *
 * @param deps - Storage settings store dependencies.
 * @param initialState - Optional initial screen state override.
 * @returns Initialized Zustand store instance.
 */
export const createEditStorageSettingsStore = (
  deps: EditStorageSettingsStoreDependencies,
  initialState?: EditStorageSettingsScreenState
) => {
  let isFetching = false

  const parseNumber = (val: string, fallback: number): number => {
    const num = Number(val)
    return Number.isNaN(num) ? fallback : num
  }

  const parseNullableNumber = (val: string): number | null => {
    if (!val.trim()) return null
    const num = Number(val)
    return Number.isNaN(num) ? null : num
  }

  return createStore<EditStorageSettingsStoreState>()((set, get) => ({
    screenState: initialState ?? { status: EditStorageSettingsStatus.LOADING },

    initScreen: async () => {
      const current = get().screenState
      if (isFetching || current.status === EditStorageSettingsStatus.CONTENT) {
        return
      }
      isFetching = true

      try {
        set({ screenState: { status: EditStorageSettingsStatus.LOADING } })
        const settingsResult = await deps.getManagementStorageSettingsUseCase.execute()

        if (isSuccess(settingsResult)) {
          const settings = settingsResult.data
          set({
            screenState: {
              status: EditStorageSettingsStatus.CONTENT,
              minUploadSizeBytes: String(settings.minUploadSizeBytes),
              maxUploadSizeBytes: String(settings.maxUploadSizeBytes),
              totalStorageQuotaForOpenUserBytes: settings.totalStorageQuotaForOpenUserBytes != null ? String(settings.totalStorageQuotaForOpenUserBytes) : '',
              totalStorageQuotaForManagementUserBytes: settings.totalStorageQuotaForManagementUserBytes != null ? String(settings.totalStorageQuotaForManagementUserBytes) : '',
              presignedUrlExpirationSeconds: String(settings.presignedUrlExpirationSeconds),
              maxPendingUploadsForOpenUser: String(settings.maxPendingUploadsForOpenUser),
              maxPendingUploadsForManagementUser: String(settings.maxPendingUploadsForManagementUser),
              isDeduplicationEnabled: settings.isDeduplicationEnabled,
              deletedFilesCleanupIntervalSeconds: String(settings.deletedFilesCleanupIntervalSeconds ?? 86400),
              isSaving: false,
              saveError: null
            }
          })
        } else {
          set({
            screenState: {
              status: EditStorageSettingsStatus.ERROR,
              error: settingsResult.error
            }
          })
        }
      } finally {
        isFetching = false
      }
    },

    onRetry: async () => {
      await get().initScreen()
    },

    onMinUploadSizeBytesChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, minUploadSizeBytes: value, saveError: null } })
      }
    },

    onMaxUploadSizeBytesChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, maxUploadSizeBytes: value, saveError: null } })
      }
    },

    onTotalStorageQuotaForOpenUserBytesChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, totalStorageQuotaForOpenUserBytes: value, saveError: null } })
      }
    },

    onTotalStorageQuotaForManagementUserBytesChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, totalStorageQuotaForManagementUserBytes: value, saveError: null } })
      }
    },

    onPresignedUrlExpirationSecondsChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, presignedUrlExpirationSeconds: value, saveError: null } })
      }
    },

    onMaxPendingUploadsForOpenUserChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, maxPendingUploadsForOpenUser: value, saveError: null } })
      }
    },

    onMaxPendingUploadsForManagementUserChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, maxPendingUploadsForManagementUser: value, saveError: null } })
      }
    },

    onIsDeduplicationEnabledToggled: (enabled) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, isDeduplicationEnabled: enabled, saveError: null } })
      }
    },

    onDeletedFilesCleanupIntervalSecondsChanged: (value) => {
      const current = get().screenState
      if (current.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...current, deletedFilesCleanupIntervalSeconds: value, saveError: null } })
      }
    },

    onSaveClick: async () => {
      const current = get().screenState
      if (current.status !== EditStorageSettingsStatus.CONTENT || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const domainModel: ManagementStorageSettings = {
        minUploadSizeBytes: parseNumber(current.minUploadSizeBytes, 0),
        maxUploadSizeBytes: parseNumber(current.maxUploadSizeBytes, 104857600),
        totalStorageQuotaForOpenUserBytes: parseNullableNumber(current.totalStorageQuotaForOpenUserBytes),
        totalStorageQuotaForManagementUserBytes: parseNullableNumber(current.totalStorageQuotaForManagementUserBytes),
        presignedUrlExpirationSeconds: parseNumber(current.presignedUrlExpirationSeconds, 3600),
        maxPendingUploadsForOpenUser: parseNumber(current.maxPendingUploadsForOpenUser, 10),
        maxPendingUploadsForManagementUser: parseNumber(current.maxPendingUploadsForManagementUser, 50),
        isDeduplicationEnabled: current.isDeduplicationEnabled,
        deletedFilesCleanupIntervalSeconds: parseNumber(current.deletedFilesCleanupIntervalSeconds, 86400)
      }

      const saveResult = await deps.updateManagementStorageSettingsUseCase.execute(domainModel)
      if (isSuccess(saveResult)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === EditStorageSettingsStatus.CONTENT) {
          set({ screenState: { ...updated, isSaving: false, saveError: saveResult.error } })
        }
      }
    },

    onResetClick: async () => {
      const current = get().screenState
      if (current.status !== EditStorageSettingsStatus.CONTENT || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const resetResult = await deps.resetManagementStorageSettingsUseCase.execute()
      if (isSuccess(resetResult)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === EditStorageSettingsStatus.CONTENT) {
          set({ screenState: { ...updated, isSaving: false, saveError: resetResult.error } })
        }
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const EditStorageSettingsContext = createContext<EditStorageSettingsStore | null>(null)

/**
 * Props for {@link EditStorageSettingsProvider}.
 */
export interface EditStorageSettingsProviderProps {
  dependencies: EditStorageSettingsStoreDependencies
  initialState?: EditStorageSettingsScreenState
  children: React.ReactNode
}

/**
 * React Context Provider creating and binding an {@link EditStorageSettingsStore} instance.
 */
export const EditStorageSettingsProvider: React.FC<EditStorageSettingsProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createEditStorageSettingsStore(dependencies, initialState))

  return (
    <EditStorageSettingsContext.Provider value={store}>
      {children}
    </EditStorageSettingsContext.Provider>
  )
}

/**
 * Custom React hook to select state slices from {@link EditStorageSettingsStore}.
 */
export const useEditStorageSettingsStore = <T,>(
  selector: (state: EditStorageSettingsStoreState) => T
): T => {
  const store = useContext(EditStorageSettingsContext)
  if (!store) {
    throw new Error('useEditStorageSettingsStore must be used within EditStorageSettingsProvider')
  }
  return useStore(store, selector)
}

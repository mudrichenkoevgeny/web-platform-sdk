import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { GetManagementStorageSettingsUseCase } from '../../../usecase/management/get-management-storage-settings-use-case'
import type { UpdateManagementStorageSettingsUseCase } from '../../../usecase/management/update-management-storage-settings-use-case'
import type { ResetManagementStorageSettingsUseCase } from '../../../usecase/management/reset-management-storage-settings-use-case'

/** Status discriminant for {@link EditStorageSettingsScreenState}. */
export enum EditStorageSettingsStatus {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  CONTENT = 'CONTENT'
}

/** State for {@link EditStorageSettingsStatus.LOADING}. */
export interface EditStorageSettingsLoadingState {
  readonly status: EditStorageSettingsStatus.LOADING
}

/** State for {@link EditStorageSettingsStatus.ERROR}. */
export interface EditStorageSettingsErrorState {
  readonly status: EditStorageSettingsStatus.ERROR
  readonly error: AppError
}

/** State for {@link EditStorageSettingsStatus.CONTENT}. */
export interface EditStorageSettingsContentState {
  readonly status: EditStorageSettingsStatus.CONTENT
  readonly minUploadSizeBytes: string
  readonly maxUploadSizeBytes: string
  readonly totalStorageQuotaForOpenUserBytes: string
  readonly totalStorageQuotaForManagementUserBytes: string
  readonly presignedUrlExpirationSeconds: string
  readonly maxPendingUploadsForOpenUser: string
  readonly maxPendingUploadsForManagementUser: string
  readonly isDeduplicationEnabled: boolean
  readonly deletedFilesCleanupIntervalSeconds: string
  readonly isSaving: boolean
  readonly saveError: AppError | null
}

/** Discriminated union of screen states for {@link EditStorageSettingsScreen}. */
export type EditStorageSettingsScreenState =
  | EditStorageSettingsLoadingState
  | EditStorageSettingsErrorState
  | EditStorageSettingsContentState

/** Injected dependencies for creating {@link EditStorageSettingsStore}. */
export interface EditStorageSettingsStoreDependencies {
  /** Use case to retrieve storage settings. */
  readonly getSettingsUseCase: GetManagementStorageSettingsUseCase
  /** Use case to save storage settings. */
  readonly updateSettingsUseCase: UpdateManagementStorageSettingsUseCase
  /** Use case to reset storage settings. */
  readonly resetSettingsUseCase: ResetManagementStorageSettingsUseCase
  /** Optional back navigation callback. */
  readonly onBack?: () => void
}

/** Action methods exposed by {@link EditStorageSettingsStore}. */
export interface EditStorageSettingsStoreActions {
  /** Initializes screen data by fetching settings from remote or cache. */
  readonly initScreen: () => Promise<void>
  /** Retries initializing screen state after an error. */
  readonly onRetry: () => void
  /** Handles changes to minimum upload size field. */
  readonly onMinUploadSizeBytesChanged: (value: string) => void
  /** Handles changes to maximum upload size field. */
  readonly onMaxUploadSizeBytesChanged: (value: string) => void
  /** Handles changes to open user quota field. */
  readonly onTotalStorageQuotaForOpenUserBytesChanged: (value: string) => void
  /** Handles changes to management user quota field. */
  readonly onTotalStorageQuotaForManagementUserBytesChanged: (value: string) => void
  /** Handles changes to presigned URL expiration field. */
  readonly onPresignedUrlExpirationSecondsChanged: (value: string) => void
  /** Handles changes to max pending uploads for open users field. */
  readonly onMaxPendingUploadsForOpenUserChanged: (value: string) => void
  /** Handles changes to max pending uploads for management users field. */
  readonly onMaxPendingUploadsForManagementUserChanged: (value: string) => void
  /** Handles toggling deduplication switch. */
  readonly onIsDeduplicationEnabledToggled: (value: boolean) => void
  /** Handles changes to deleted files cleanup interval field. */
  readonly onDeletedFilesCleanupIntervalSecondsChanged: (value: string) => void
  /** Submits updated storage settings. */
  readonly onSaveClick: () => Promise<void>
  /** Resets storage settings to default configuration. */
  readonly onResetClick: () => Promise<void>
  /** Triggers back navigation callback if provided. */
  readonly onBackClick: () => void
}

/** Combined Zustand store shape for {@link EditStorageSettingsScreen}. */
export interface EditStorageSettingsStoreState {
  readonly screenState: EditStorageSettingsScreenState
}

export type EditStorageSettingsStore = EditStorageSettingsStoreState & EditStorageSettingsStoreActions

/**
 * Creates a new Zustand store instance for managing {@link EditStorageSettingsScreen} state.
 *
 * @param dependencies - Injected use cases and callbacks
 * @returns Configured Zustand store
 */
export const createEditStorageSettingsStore = (
  dependencies: EditStorageSettingsStoreDependencies
) =>
  createStore<EditStorageSettingsStore>((set, get) => ({
    screenState: { status: EditStorageSettingsStatus.LOADING },

    initScreen: async () => {
      set({ screenState: { status: EditStorageSettingsStatus.LOADING } })
      const result = await dependencies.getSettingsUseCase.execute()

      if (isFailure(result)) {
        set({
          screenState: {
            status: EditStorageSettingsStatus.ERROR,
            error: result.error
          }
        })
        return
      }

      const s = result.data
      set({
        screenState: {
          status: EditStorageSettingsStatus.CONTENT,
          minUploadSizeBytes: String(s.minUploadSizeBytes),
          maxUploadSizeBytes: String(s.maxUploadSizeBytes),
          totalStorageQuotaForOpenUserBytes: String(s.totalStorageQuotaForOpenUserBytes),
          totalStorageQuotaForManagementUserBytes: String(s.totalStorageQuotaForManagementUserBytes),
          presignedUrlExpirationSeconds: String(s.presignedUrlExpirationSeconds),
          maxPendingUploadsForOpenUser: String(s.maxPendingUploadsForOpenUser),
          maxPendingUploadsForManagementUser: String(s.maxPendingUploadsForManagementUser),
          isDeduplicationEnabled: s.isDeduplicationEnabled,
          deletedFilesCleanupIntervalSeconds: String(s.deletedFilesCleanupIntervalSeconds),
          isSaving: false,
          saveError: null
        }
      })
    },

    onRetry: () => {
      void get().initScreen()
    },

    onMinUploadSizeBytesChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, minUploadSizeBytes: value } })
      }
    },

    onMaxUploadSizeBytesChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, maxUploadSizeBytes: value } })
      }
    },

    onTotalStorageQuotaForOpenUserBytesChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, totalStorageQuotaForOpenUserBytes: value } })
      }
    },

    onTotalStorageQuotaForManagementUserBytesChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, totalStorageQuotaForManagementUserBytes: value } })
      }
    },

    onPresignedUrlExpirationSecondsChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, presignedUrlExpirationSeconds: value } })
      }
    },

    onMaxPendingUploadsForOpenUserChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, maxPendingUploadsForOpenUser: value } })
      }
    },

    onMaxPendingUploadsForManagementUserChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, maxPendingUploadsForManagementUser: value } })
      }
    },

    onIsDeduplicationEnabledToggled: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, isDeduplicationEnabled: value } })
      }
    },

    onDeletedFilesCleanupIntervalSecondsChanged: (value) => {
      const state = get().screenState
      if (state.status === EditStorageSettingsStatus.CONTENT) {
        set({ screenState: { ...state, deletedFilesCleanupIntervalSeconds: value } })
      }
    },

    onSaveClick: async () => {
      const state = get().screenState
      if (state.status !== EditStorageSettingsStatus.CONTENT || state.isSaving) {
        return
      }

      set({ screenState: { ...state, isSaving: true, saveError: null } })

      const updatedSettings: ManagementStorageSettings = {
        minUploadSizeBytes: Number(state.minUploadSizeBytes) || 0,
        maxUploadSizeBytes: Number(state.maxUploadSizeBytes) || 0,
        totalStorageQuotaForOpenUserBytes: Number(state.totalStorageQuotaForOpenUserBytes) || 0,
        totalStorageQuotaForManagementUserBytes: Number(state.totalStorageQuotaForManagementUserBytes) || 0,
        presignedUrlExpirationSeconds: Number(state.presignedUrlExpirationSeconds) || 0,
        maxPendingUploadsForOpenUser: Number(state.maxPendingUploadsForOpenUser) || 0,
        maxPendingUploadsForManagementUser: Number(state.maxPendingUploadsForManagementUser) || 0,
        isDeduplicationEnabled: state.isDeduplicationEnabled,
        deletedFilesCleanupIntervalSeconds: Number(state.deletedFilesCleanupIntervalSeconds) || 0
      }

      const result = await dependencies.updateSettingsUseCase.execute(updatedSettings)

      if (isFailure(result)) {
        set({
          screenState: {
            ...state,
            isSaving: false,
            saveError: result.error
          }
        })
        return
      }

      set({
        screenState: {
          ...state,
          isSaving: false,
          saveError: null
        }
      })
    },

    onResetClick: async () => {
      const state = get().screenState
      if (state.status !== EditStorageSettingsStatus.CONTENT || state.isSaving) {
        return
      }

      set({ screenState: { ...state, isSaving: true, saveError: null } })
      const result = await dependencies.resetSettingsUseCase.execute()

      if (isFailure(result)) {
        set({
          screenState: {
            ...state,
            isSaving: false,
            saveError: result.error
          }
        })
        return
      }

      void get().initScreen()
    },

    onBackClick: () => {
      dependencies.onBack?.()
    }
  }))

const EditStorageSettingsContext = createContext<ReturnType<typeof createEditStorageSettingsStore> | null>(null)

export const EditStorageSettingsProvider: React.FC<{
  dependencies: EditStorageSettingsStoreDependencies
  children: React.ReactNode
}> = ({ dependencies, children }) => {
  const [store] = useState(() => createEditStorageSettingsStore(dependencies))
  return (
    <EditStorageSettingsContext.Provider value={store}>
      {children}
    </EditStorageSettingsContext.Provider>
  )
}

export function useEditStorageSettingsStore<T>(
  selector: (state: EditStorageSettingsStore) => T
): T {
  const store = useContext(EditStorageSettingsContext)
  if (!store) {
    throw new Error('useEditStorageSettingsStore must be used within EditStorageSettingsProvider')
  }
  return useStore(store, selector)
}

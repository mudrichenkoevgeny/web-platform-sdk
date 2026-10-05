import React, { createContext, useContext, useEffect, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { ClientType } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import type { ResetRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/reset-remote-global-settings-use-case'
import type { SaveRemoteGlobalSettingsUseCase } from '@/usecase/global-settings/save-remote-global-settings-use-case'

export type EditGlobalSettingsScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      privacyPolicyUrl: string
      termsOfServiceUrl: string
      contactSupportEmail: string
      minVersionAndroid: string
      minVersionIos: string
      minVersionWeb: string
      minVersionDesktop: string
      isTracingEnabled: boolean
      isMetricsEnabled: boolean
      isVerboseLoggingEnabled: boolean
      isSaving: boolean
      saveError: AppError | null
    }

export interface EditGlobalSettingsStoreDependencies {
  getManagementGlobalSettingsUseCase: GetManagementGlobalSettingsUseCase
  saveRemoteGlobalSettingsUseCase: SaveRemoteGlobalSettingsUseCase
  resetRemoteGlobalSettingsUseCase: ResetRemoteGlobalSettingsUseCase
  onBack: () => void
}

export interface EditGlobalSettingsStoreState {
  screenState: EditGlobalSettingsScreenState
  initScreen: () => Promise<void>
  onRetry: () => Promise<void>
  onPrivacyPolicyUrlChanged: (value: string) => void
  onTermsOfServiceUrlChanged: (value: string) => void
  onContactSupportEmailChanged: (value: string) => void
  onMinVersionAndroidChanged: (value: string) => void
  onMinVersionIosChanged: (value: string) => void
  onMinVersionWebChanged: (value: string) => void
  onMinVersionDesktopChanged: (value: string) => void
  onTracingEnabledToggled: (enabled: boolean) => void
  onMetricsEnabledToggled: (enabled: boolean) => void
  onVerboseLoggingEnabledToggled: (enabled: boolean) => void
  onSaveClick: () => Promise<void>
  onResetClick: () => Promise<void>
  onBackClick: () => void
}

export type EditGlobalSettingsStore = ReturnType<typeof createEditGlobalSettingsStore>

export const createEditGlobalSettingsStore = (
  deps: EditGlobalSettingsStoreDependencies,
  initialState?: EditGlobalSettingsScreenState
) => {
  return createStore<EditGlobalSettingsStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      const result = await deps.getManagementGlobalSettingsUseCase.execute()

      if (isSuccess(result)) {
        const settings = result.data
        const minVersions = settings.minSupportedAppVersions ?? {}

        set({
          screenState: {
            status: 'content',
            privacyPolicyUrl: settings.privacyPolicyUrl ?? '',
            termsOfServiceUrl: settings.termsOfServiceUrl ?? '',
            contactSupportEmail: settings.contactSupportEmail ?? '',
            minVersionAndroid: minVersions[ClientType.ANDROID] ?? '',
            minVersionIos: minVersions[ClientType.IOS] ?? '',
            minVersionWeb: minVersions[ClientType.WEB] ?? '',
            minVersionDesktop: minVersions[ClientType.DESKTOP] ?? '',
            isTracingEnabled: settings.isTracingEnabled,
            isMetricsEnabled: settings.isMetricsEnabled,
            isVerboseLoggingEnabled: settings.isVerboseLoggingEnabled,
            isSaving: false,
            saveError: null
          }
        })
      } else {
        set({
          screenState: {
            status: 'error',
            error: result.error
          }
        })
      }
    },

    onRetry: async () => {
      await get().initScreen()
    },

    onPrivacyPolicyUrlChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, privacyPolicyUrl: value, saveError: null } })
      }
    },

    onTermsOfServiceUrlChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, termsOfServiceUrl: value, saveError: null } })
      }
    },

    onContactSupportEmailChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, contactSupportEmail: value, saveError: null } })
      }
    },

    onMinVersionAndroidChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, minVersionAndroid: value, saveError: null } })
      }
    },

    onMinVersionIosChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, minVersionIos: value, saveError: null } })
      }
    },

    onMinVersionWebChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, minVersionWeb: value, saveError: null } })
      }
    },

    onMinVersionDesktopChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, minVersionDesktop: value, saveError: null } })
      }
    },

    onTracingEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isTracingEnabled: enabled, saveError: null } })
      }
    },

    onMetricsEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isMetricsEnabled: enabled, saveError: null } })
      }
    },

    onVerboseLoggingEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isVerboseLoggingEnabled: enabled, saveError: null } })
      }
    },

    onSaveClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const minSupportedAppVersions: Partial<Record<ClientType, string>> = {}
      if (current.minVersionAndroid.trim().length > 0) {
        minSupportedAppVersions[ClientType.ANDROID] = current.minVersionAndroid.trim()
      }
      if (current.minVersionIos.trim().length > 0) {
        minSupportedAppVersions[ClientType.IOS] = current.minVersionIos.trim()
      }
      if (current.minVersionWeb.trim().length > 0) {
        minSupportedAppVersions[ClientType.WEB] = current.minVersionWeb.trim()
      }
      if (current.minVersionDesktop.trim().length > 0) {
        minSupportedAppVersions[ClientType.DESKTOP] = current.minVersionDesktop.trim()
      }

      const settings: ManagementGlobalSettings = {
        privacyPolicyUrl: current.privacyPolicyUrl.trim() || null,
        termsOfServiceUrl: current.termsOfServiceUrl.trim() || null,
        contactSupportEmail: current.contactSupportEmail.trim() || null,
        minSupportedAppVersions,
        isTracingEnabled: current.isTracingEnabled,
        isMetricsEnabled: current.isMetricsEnabled,
        isVerboseLoggingEnabled: current.isVerboseLoggingEnabled
      }

      const saveResult = await deps.saveRemoteGlobalSettingsUseCase.execute(settings)
      if (isSuccess(saveResult)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, isSaving: false, saveError: saveResult.error } })
        }
      }
    },

    onResetClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const result = await deps.resetRemoteGlobalSettingsUseCase.execute()
      if (isSuccess(result)) {
        deps.onBack()
      } else {
        const updated = get().screenState
        if (updated.status === 'content') {
          set({ screenState: { ...updated, isSaving: false, saveError: result.error } })
        }
      }
    },

    onBackClick: () => {
      deps.onBack()
    }
  }))
}

const EditGlobalSettingsContext = createContext<EditGlobalSettingsStore | null>(null)

export interface EditGlobalSettingsProviderProps {
  dependencies: EditGlobalSettingsStoreDependencies
  initialState?: EditGlobalSettingsScreenState
  children: React.ReactNode
}

export const EditGlobalSettingsProvider: React.FC<EditGlobalSettingsProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createEditGlobalSettingsStore(dependencies, initialState))

  return (
    <EditGlobalSettingsContext.Provider value={store}>
      {children}
    </EditGlobalSettingsContext.Provider>
  )
}

export const useEditGlobalSettingsStore = <T,>(
  selector: (state: EditGlobalSettingsStoreState) => T
): T => {
  const store = useContext(EditGlobalSettingsContext)
  if (!store) {
    throw new Error('useEditGlobalSettingsStore must be used within EditGlobalSettingsProvider')
  }
  return useStore(store, selector)
}

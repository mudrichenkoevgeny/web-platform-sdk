import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuthSettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import type { ResetRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/reset-remote-auth-settings-use-case'
import type { SaveRemoteAuthSettingsUseCase } from '@/usecase/auth/settings/save-remote-auth-settings-use-case'

export const DEFAULT_OTP_LENGTH = 6

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value.trim(), 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

export type EditAuthSettingsScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      enabledProviders: Set<UserAuthProvider>
      maxTotalIdentifiers: string
      maxEmailIdentifiers: string
      maxPhoneIdentifiers: string
      maxIdentifiersPerExternalProvider: string
      maxActiveSessionsForOpenUser: string
      maxActiveSessionsForManagementUser: string
      accessTokenExpirationSeconds: string
      refreshTokenExpirationSeconds: string
      accountDeletionGracePeriodSeconds: string
      accountDeletionCheckIntervalSeconds: string
      isRegistrationEnabled: boolean
      openEmailBlacklistEnabled: boolean
      openEmailBlacklist: string
      openEmailWhitelistEnabled: boolean
      openEmailWhitelist: string
      managementEmailBlacklistEnabled: boolean
      managementEmailBlacklist: string
      managementEmailWhitelistEnabled: boolean
      managementEmailWhitelist: string
      isSaving: boolean
      saveError: AppError | null
    }

export interface EditAuthSettingsStoreDependencies {
  getManagementAuthSettingsUseCase: GetManagementAuthSettingsUseCase
  saveRemoteAuthSettingsUseCase: SaveRemoteAuthSettingsUseCase
  resetRemoteAuthSettingsUseCase: ResetRemoteAuthSettingsUseCase
  onBack: () => void
}

export interface EditAuthSettingsStoreState {
  screenState: EditAuthSettingsScreenState
  initScreen: () => Promise<void>
  onRetry: () => Promise<void>
  onProviderToggled: (provider: UserAuthProvider, enabled: boolean) => void
  onMaxTotalIdentifiersChanged: (value: string) => void
  onMaxEmailIdentifiersChanged: (value: string) => void
  onMaxPhoneIdentifiersChanged: (value: string) => void
  onMaxIdentifiersPerExternalProviderChanged: (value: string) => void
  onMaxActiveSessionsForOpenUserChanged: (value: string) => void
  onMaxActiveSessionsForManagementUserChanged: (value: string) => void
  onAccessTokenExpirationSecondsChanged: (value: string) => void
  onRefreshTokenExpirationSecondsChanged: (value: string) => void
  onAccountDeletionGracePeriodSecondsChanged: (value: string) => void
  onAccountDeletionCheckIntervalSecondsChanged: (value: string) => void
  onRegistrationEnabledToggled: (enabled: boolean) => void
  onOpenEmailBlacklistEnabledToggled: (enabled: boolean) => void
  onOpenEmailBlacklistChanged: (value: string) => void
  onOpenEmailWhitelistEnabledToggled: (enabled: boolean) => void
  onOpenEmailWhitelistChanged: (value: string) => void
  onManagementEmailBlacklistEnabledToggled: (enabled: boolean) => void
  onManagementEmailBlacklistChanged: (value: string) => void
  onManagementEmailWhitelistEnabledToggled: (enabled: boolean) => void
  onManagementEmailWhitelistChanged: (value: string) => void
  onSaveClick: () => Promise<void>
  onResetClick: () => Promise<void>
  onBackClick: () => void
}

export type EditAuthSettingsStore = ReturnType<typeof createEditAuthSettingsStore>

export const createEditAuthSettingsStore = (
  deps: EditAuthSettingsStoreDependencies,
  initialState?: EditAuthSettingsScreenState
) => {
  return createStore<EditAuthSettingsStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      const result = await deps.getManagementAuthSettingsUseCase.execute()

      if (isSuccess(result)) {
        const settings = result.data
        const enabled = new Set<UserAuthProvider>([
          ...settings.availableAuthProviders.primary,
          ...settings.availableAuthProviders.secondary
        ])

        set({
          screenState: {
            status: 'content',
            enabledProviders: enabled,
            maxTotalIdentifiers: String(settings.maxTotalIdentifiers),
            maxEmailIdentifiers: String(settings.maxEmailIdentifiers),
            maxPhoneIdentifiers: String(settings.maxPhoneIdentifiers),
            maxIdentifiersPerExternalProvider: String(settings.maxIdentifiersPerExternalProvider),
            maxActiveSessionsForOpenUser: String(settings.maxActiveSessionsForOpenUser),
            maxActiveSessionsForManagementUser: String(settings.maxActiveSessionsForManagementUser),
            accessTokenExpirationSeconds: String(settings.accessTokenExpirationSeconds),
            refreshTokenExpirationSeconds: String(settings.refreshTokenExpirationSeconds),
            accountDeletionGracePeriodSeconds: String(settings.accountDeletionGracePeriodSeconds),
            accountDeletionCheckIntervalSeconds: String(settings.accountDeletionCheckIntervalSeconds),
            isRegistrationEnabled: settings.isRegistrationEnabled,
            openEmailBlacklistEnabled: settings.openEmailRestrictionPolicy.isBlacklistEnabled,
            openEmailBlacklist: settings.openEmailRestrictionPolicy.blacklist.join(','),
            openEmailWhitelistEnabled: settings.openEmailRestrictionPolicy.isWhitelistEnabled,
            openEmailWhitelist: settings.openEmailRestrictionPolicy.whitelist.join(','),
            managementEmailBlacklistEnabled: settings.managementEmailRestrictionPolicy.isBlacklistEnabled,
            managementEmailBlacklist: settings.managementEmailRestrictionPolicy.blacklist.join(','),
            managementEmailWhitelistEnabled: settings.managementEmailRestrictionPolicy.isWhitelistEnabled,
            managementEmailWhitelist: settings.managementEmailRestrictionPolicy.whitelist.join(','),
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

    onProviderToggled: (provider: UserAuthProvider, enabled: boolean) => {
      const current = get().screenState
      if (current.status !== 'content') {
        return
      }

      const nextProviders = new Set(current.enabledProviders)
      if (enabled) {
        nextProviders.add(provider)
      } else {
        nextProviders.delete(provider)
      }

      set({
        screenState: {
          ...current,
          enabledProviders: nextProviders,
          saveError: null
        }
      })
    },

    onMaxTotalIdentifiersChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxTotalIdentifiers: value, saveError: null } })
      }
    },

    onMaxEmailIdentifiersChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxEmailIdentifiers: value, saveError: null } })
      }
    },

    onMaxPhoneIdentifiersChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxPhoneIdentifiers: value, saveError: null } })
      }
    },

    onMaxIdentifiersPerExternalProviderChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxIdentifiersPerExternalProvider: value, saveError: null } })
      }
    },

    onMaxActiveSessionsForOpenUserChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxActiveSessionsForOpenUser: value, saveError: null } })
      }
    },

    onMaxActiveSessionsForManagementUserChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxActiveSessionsForManagementUser: value, saveError: null } })
      }
    },

    onAccessTokenExpirationSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accessTokenExpirationSeconds: value, saveError: null } })
      }
    },

    onRefreshTokenExpirationSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, refreshTokenExpirationSeconds: value, saveError: null } })
      }
    },

    onAccountDeletionGracePeriodSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountDeletionGracePeriodSeconds: value, saveError: null } })
      }
    },

    onAccountDeletionCheckIntervalSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountDeletionCheckIntervalSeconds: value, saveError: null } })
      }
    },

    onRegistrationEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, isRegistrationEnabled: enabled, saveError: null } })
      }
    },

    onOpenEmailBlacklistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openEmailBlacklistEnabled: enabled, saveError: null } })
      }
    },

    onOpenEmailBlacklistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openEmailBlacklist: value, saveError: null } })
      }
    },

    onOpenEmailWhitelistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openEmailWhitelistEnabled: enabled, saveError: null } })
      }
    },

    onOpenEmailWhitelistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openEmailWhitelist: value, saveError: null } })
      }
    },

    onManagementEmailBlacklistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementEmailBlacklistEnabled: enabled, saveError: null } })
      }
    },

    onManagementEmailBlacklistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementEmailBlacklist: value, saveError: null } })
      }
    },

    onManagementEmailWhitelistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementEmailWhitelistEnabled: enabled, saveError: null } })
      }
    },

    onManagementEmailWhitelistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementEmailWhitelist: value, saveError: null } })
      }
    },

    onSaveClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const primary = [UserAuthProvider.EMAIL, UserAuthProvider.PHONE].filter((p) =>
        current.enabledProviders.has(p)
      )
      const secondary = [UserAuthProvider.GOOGLE, UserAuthProvider.APPLE].filter((p) =>
        current.enabledProviders.has(p)
      )

      const settings: ManagementAuthSettings = {
        availableAuthProviders: {
          primary,
          secondary
        },
        maxTotalIdentifiers: parseIntegerOrDefault(current.maxTotalIdentifiers, 10),
        maxEmailIdentifiers: parseIntegerOrDefault(current.maxEmailIdentifiers, 5),
        maxPhoneIdentifiers: parseIntegerOrDefault(current.maxPhoneIdentifiers, 5),
        maxIdentifiersPerExternalProvider: parseIntegerOrDefault(current.maxIdentifiersPerExternalProvider, 2),
        maxActiveSessionsForOpenUser: parseIntegerOrDefault(current.maxActiveSessionsForOpenUser, 3),
        maxActiveSessionsForManagementUser: parseIntegerOrDefault(current.maxActiveSessionsForManagementUser, 5),
        accessTokenExpirationSeconds: parseIntegerOrDefault(current.accessTokenExpirationSeconds, 3600),
        refreshTokenExpirationSeconds: parseIntegerOrDefault(current.refreshTokenExpirationSeconds, 86400),
        accountDeletionGracePeriodSeconds: parseIntegerOrDefault(current.accountDeletionGracePeriodSeconds, 604800),
        accountDeletionCheckIntervalSeconds: parseIntegerOrDefault(current.accountDeletionCheckIntervalSeconds, 86400),
        isRegistrationEnabled: current.isRegistrationEnabled,
        openEmailRestrictionPolicy: {
          isBlacklistEnabled: current.openEmailBlacklistEnabled,
          blacklist: current.openEmailBlacklist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          isWhitelistEnabled: current.openEmailWhitelistEnabled,
          whitelist: current.openEmailWhitelist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        },
        managementEmailRestrictionPolicy: {
          isBlacklistEnabled: current.managementEmailBlacklistEnabled,
          blacklist: current.managementEmailBlacklist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          isWhitelistEnabled: current.managementEmailWhitelistEnabled,
          whitelist: current.managementEmailWhitelist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        }
      }

      const saveResult = await deps.saveRemoteAuthSettingsUseCase.execute(settings)
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

      const result = await deps.resetRemoteAuthSettingsUseCase.execute()
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

const EditAuthSettingsContext = createContext<EditAuthSettingsStore | null>(null)

export interface EditAuthSettingsProviderProps {
  dependencies: EditAuthSettingsStoreDependencies
  initialState?: EditAuthSettingsScreenState
  children: React.ReactNode
}

export const EditAuthSettingsProvider: React.FC<EditAuthSettingsProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createEditAuthSettingsStore(dependencies, initialState))

  return (
    <EditAuthSettingsContext.Provider value={store}>
      {children}
    </EditAuthSettingsContext.Provider>
  )
}

export const useEditAuthSettingsStore = <T,>(
  selector: (state: EditAuthSettingsStoreState) => T
): T => {
  const store = useContext(EditAuthSettingsContext)
  if (!store) {
    throw new Error('useEditAuthSettingsStore must be used within EditAuthSettingsProvider')
  }
  return useStore(store, selector)
}

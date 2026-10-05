import React, { createContext, useContext, useState } from 'react'
import { createStore, useStore } from 'zustand'
import type { ManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import type { AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import type { ResetRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/reset-remote-security-settings-use-case'
import type { SaveRemoteSecuritySettingsUseCase } from '@/usecase/security/settings/save-remote-security-settings-use-case'

const parseIntegerOrDefault = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value.trim(), 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

export type EditSecuritySettingsScreenState =
  | {
      status: 'loading'
    }
  | {
      status: 'error'
      error: AppError
    }
  | {
      status: 'content'
      recentAuthenticationValiditySecondsForOpenUser: string
      recentAuthenticationValiditySecondsForManagementUser: string
      mfaTokenExpirationSeconds: string
      passwordMinLength: string
      passwordRequireLetter: boolean
      passwordRequireUpperCase: boolean
      passwordRequireLowerCase: boolean
      passwordRequireDigit: boolean
      passwordRequireSpecialChar: boolean
      commonPasswords: string
      accountLockoutMaxFailedPasswordAttempts: string
      accountLockoutMaxFailedOtpAttempts: string
      accountLockoutMaxFailedTotpAttempts: string
      accountLockoutFailedAttemptsWindowSeconds: string
      accountLockoutDurationSeconds: string
      accountLockoutIndefiniteLockoutThreshold: string
      accountLockoutIsSelfServiceUnlockEnabled: boolean
      accountLockoutCheckIntervalSeconds: string
      refreshTokenRotationGracePeriodSeconds: string
      openIpBlacklistEnabled: boolean
      openIpBlacklist: string
      openIpWhitelistEnabled: boolean
      openIpWhitelist: string
      managementIpBlacklistEnabled: boolean
      managementIpBlacklist: string
      managementIpWhitelistEnabled: boolean
      managementIpWhitelist: string
      otpRetryAfterSeconds: string
      otpNumberOfSymbols: string
      otpExpirationSeconds: string
      maxRequestsPerPeriod: string
      rateLimitPeriodSeconds: string
      isSaving: boolean
      saveError: AppError | null
    }

export interface EditSecuritySettingsStoreDependencies {
  getManagementSecuritySettingsUseCase: GetManagementSecuritySettingsUseCase
  saveRemoteSecuritySettingsUseCase: SaveRemoteSecuritySettingsUseCase
  resetRemoteSecuritySettingsUseCase: ResetRemoteSecuritySettingsUseCase
  onBack: () => void
}

export interface EditSecuritySettingsStoreState {
  screenState: EditSecuritySettingsScreenState
  initScreen: () => Promise<void>
  onRetry: () => Promise<void>
  onRecentAuthenticationValidityForOpenUserChanged: (value: string) => void
  onRecentAuthenticationValidityForManagementUserChanged: (value: string) => void
  onMfaTokenExpirationSecondsChanged: (value: string) => void
  onPasswordMinLengthChanged: (value: string) => void
  onPasswordRequireLetterToggled: (enabled: boolean) => void
  onPasswordRequireUpperCaseToggled: (enabled: boolean) => void
  onPasswordRequireLowerCaseToggled: (enabled: boolean) => void
  onPasswordRequireDigitToggled: (enabled: boolean) => void
  onPasswordRequireSpecialCharToggled: (enabled: boolean) => void
  onCommonPasswordsChanged: (value: string) => void
  onAccountLockoutMaxFailedPasswordAttemptsChanged: (value: string) => void
  onAccountLockoutMaxFailedOtpAttemptsChanged: (value: string) => void
  onAccountLockoutMaxFailedTotpAttemptsChanged: (value: string) => void
  onAccountLockoutFailedAttemptsWindowSecondsChanged: (value: string) => void
  onAccountLockoutDurationSecondsChanged: (value: string) => void
  onAccountLockoutIndefiniteLockoutThresholdChanged: (value: string) => void
  onAccountLockoutIsSelfServiceUnlockEnabledToggled: (enabled: boolean) => void
  onAccountLockoutCheckIntervalSecondsChanged: (value: string) => void
  onRefreshTokenRotationGracePeriodSecondsChanged: (value: string) => void
  onOpenIpBlacklistEnabledToggled: (enabled: boolean) => void
  onOpenIpBlacklistChanged: (value: string) => void
  onOpenIpWhitelistEnabledToggled: (enabled: boolean) => void
  onOpenIpWhitelistChanged: (value: string) => void
  onManagementIpBlacklistEnabledToggled: (enabled: boolean) => void
  onManagementIpBlacklistChanged: (value: string) => void
  onManagementIpWhitelistEnabledToggled: (enabled: boolean) => void
  onManagementIpWhitelistChanged: (value: string) => void
  onOtpRetryAfterSecondsChanged: (value: string) => void
  onOtpNumberOfSymbolsChanged: (value: string) => void
  onOtpExpirationSecondsChanged: (value: string) => void
  onMaxRequestsPerPeriodChanged: (value: string) => void
  onRateLimitPeriodSecondsChanged: (value: string) => void
  onSaveClick: () => Promise<void>
  onResetClick: () => Promise<void>
  onBackClick: () => void
}

export type EditSecuritySettingsStore = ReturnType<typeof createEditSecuritySettingsStore>

export const createEditSecuritySettingsStore = (
  deps: EditSecuritySettingsStoreDependencies,
  initialState?: EditSecuritySettingsScreenState
) => {
  return createStore<EditSecuritySettingsStoreState>()((set, get) => ({
    screenState: initialState ?? { status: 'loading' },

    initScreen: async () => {
      set({ screenState: { status: 'loading' } })
      const result = await deps.getManagementSecuritySettingsUseCase.execute()

      if (isSuccess(result)) {
        const settings = result.data
        const commonPasses = Array.from(settings.passwordPolicy.commonPasswords ?? [])

        set({
          screenState: {
            status: 'content',
            recentAuthenticationValiditySecondsForOpenUser: String(settings.recentAuthenticationValiditySecondsForOpenUser),
            recentAuthenticationValiditySecondsForManagementUser: String(settings.recentAuthenticationValiditySecondsForManagementUser),
            mfaTokenExpirationSeconds: String(settings.mfaTokenExpirationSeconds),
            passwordMinLength: String(settings.passwordPolicy.minLength),
            passwordRequireLetter: settings.passwordPolicy.requireLetter,
            passwordRequireUpperCase: settings.passwordPolicy.requireUpperCase,
            passwordRequireLowerCase: settings.passwordPolicy.requireLowerCase,
            passwordRequireDigit: settings.passwordPolicy.requireDigit,
            passwordRequireSpecialChar: settings.passwordPolicy.requireSpecialChar,
            commonPasswords: commonPasses.join(','),
            accountLockoutMaxFailedPasswordAttempts: String(settings.accountLockoutPolicy.maxFailedPasswordAttempts),
            accountLockoutMaxFailedOtpAttempts: String(settings.accountLockoutPolicy.maxFailedOtpAttempts),
            accountLockoutMaxFailedTotpAttempts: String(settings.accountLockoutPolicy.maxFailedTotpAttempts),
            accountLockoutFailedAttemptsWindowSeconds: String(settings.accountLockoutPolicy.failedAttemptsWindowSeconds),
            accountLockoutDurationSeconds: String(settings.accountLockoutPolicy.lockoutDurationSeconds),
            accountLockoutIndefiniteLockoutThreshold: String(settings.accountLockoutPolicy.indefiniteLockoutThreshold),
            accountLockoutIsSelfServiceUnlockEnabled: settings.accountLockoutPolicy.isSelfServiceUnlockEnabled,
            accountLockoutCheckIntervalSeconds: String(settings.accountLockoutCheckIntervalSeconds),
            refreshTokenRotationGracePeriodSeconds: String(settings.refreshTokenRotationGracePeriodSeconds),
            openIpBlacklistEnabled: settings.openIpRestrictionPolicy.isBlacklistEnabled,
            openIpBlacklist: settings.openIpRestrictionPolicy.blacklist.join(','),
            openIpWhitelistEnabled: settings.openIpRestrictionPolicy.isWhitelistEnabled,
            openIpWhitelist: settings.openIpRestrictionPolicy.whitelist.join(','),
            managementIpBlacklistEnabled: settings.managementIpRestrictionPolicy.isBlacklistEnabled,
            managementIpBlacklist: settings.managementIpRestrictionPolicy.blacklist.join(','),
            managementIpWhitelistEnabled: settings.managementIpRestrictionPolicy.isWhitelistEnabled,
            managementIpWhitelist: settings.managementIpRestrictionPolicy.whitelist.join(','),
            otpRetryAfterSeconds: String(settings.otpConfirmation.retryAfterSeconds),
            otpNumberOfSymbols: String(settings.otpConfirmation.numberOfSymbols),
            otpExpirationSeconds: String(settings.otpConfirmation.expirationSeconds),
            maxRequestsPerPeriod: String(settings.maxRequestsPerPeriod),
            rateLimitPeriodSeconds: String(settings.rateLimitPeriodSeconds),
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

    onRecentAuthenticationValidityForOpenUserChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, recentAuthenticationValiditySecondsForOpenUser: value, saveError: null } })
      }
    },

    onRecentAuthenticationValidityForManagementUserChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, recentAuthenticationValiditySecondsForManagementUser: value, saveError: null } })
      }
    },

    onMfaTokenExpirationSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, mfaTokenExpirationSeconds: value, saveError: null } })
      }
    },

    onPasswordMinLengthChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordMinLength: value, saveError: null } })
      }
    },

    onPasswordRequireLetterToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordRequireLetter: enabled, saveError: null } })
      }
    },

    onPasswordRequireUpperCaseToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordRequireUpperCase: enabled, saveError: null } })
      }
    },

    onPasswordRequireLowerCaseToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordRequireLowerCase: enabled, saveError: null } })
      }
    },

    onPasswordRequireDigitToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordRequireDigit: enabled, saveError: null } })
      }
    },

    onPasswordRequireSpecialCharToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, passwordRequireSpecialChar: enabled, saveError: null } })
      }
    },

    onCommonPasswordsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, commonPasswords: value, saveError: null } })
      }
    },

    onAccountLockoutMaxFailedPasswordAttemptsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutMaxFailedPasswordAttempts: value, saveError: null } })
      }
    },

    onAccountLockoutMaxFailedOtpAttemptsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutMaxFailedOtpAttempts: value, saveError: null } })
      }
    },

    onAccountLockoutMaxFailedTotpAttemptsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutMaxFailedTotpAttempts: value, saveError: null } })
      }
    },

    onAccountLockoutFailedAttemptsWindowSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutFailedAttemptsWindowSeconds: value, saveError: null } })
      }
    },

    onAccountLockoutDurationSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutDurationSeconds: value, saveError: null } })
      }
    },

    onAccountLockoutIndefiniteLockoutThresholdChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutIndefiniteLockoutThreshold: value, saveError: null } })
      }
    },

    onAccountLockoutIsSelfServiceUnlockEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutIsSelfServiceUnlockEnabled: enabled, saveError: null } })
      }
    },

    onAccountLockoutCheckIntervalSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, accountLockoutCheckIntervalSeconds: value, saveError: null } })
      }
    },

    onRefreshTokenRotationGracePeriodSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, refreshTokenRotationGracePeriodSeconds: value, saveError: null } })
      }
    },

    onOpenIpBlacklistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openIpBlacklistEnabled: enabled, saveError: null } })
      }
    },

    onOpenIpBlacklistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openIpBlacklist: value, saveError: null } })
      }
    },

    onOpenIpWhitelistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openIpWhitelistEnabled: enabled, saveError: null } })
      }
    },

    onOpenIpWhitelistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, openIpWhitelist: value, saveError: null } })
      }
    },

    onManagementIpBlacklistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementIpBlacklistEnabled: enabled, saveError: null } })
      }
    },

    onManagementIpBlacklistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementIpBlacklist: value, saveError: null } })
      }
    },

    onManagementIpWhitelistEnabledToggled: (enabled: boolean) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementIpWhitelistEnabled: enabled, saveError: null } })
      }
    },

    onManagementIpWhitelistChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, managementIpWhitelist: value, saveError: null } })
      }
    },

    onOtpRetryAfterSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, otpRetryAfterSeconds: value, saveError: null } })
      }
    },

    onOtpNumberOfSymbolsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, otpNumberOfSymbols: value, saveError: null } })
      }
    },

    onOtpExpirationSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, otpExpirationSeconds: value, saveError: null } })
      }
    },

    onMaxRequestsPerPeriodChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, maxRequestsPerPeriod: value, saveError: null } })
      }
    },

    onRateLimitPeriodSecondsChanged: (value: string) => {
      const current = get().screenState
      if (current.status === 'content') {
        set({ screenState: { ...current, rateLimitPeriodSeconds: value, saveError: null } })
      }
    },

    onSaveClick: async () => {
      const current = get().screenState
      if (current.status !== 'content' || current.isSaving) {
        return
      }

      set({ screenState: { ...current, isSaving: true, saveError: null } })

      const commonPasses = new Set(
        current.commonPasswords
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )

      const settings: ManagementSecuritySettings = {
        recentAuthenticationValiditySecondsForOpenUser: parseIntegerOrDefault(
          current.recentAuthenticationValiditySecondsForOpenUser,
          300
        ),
        recentAuthenticationValiditySecondsForManagementUser: parseIntegerOrDefault(
          current.recentAuthenticationValiditySecondsForManagementUser,
          300
        ),
        passwordPolicy: {
          minLength: parseIntegerOrDefault(current.passwordMinLength, 8),
          requireLetter: current.passwordRequireLetter,
          requireUpperCase: current.passwordRequireUpperCase,
          requireLowerCase: current.passwordRequireLowerCase,
          requireDigit: current.passwordRequireDigit,
          requireSpecialChar: current.passwordRequireSpecialChar,
          commonPasswords: Array.from(commonPasses)
        },
        otpConfirmation: {
          retryAfterSeconds: parseIntegerOrDefault(current.otpRetryAfterSeconds, 60),
          numberOfSymbols: parseIntegerOrDefault(current.otpNumberOfSymbols, 6),
          expirationSeconds: parseIntegerOrDefault(current.otpExpirationSeconds, 300)
        },
        accountLockoutPolicy: {
          maxFailedPasswordAttempts: parseIntegerOrDefault(current.accountLockoutMaxFailedPasswordAttempts, 5),
          maxFailedOtpAttempts: parseIntegerOrDefault(current.accountLockoutMaxFailedOtpAttempts, 5),
          maxFailedTotpAttempts: parseIntegerOrDefault(current.accountLockoutMaxFailedTotpAttempts, 5),
          failedAttemptsWindowSeconds: parseIntegerOrDefault(current.accountLockoutFailedAttemptsWindowSeconds, 300),
          lockoutDurationSeconds: parseIntegerOrDefault(current.accountLockoutDurationSeconds, 300),
          indefiniteLockoutThreshold: parseIntegerOrDefault(current.accountLockoutIndefiniteLockoutThreshold, 3),
          isSelfServiceUnlockEnabled: current.accountLockoutIsSelfServiceUnlockEnabled
        },
        accountLockoutCheckIntervalSeconds: parseIntegerOrDefault(current.accountLockoutCheckIntervalSeconds, 60),
        openIpRestrictionPolicy: {
          isBlacklistEnabled: current.openIpBlacklistEnabled,
          blacklist: current.openIpBlacklist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          isWhitelistEnabled: current.openIpWhitelistEnabled,
          whitelist: current.openIpWhitelist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        },
        managementIpRestrictionPolicy: {
          isBlacklistEnabled: current.managementIpBlacklistEnabled,
          blacklist: current.managementIpBlacklist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          isWhitelistEnabled: current.managementIpWhitelistEnabled,
          whitelist: current.managementIpWhitelist
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        },
        mfaTokenExpirationSeconds: parseIntegerOrDefault(current.mfaTokenExpirationSeconds, 180),
        maxRequestsPerPeriod: parseIntegerOrDefault(current.maxRequestsPerPeriod, 100),
        rateLimitPeriodSeconds: parseIntegerOrDefault(current.rateLimitPeriodSeconds, 60),
        refreshTokenRotationGracePeriodSeconds: parseIntegerOrDefault(current.refreshTokenRotationGracePeriodSeconds, 30)
      }

      const saveResult = await deps.saveRemoteSecuritySettingsUseCase.execute(settings)
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

      const result = await deps.resetRemoteSecuritySettingsUseCase.execute()
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

const EditSecuritySettingsContext = createContext<EditSecuritySettingsStore | null>(null)

export interface EditSecuritySettingsProviderProps {
  dependencies: EditSecuritySettingsStoreDependencies
  initialState?: EditSecuritySettingsScreenState
  children: React.ReactNode
}

export const EditSecuritySettingsProvider: React.FC<EditSecuritySettingsProviderProps> = ({
  dependencies,
  initialState,
  children
}) => {
  const [store] = useState(() => createEditSecuritySettingsStore(dependencies, initialState))

  return (
    <EditSecuritySettingsContext.Provider value={store}>
      {children}
    </EditSecuritySettingsContext.Provider>
  )
}

export const useEditSecuritySettingsStore = <T,>(
  selector: (state: EditSecuritySettingsStoreState) => T
): T => {
  const store = useContext(EditSecuritySettingsContext)
  if (!store) {
    throw new Error('useEditSecuritySettingsStore must be used within EditSecuritySettingsProvider')
  }
  return useStore(store, selector)
}

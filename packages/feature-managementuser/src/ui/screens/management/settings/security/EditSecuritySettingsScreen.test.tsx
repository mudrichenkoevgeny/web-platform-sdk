import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditSecuritySettingsScreen } from '@/ui/screens/management/settings/security/EditSecuritySettingsScreen'
import type { EditSecuritySettingsStoreDependencies } from '@/ui/screens/management/settings/security/EditSecuritySettingsStore'
import { enManagementUserStrings } from '@/locales/index'

describe('EditSecuritySettingsScreen', () => {
  const createMockDeps = (): EditSecuritySettingsStoreDependencies => ({
    getManagementSecuritySettingsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          recentAuthenticationValiditySecondsForOpenUser: 300,
          recentAuthenticationValiditySecondsForManagementUser: 300,
          mfaTokenExpirationSeconds: 300,
          passwordPolicy: {
            minLength: 8,
            requireLetter: true,
            requireUpperCase: false,
            requireLowerCase: false,
            requireDigit: true,
            requireSpecialChar: false,
            commonPasswords: new Set()
          },
          otpConfirmation: {
            retryAfterSeconds: 60,
            numberOfSymbols: 6,
            expirationSeconds: 300
          },
          accountLockoutPolicy: {
            maxFailedPasswordAttempts: 5,
            maxFailedOtpAttempts: 5,
            maxFailedTotpAttempts: 5,
            failedAttemptsWindowSeconds: 300,
            lockoutDurationSeconds: 300,
            indefiniteLockoutThreshold: 3,
            isSelfServiceUnlockEnabled: true
          },
          accountLockoutCheckIntervalSeconds: 60,
          openIpRestrictionPolicy: {
            isBlacklistEnabled: false,
            blacklist: [],
            isWhitelistEnabled: false,
            whitelist: []
          },
          managementIpRestrictionPolicy: {
            isBlacklistEnabled: false,
            blacklist: [],
            isWhitelistEnabled: false,
            whitelist: []
          },
          maxRequestsPerPeriod: 100,
          rateLimitPeriodSeconds: 60,
          refreshTokenRotationGracePeriodSeconds: 30
        })
      )
    } as any,
    saveRemoteSecuritySettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    resetRemoteSecuritySettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onBack: vi.fn()
  })

  it('renders security settings form and handles save', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditSecuritySettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_security_settings_title)).toBeDefined()

    const saveButton = screen.getByRole('button', { name: enManagementUserStrings.save })
    await user.click(saveButton)

    expect(deps.saveRemoteSecuritySettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('handles reset to defaults', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditSecuritySettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_security_settings_title)).toBeDefined()

    const resetButton = screen.getByRole('button', { name: enManagementUserStrings.reset_to_defaults })
    await user.click(resetButton)

    expect(deps.resetRemoteSecuritySettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

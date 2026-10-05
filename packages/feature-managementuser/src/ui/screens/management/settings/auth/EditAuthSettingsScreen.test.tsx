import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditAuthSettingsScreen } from '@/ui/screens/management/settings/auth/EditAuthSettingsScreen'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'
import { enManagementUserStrings } from '@/locales/index'

describe('EditAuthSettingsScreen', () => {
  const createMockDeps = (): EditAuthSettingsStoreDependencies => ({
    getManagementAuthSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          availableAuthProviders: {
            primary: ['EMAIL'],
            secondary: ['GOOGLE']
          },
          maxTotalIdentifiers: 10,
          maxEmailIdentifiers: 5,
          maxPhoneIdentifiers: 5,
          maxIdentifiersPerExternalProvider: 2,
          maxActiveSessionsForOpenUser: 3,
          maxActiveSessionsForManagementUser: 5,
          accessTokenExpirationSeconds: 3600,
          refreshTokenExpirationSeconds: 86400,
          accountDeletionGracePeriodSeconds: 604800,
          accountDeletionCheckIntervalSeconds: 86400,
          isRegistrationEnabled: true,
          openEmailRestrictionPolicy: {
            isBlacklistEnabled: false,
            blacklist: [],
            isWhitelistEnabled: false,
            whitelist: []
          },
          managementEmailRestrictionPolicy: {
            isBlacklistEnabled: false,
            blacklist: [],
            isWhitelistEnabled: false,
            whitelist: []
          }
        })
      )
    } as any,
    saveRemoteAuthSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    resetRemoteAuthSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onBack: vi.fn()
  })

  it('renders auth settings form and handles save', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditAuthSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_auth_settings_title)).toBeDefined()

    const saveButton = screen.getByRole('button', { name: enManagementUserStrings.save })
    await user.click(saveButton)

    expect(deps.saveRemoteAuthSettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('handles reset to defaults', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditAuthSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_auth_settings_title)).toBeDefined()

    const resetButton = screen.getByRole('button', { name: enManagementUserStrings.reset_to_defaults })
    await user.click(resetButton)

    expect(deps.resetRemoteAuthSettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditGlobalSettingsScreen } from '@/ui/screens/management/settings/global/EditGlobalSettingsScreen'
import type { EditGlobalSettingsStoreDependencies } from '@/ui/screens/management/settings/global/EditGlobalSettingsStore'
import { enManagementUserStrings } from '@/locales/index'

describe('EditGlobalSettingsScreen', () => {
  const createMockDeps = (): EditGlobalSettingsStoreDependencies => ({
    getManagementGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          privacyPolicyUrl: 'https://example.com/privacy',
          termsOfServiceUrl: 'https://example.com/terms',
          contactSupportEmail: 'support@example.com',
          minSupportedAppVersions: {
            ANDROID: '1.0.0'
          },
          isTracingEnabled: true,
          isMetricsEnabled: true,
          isVerboseLoggingEnabled: false
        })
      )
    } as any,
    saveRemoteGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    resetRemoteGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onBack: vi.fn()
  })

  it('renders global settings form and handles save', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditGlobalSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_global_settings_title)).toBeDefined()

    const saveButton = screen.getByRole('button', { name: enManagementUserStrings.save })
    await user.click(saveButton)

    expect(deps.saveRemoteGlobalSettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('handles reset to defaults', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditGlobalSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.edit_global_settings_title)).toBeDefined()

    const resetButton = screen.getByRole('button', { name: enManagementUserStrings.reset_to_defaults })
    await user.click(resetButton)

    expect(deps.resetRemoteGlobalSettingsUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

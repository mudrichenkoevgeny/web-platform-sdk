import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings, storageStrings } from '@mudrichenkoevgeny/shared-foundation'
import { EditStorageSettingsScreen, EditStorageSettingsTestTags } from './EditStorageSettingsScreen'
import type { EditStorageSettingsStoreDependencies } from './edit-storage-settings-store'

describe('EditStorageSettingsScreen', () => {
  const createMockDeps = (): EditStorageSettingsStoreDependencies => ({
    getManagementStorageSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestManagementStorageSettings()))
    },
    updateManagementStorageSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestManagementStorageSettings()))
    },
    resetManagementStorageSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestManagementStorageSettings()))
    },
    onBack: vi.fn()
  })

  it('renders storage settings form and title', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <EditStorageSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(EditStorageSettingsTestTags.TITLE)).toBeInTheDocument()
    expect(screen.getByText(storageStrings.ui.storageSettingsTitle)).toBeInTheDocument()
    expect(screen.getByTestId(EditStorageSettingsTestTags.SAVE_BUTTON)).toBeInTheDocument()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <EditStorageSettingsScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backBtn = await screen.findByTestId(EditStorageSettingsTestTags.BACK_BUTTON)
    await user.click(backBtn)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

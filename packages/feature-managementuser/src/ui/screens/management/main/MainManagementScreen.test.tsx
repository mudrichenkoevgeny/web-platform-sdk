import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { MainManagementScreen } from '@/ui/screens/management/main/MainManagementScreen'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

const userStrings = new UserModuleStrings()

describe('MainManagementScreen', () => {
  const createMockDeps = (): MainManagementStoreDependencies => ({
    onSettingsClick: vi.fn(),
    onGlobalUserListClick: vi.fn(),
    onAuditEventListClick: vi.fn(),
    onGlobalSessionListClick: vi.fn(),
    onGlobalIdentifierListClick: vi.fn()
  })

  it('renders main management screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <MainManagementScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(userStrings.ui.managementSettingsTitle)).toBeDefined()
  })
})

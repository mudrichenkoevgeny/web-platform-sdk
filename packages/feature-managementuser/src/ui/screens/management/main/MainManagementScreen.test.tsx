import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { MainManagementScreen } from '@/ui/screens/management/main/MainManagementScreen'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'
import { enManagementUserStrings } from '@/locales/index'

describe('MainManagementScreen', () => {
  const createMockDeps = (): MainManagementStoreDependencies => ({
    onEditAuthSettingsClick: vi.fn(),
    onEditGlobalSettingsClick: vi.fn(),
    onEditSecuritySettingsClick: vi.fn(),
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

    expect(await screen.findByText(enManagementUserStrings.management_settings_title)).toBeDefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementRootScreen } from '@/ui/screens/management/root/ManagementRootScreen'
import type { ManagementRootStoreDependencies } from '@/ui/screens/management/root/ManagementRootStore'
import { enManagementUserStrings } from '@/locales/index'

describe('ManagementRootScreen', () => {
  const createMockDeps = (): ManagementRootStoreDependencies => ({
    getManagementAuthSettingsUseCase: { execute: vi.fn() } as any,
    saveRemoteAuthSettingsUseCase: { execute: vi.fn() } as any,
    resetRemoteAuthSettingsUseCase: { execute: vi.fn() } as any,
    getManagementGlobalSettingsUseCase: { execute: vi.fn() } as any,
    saveRemoteGlobalSettingsUseCase: { execute: vi.fn() } as any,
    resetRemoteGlobalSettingsUseCase: { execute: vi.fn() } as any,
    getManagementSecuritySettingsUseCase: { execute: vi.fn() } as any,
    saveRemoteSecuritySettingsUseCase: { execute: vi.fn() } as any,
    resetRemoteSecuritySettingsUseCase: { execute: vi.fn() } as any,
    getUsersUseCase: { execute: vi.fn() } as any,
    getUserUseCase: { execute: vi.fn() } as any,
    createUserUseCase: { execute: vi.fn() } as any,
    updateUserUseCase: { execute: vi.fn() } as any,
    deleteUserUseCase: { execute: vi.fn() } as any,
    managementGetSessionsUseCase: { execute: vi.fn() } as any,
    managementGetIdentifiersUseCase: { execute: vi.fn() } as any,
    managementDisableTotpUseCase: { execute: vi.fn() } as any,
    managementDeleteSessionUseCase: { execute: vi.fn() } as any,
    managementDeleteAllUserSessionsUseCase: { execute: vi.fn() } as any,
    managementDeleteIdentifierUseCase: { execute: vi.fn() } as any,
    managementDeleteIdentifierPasswordUseCase: { execute: vi.fn() } as any,
    getAuditEventsUseCase: { execute: vi.fn() } as any,
    getAuditEventUseCase: { execute: vi.fn() } as any
  })

  it('renders management root screen starting at main menu', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <ManagementRootScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.management_settings_title)).toBeDefined()
  })
})

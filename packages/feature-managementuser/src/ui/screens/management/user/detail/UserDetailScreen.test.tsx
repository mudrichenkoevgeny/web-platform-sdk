import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserDetailScreen } from '@/ui/screens/management/user/detail/UserDetailScreen'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserDetailScreen', () => {
  const createMockDeps = (): UserDetailStoreDependencies => ({
    userId: 'usr_123' as any,
    getUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    } as any,
    updateUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(userDetailsMock()))
    } as any,
    deleteUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    managementDisableTotpUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onNavigateToSessions: vi.fn(),
    onNavigateToIdentifiers: vi.fn(),
    onBack: vi.fn()
  })

  it('renders user detail screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.user_details_title)).toBeDefined()
  })
})

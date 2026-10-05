import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalUserListScreen } from '@/ui/screens/management/user/global-list/GlobalUserListScreen'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('GlobalUserListScreen', () => {
  const createMockDeps = (): GlobalUserListStoreDependencies => ({
    getUsersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userDetailsMock()],
          pageNumber: 1,
          totalPages: 1,
          totalCount: 1
        })
      )
    } as any,
    onNavigateToUserDetail: vi.fn(),
    onNavigateToCreateUser: vi.fn(),
    onBack: vi.fn()
  })

  it('renders global user list screen', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.users_management_title)).toBeDefined()
  })
})

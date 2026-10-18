import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { GlobalUserListScreen, GlobalUserListTestTags } from '@/ui/screens/management/user/global-list/GlobalUserListScreen'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/global-list/GlobalUserListStore'

const userStrings = new UserModuleStrings()

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
    } as unknown as GlobalUserListStoreDependencies['getUsersUseCase'],
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

    expect(await screen.findByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.usersManagementTitle)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.CREATE_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalUserListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes getUsersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalUserListTestTags.TITLE)).toBeDefined()
    expect(deps.getUsersUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('navigates to user detail when clicking own user card', async () => {
    const mockUser = userDetailsMock()
    const deps = createMockDeps()
    deps.currentUserId = mockUser.id

    render(
      <ComponentTestHarness>
        <GlobalUserListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const userCard = await screen.findByTestId(`UserItem_${mockUser.id}`)
    userCard.click()

    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(mockUser.id)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ListingDefaultValues, toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserSessionListScreen, UserSessionListTestTags } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

describe('UserSessionListScreen', () => {
  const createMockDeps = (): UserSessionListStoreDependencies => ({
    userId: toUserIdOrThrow('usr_123'),
    managementGetSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userSessionMock()],
          pageNumber: ListingDefaultValues.Pagination.PAGE_NUMBER,
          pageSize: ListingDefaultValues.Pagination.PAGE_SIZE,
          totalItems: 1,
          totalPages: 1
        })
      )
    },
    managementDeleteSessionUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    },
    managementDeleteAllUserSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    },
    onNavigateToSessionDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders user sessions list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserSessionListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.userSessions)).toBeDefined()
    expect(screen.getByTestId(UserSessionListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserSessionListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserSessionListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })
})

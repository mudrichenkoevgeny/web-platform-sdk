import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { UserSessionListScreen, UserSessionListTestTags } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserSessionListScreen', () => {
  const createMockDeps = (): UserSessionListStoreDependencies => ({
    userId: 'usr_123' as unknown as UserId,
    managementGetSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userSessionMock()],
          pageNumber: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1
        })
      )
    } as unknown as UserSessionListStoreDependencies['managementGetSessionsUseCase'],
    managementDeleteSessionUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as unknown as UserSessionListStoreDependencies['managementDeleteSessionUseCase'],
    managementDeleteAllUserSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as unknown as UserSessionListStoreDependencies['managementDeleteAllUserSessionsUseCase'],
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
    expect(screen.getByText(enManagementUserStrings.user_sessions)).toBeDefined()
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

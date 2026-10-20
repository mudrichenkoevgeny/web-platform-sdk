import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSessionPrivateList, TEST_USER_ID, toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserSessionListScreen, UserSessionListTestTags } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import { userSessionListDependenciesMock } from '@/mock/ui/screen/management/session/user-list/user-session-list-component-mock'
import { ManagementGetSessionsUseCaseMock } from '@/mock/usecase/session/management-get-sessions-use-case-mock'
import { ManagementDeleteSessionUseCaseMock } from '@/mock/usecase/session/management-delete-session-use-case-mock'
import { ManagementDeleteAllUserSessionsUseCaseMock } from '@/mock/usecase/session/management-delete-all-user-sessions-use-case-mock'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

describe('UserSessionListScreen', () => {
  const createMockDeps = (): UserSessionListStoreDependencies => {
    const managementGetSessionsUseCase = new ManagementGetSessionsUseCaseMock()
    managementGetSessionsUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserSessionPrivateList(1)
        })
      )
    vi.spyOn(managementGetSessionsUseCase, 'execute').mockImplementation(managementGetSessionsUseCase.execute.bind(managementGetSessionsUseCase))

    const managementDeleteSessionUseCase = new ManagementDeleteSessionUseCaseMock()
    managementDeleteSessionUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDeleteSessionUseCase, 'execute').mockImplementation(managementDeleteSessionUseCase.execute.bind(managementDeleteSessionUseCase))

    const managementDeleteAllUserSessionsUseCase = new ManagementDeleteAllUserSessionsUseCaseMock()
    managementDeleteAllUserSessionsUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDeleteAllUserSessionsUseCase, 'execute').mockImplementation(managementDeleteAllUserSessionsUseCase.execute.bind(managementDeleteAllUserSessionsUseCase))

    return userSessionListDependenciesMock({
      userId: toUserIdOrThrow(TEST_USER_ID),
      managementGetSessionsUseCase,
      managementDeleteSessionUseCase,
      managementDeleteAllUserSessionsUseCase,
      onNavigateToSessionDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

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

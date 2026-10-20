import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserSessionPrivateList, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { GlobalSessionListScreen, GlobalSessionListTestTags } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import { globalSessionListDependenciesMock } from '@/mock/ui/screen/management/session/global-list/global-session-list-component-mock'
import { ManagementGetSessionsUseCaseMock } from '@/mock/usecase/session/management-get-sessions-use-case-mock'
import { ManagementDeleteSessionUseCaseMock } from '@/mock/usecase/session/management-delete-session-use-case-mock'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

describe('GlobalSessionListScreen', () => {
  const createMockDeps = (): GlobalSessionListStoreDependencies => {
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

    return globalSessionListDependenciesMock({
      managementGetSessionsUseCase,
      managementDeleteSessionUseCase,
      onNavigateToSessionDetail: vi.fn(),
      onNavigateToUserDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders global sessions list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalSessionListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.sessions)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalSessionListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalSessionListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('hides revoke button for session matching currentSessionId', async () => {
    const sessions = createTestUserSessionPrivateList(1)
    const mockSession = sessions.at(0)
    if (!mockSession) throw new Error('Mock session required')

    const deps = createMockDeps()
    deps.currentSessionId = mockSession.id

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const sessionCard = await screen.findByTestId(`SessionItem_${mockSession.id}`)
    expect(sessionCard).toBeDefined()
    expect(screen.queryByRole('button', { name: userStrings.ui.sessionRevoke })).toBeNull()
  })
})

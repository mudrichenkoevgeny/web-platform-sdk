import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ListingDefaultValues, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { GlobalSessionListScreen, GlobalSessionListTestTags } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'

describe('GlobalSessionListScreen', () => {
  const createMockDeps = (): GlobalSessionListStoreDependencies => ({
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
    onNavigateToSessionDetail: vi.fn(),
    onNavigateToUserDetail: vi.fn(),
    onBack: vi.fn()
  })

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
    const mockSession = userSessionMock()
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

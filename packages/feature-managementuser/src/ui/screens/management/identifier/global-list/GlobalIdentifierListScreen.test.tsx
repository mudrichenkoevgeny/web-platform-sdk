import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ListingDefaultValues, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { GlobalIdentifierListScreen, GlobalIdentifierListTestTags } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

describe('GlobalIdentifierListScreen', () => {
  const createMockDeps = (): GlobalIdentifierListStoreDependencies => ({
    managementGetIdentifiersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userIdentifierMock()],
          pageNumber: ListingDefaultValues.Pagination.PAGE_NUMBER,
          pageSize: ListingDefaultValues.Pagination.PAGE_SIZE,
          totalItems: 1,
          totalPages: 1
        })
      )
    },
    managementDeleteIdentifierUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    },
    onNavigateToIdentifierDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders global identifiers list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalIdentifierListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.userIdentifiers)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetIdentifiersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(GlobalIdentifierListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetIdentifiersUseCase.execute).toHaveBeenCalledTimes(1)
  })
})

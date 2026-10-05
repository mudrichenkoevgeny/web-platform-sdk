import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalIdentifierListScreen, GlobalIdentifierListTestTags } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('GlobalIdentifierListScreen', () => {
  const createMockDeps = (): GlobalIdentifierListStoreDependencies => ({
    managementGetIdentifiersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userIdentifierMock()],
          pageNumber: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1
        })
      )
    } as unknown as GlobalIdentifierListStoreDependencies['managementGetIdentifiersUseCase'],
    managementDeleteIdentifierUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as unknown as GlobalIdentifierListStoreDependencies['managementDeleteIdentifierUseCase'],
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
    expect(screen.getByText(enManagementUserStrings.user_identifiers)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.FILTER_BUTTON)).toBeDefined()
    expect(screen.getByTestId(GlobalIdentifierListTestTags.REFRESH_BUTTON)).toBeDefined()
  })
})

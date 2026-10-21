import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserIdentifierPrivateList, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { GlobalIdentifierListScreen, GlobalIdentifierListTestTags } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import { globalIdentifierListDependenciesMock } from '@/mock/ui/screen/management/identifier/global-list/global-identifier-list-component-mock'
import { ManagementGetIdentifiersUseCaseMock } from '@/mock/usecase/identifier/management-get-identifiers-use-case-mock'
import { ManagementDeleteIdentifierUseCaseMock } from '@/mock/usecase/identifier/management-delete-identifier-use-case-mock'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListStore'

describe('GlobalIdentifierListScreen', () => {
  const createMockDeps = (): GlobalIdentifierListStoreDependencies => {
    const managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCaseMock()
    managementGetIdentifiersUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserIdentifierPrivateList(1)
        })
      )
    vi.spyOn(managementGetIdentifiersUseCase, 'execute')

    const managementDeleteIdentifierUseCase = new ManagementDeleteIdentifierUseCaseMock()
    managementDeleteIdentifierUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(managementDeleteIdentifierUseCase, 'execute')

    return globalIdentifierListDependenciesMock({
      managementGetIdentifiersUseCase,
      managementDeleteIdentifierUseCase,
      onNavigateToIdentifierDetail: vi.fn(),
      onBack: vi.fn()
    })
  }

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

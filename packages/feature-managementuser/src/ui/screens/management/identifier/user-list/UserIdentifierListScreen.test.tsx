import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestUserIdentifierPrivateList, TEST_USER_ID, toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserIdentifierListScreen, UserIdentifierListTestTags } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import { userIdentifierListDependenciesMock } from '@/mock/ui/screen/management/identifier/user-list/user-identifier-list-component-mock'
import { ManagementGetIdentifiersUseCaseMock } from '@/mock/usecase/identifier/management-get-identifiers-use-case-mock'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'

describe('UserIdentifierListScreen', () => {
  const createMockDeps = (): UserIdentifierListStoreDependencies => {
    const managementGetIdentifiersUseCase = new ManagementGetIdentifiersUseCaseMock()
    managementGetIdentifiersUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: createTestUserIdentifierPrivateList(1)
        })
      )
    vi.spyOn(managementGetIdentifiersUseCase, 'execute')

    return userIdentifierListDependenciesMock({
      userId: toUserIdOrThrow(TEST_USER_ID),
      managementGetIdentifiersUseCase,
      onIdentifierSelect: vi.fn(),
      onBack: vi.fn()
    })
  }

  it('renders user identifiers list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserIdentifierListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(userStrings.ui.userIdentifiers)).toBeDefined()
    expect(screen.getByTestId(UserIdentifierListTestTags.BACK_BUTTON)).toBeDefined()
    expect(screen.getByTestId(UserIdentifierListTestTags.REFRESH_BUTTON)).toBeDefined()
  })

  it('executes managementGetIdentifiersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserIdentifierListTestTags.TITLE)).toBeDefined()
    expect(deps.managementGetIdentifiersUseCase.execute).toHaveBeenCalledTimes(1)
  })
})

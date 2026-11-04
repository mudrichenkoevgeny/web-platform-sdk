import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTestPagedResult, createTestUserIdentifierSummaryList, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierListScreen, IdentifierListTestTags } from './IdentifierListScreen'
import { createSelfIdentifierListDataSource } from './identifier-list-data-source'
import { GetUserIdentifiersUseCaseMock } from '@/mock/usecase/identifier/get-user-identifiers-use-case-mock'
import { GetAvailableUserAuthProvidersUseCaseMock } from '@/mock/usecase/auth/settings/get-available-user-auth-providers-use-case-mock'
import type { IdentifierListStoreDependencies } from './identifier-list-store'

describe('IdentifierListScreen', () => {
  const identifiers = createTestUserIdentifierSummaryList(2, (index) => ({
    displayName: `user${index + 1}@example.com`
  }))

  const createMockDeps = (): IdentifierListStoreDependencies => {
    const getUserIdentifiersUseCase = new GetUserIdentifiersUseCaseMock()
    getUserIdentifiersUseCase.resultProvider = async () =>
      appResultSuccess(
        createTestPagedResult({
          items: identifiers
        })
      )
    vi.spyOn(getUserIdentifiersUseCase, 'execute')

    const getAvailableUserAuthProvidersUseCase = new GetAvailableUserAuthProvidersUseCaseMock()
    getAvailableUserAuthProvidersUseCase.resultProvider = async () =>
      appResultSuccess({
        primary: [UserAuthProvider.EMAIL],
        secondary: [UserAuthProvider.GOOGLE]
      })
    vi.spyOn(getAvailableUserAuthProvidersUseCase, 'execute')

    return {
      dataSource: createSelfIdentifierListDataSource({
        getIdentifiersUseCase: getUserIdentifiersUseCase,
        getAvailableUserAuthProvidersUseCase
      }),
      onNavigateToIdentifierDetail: vi.fn(),
      onBack: vi.fn()
    }
  }

  it('renders identifiers list and add identifier button', async () => {
    const deps = createMockDeps()
    const firstItem = identifiers.at(0)
    const secondItem = identifiers.at(1)
    if (!firstItem || !secondItem) throw new Error('Identifiers required')

    render(
      <ComponentTestHarness>
        <IdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(firstItem.displayName)).not.toBeNull()
    expect(screen.getByText(secondItem.displayName)).not.toBeNull()
    expect(screen.getByTestId(IdentifierListTestTags.ADD_IDENTIFIER_BUTTON)).not.toBeNull()
  })

  it('opens add identifier modal dialog when add button is clicked', async () => {
    const deps = createMockDeps()
    const firstItem = identifiers.at(0)
    if (!firstItem) throw new Error('First item required')
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(firstItem.displayName)

    const addBtn = screen.getByTestId(IdentifierListTestTags.ADD_IDENTIFIER_BUTTON)
    await user.click(addBtn)

    expect(await screen.findByTestId(IdentifierListTestTags.ADD_IDENTIFIER_DIALOG_TITLE)).not.toBeNull()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const firstItem = identifiers.at(0)
    if (!firstItem) throw new Error('First item required')
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <IdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(firstItem.displayName)

    await user.click(screen.getByTestId(IdentifierListTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('executes getIdentifiersUseCase on initial render', async () => {
    const deps = createMockDeps()
    const firstItem = identifiers.at(0)
    if (!firstItem) throw new Error('First item required')

    render(
      <ComponentTestHarness>
        <IdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText(firstItem.displayName)
  })
})

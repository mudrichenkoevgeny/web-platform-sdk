import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppType, toUserIdentifierIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserIdentifierSummary } from '@mudrichenkoevgeny/shared-foundation'
import { SelfIdentifierListScreen, IdentifierListTestTags } from '@/ui/screens/profile/identifier/list/SelfIdentifierListScreen'
import type { SelfIdentifierListStoreDependencies } from '@/ui/screens/profile/identifier/list/self-identifier-list-store'

describe('SelfIdentifierListScreen', () => {
  const mockIdentifier1: UserIdentifierSummary = {
    id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
    userAuthProvider: UserAuthProvider.EMAIL,
    identifier: 'user1@example.com',
    displayName: 'user1@example.com'
  }

  const mockIdentifier2: UserIdentifierSummary = {
    ...mockIdentifier1,
    id: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440002'),
    identifier: 'user2@example.com',
    displayName: 'user2@example.com'
  }

  const createMockDeps = (): SelfIdentifierListStoreDependencies => ({
    appType: AppType.CLIENT,
    getUserIdentifiersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [mockIdentifier1, mockIdentifier2],
          totalCount: 2,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1
        })
      )
    } as unknown as SelfIdentifierListStoreDependencies['getUserIdentifiersUseCase'],
    getAvailableUserAuthProvidersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          primary: [UserAuthProvider.EMAIL],
          secondary: [UserAuthProvider.GOOGLE]
        })
      )
    } as unknown as SelfIdentifierListStoreDependencies['getAvailableUserAuthProvidersUseCase'],
    onIdentifierSelect: vi.fn(),
    onBack: vi.fn()
  })

  it('renders identifiers list and add identifier button', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText('user1@example.com')).not.toBeNull()
    expect(screen.getByText('user2@example.com')).not.toBeNull()
    expect(screen.getByTestId(IdentifierListTestTags.ADD_IDENTIFIER_BUTTON)).not.toBeNull()
  })

  it('opens add identifier modal dialog when add button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')

    const addBtn = screen.getByTestId(IdentifierListTestTags.ADD_IDENTIFIER_BUTTON)
    await user.click(addBtn)

    expect(deps.getAvailableUserAuthProvidersUseCase?.execute).toHaveBeenCalledTimes(1)
    expect(await screen.findByTestId(IdentifierListTestTags.ADD_IDENTIFIER_DIALOG_TITLE)).not.toBeNull()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')

    await user.click(screen.getByTestId(IdentifierListTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('executes getUserIdentifiersUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')
    expect(deps.getUserIdentifiersUseCase.execute).toHaveBeenCalledTimes(1)
  })
})

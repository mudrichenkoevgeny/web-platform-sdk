import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { UserIdentifierListScreen, UserIdentifierListTestTags } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserIdentifierListScreen', () => {
  const createMockDeps = (): UserIdentifierListStoreDependencies => ({
    userId: 'usr_123' as unknown as UserId,
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
    } as unknown as UserIdentifierListStoreDependencies['managementGetIdentifiersUseCase'],
    onIdentifierSelect: vi.fn(),
    onBack: vi.fn()
  })

  it('renders user identifiers list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(UserIdentifierListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(enManagementUserStrings.user_identifiers)).toBeDefined()
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

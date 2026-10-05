import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserIdentifierListScreen } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import type { UserIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/user-list/UserIdentifierListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserIdentifierListScreen', () => {
  const createMockDeps = (): UserIdentifierListStoreDependencies => ({
    userId: 'usr_123' as any,
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
    } as any,
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

    expect(await screen.findByText(enManagementUserStrings.user_identifiers)).toBeDefined()
  })
})

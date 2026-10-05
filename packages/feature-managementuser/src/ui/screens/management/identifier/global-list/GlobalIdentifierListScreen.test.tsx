import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userIdentifierMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalIdentifierListScreen } from '@/ui/screens/management/identifier/globallist/GlobalIdentifierListScreen'
import type { GlobalIdentifierListStoreDependencies } from '@/ui/screens/management/identifier/globallist/GlobalIdentifierListStore'
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
    } as any,
    onIdentifierSelect: vi.fn(),
    onBack: vi.fn()
  })

  it('renders global identifiers list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalIdentifierListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.user_identifiers)).toBeDefined()
  })
})

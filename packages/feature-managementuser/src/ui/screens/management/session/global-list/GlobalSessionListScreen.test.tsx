import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalSessionListScreen } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import type { GlobalSessionListStoreDependencies } from '@/ui/screens/management/session/global-list/GlobalSessionListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('GlobalSessionListScreen', () => {
  const createMockDeps = (): GlobalSessionListStoreDependencies => ({
    managementGetSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [userSessionMock()],
          pageNumber: 1,
          pageSize: 20,
          totalItems: 1,
          totalPages: 1
        })
      )
    } as any,
    managementDeleteSessionUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onNavigateToSessionDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders global sessions list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <GlobalSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.sessions)).toBeDefined()
  })
})

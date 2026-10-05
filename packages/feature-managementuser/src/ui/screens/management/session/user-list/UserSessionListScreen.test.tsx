import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserSessionListScreen } from '@/ui/screens/management/session/userlist/UserSessionListScreen'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/userlist/UserSessionListStore'
import { enManagementUserStrings } from '@/locales/index'

describe('UserSessionListScreen', () => {
  const createMockDeps = (): UserSessionListStoreDependencies => ({
    userId: 'usr_123' as any,
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
    managementDeleteAllUserSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    onNavigateToSessionDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders user sessions list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UserSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(enManagementUserStrings.user_sessions)).toBeDefined()
  })
})

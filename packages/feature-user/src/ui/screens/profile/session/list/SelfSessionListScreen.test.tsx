import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientType, toUserSessionIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import { SelfSessionListScreen, SelfSessionListTestTags } from '@/ui/screens/profile/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/profile/session/list/self-session-list-store'

describe('SelfSessionListScreen', () => {
  const session1: UserSessionSummary = {
    id: toUserSessionIdOrThrow('550e8400-e29b-41d4-a716-446655440001'),
    clientDeviceInfo: {
      clientType: ClientType.WEB,
      language: 'en',
      deviceId: null,
      deviceName: 'Chrome on Windows',
      appVersion: '1.0.0',
      operationSystemVersion: 'Windows'
    },
    identifierDisplayName: 'user1@example.com',
    identifierAuthProvider: UserAuthProvider.EMAIL,
    lastAccessedAt: 1690000000000,
    expiresAt: 1700000000000
  }

  const session2: UserSessionSummary = {
    ...session1,
    id: toUserSessionIdOrThrow('550e8400-e29b-41d4-a716-446655440002'),
    identifierDisplayName: 'user2@example.com'
  }

  const createMockDeps = (): SelfSessionListStoreDependencies => ({
    getSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [session1, session2],
          totalCount: 2,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1
        })
      )
    } as unknown as SelfSessionListStoreDependencies['getSessionsUseCase'],
    deleteSessionUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfSessionListStoreDependencies['deleteSessionUseCase'],
    deleteAllOtherSessionsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as SelfSessionListStoreDependencies['deleteAllOtherSessionsUseCase'],
    onNavigateToSessionDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders sessions list and revoke all others button when multiple sessions exist', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText('user1@example.com')).not.toBeNull()
    expect(screen.getByText('user2@example.com')).not.toBeNull()
    expect(screen.getByTestId(SelfSessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)).not.toBeNull()
  })

  it('executes deleteAllOtherSessionsUseCase when revoke all others button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')

    const revokeAllBtn = screen.getByTestId(SelfSessionListTestTags.REVOKE_ALL_OTHERS_BUTTON)
    await user.click(revokeAllBtn)

    expect(deps.deleteAllOtherSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')

    await user.click(screen.getByTestId(SelfSessionListTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('executes getSessionsUseCase only once on initial render and prevents duplicate calls', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <SelfSessionListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('user1@example.com')
    expect(deps.getSessionsUseCase.execute).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientType, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SelfSessionListScreen, SelfSessionListTestTags } from '@/ui/screens/profile/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/profile/session/list/SelfSessionListStore'

describe('SelfSessionListScreen', () => {
  const session1: UserSession = {
    id: toUserSessionIdOrThrow('550e8400-e29b-41d4-a716-446655440001'),
    userId: toUserIdOrThrow('usr_123'),
    userRole: UserRole.USER,
    identifier: 'user1@example.com',
    identifierId: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440001'),
    identifierDisplayName: 'user1@example.com',
    identifierAuthProvider: UserAuthProvider.EMAIL,
    deviceInfo: {
      clientType: ClientType.WEB,
      language: 'en',
      deviceId: null,
      deviceName: 'Chrome on Windows',
      appVersion: '1.0.0',
      operationSystemVersion: 'Windows'
    },
    userAgent: 'Mozilla/5.0',
    ipAddress: '192.168.1.1',
    expiresAt: 1700000000000,
    lastAccessedAt: 1690000000000,
    lastReauthenticatedAt: 1690000000000,
    isSensitiveValuesMasked: false,
    createdAt: 1680000000000,
    updatedAt: null
  }

  const session2: UserSession = {
    ...session1,
    id: toUserSessionIdOrThrow('550e8400-e29b-41d4-a716-446655440002'),
    identifierDisplayName: 'user2@example.com'
  }

  const createMockDeps = (): SelfSessionListStoreDependencies => ({
    getSessionsUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: [session1, session2],
          totalCount: 2,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1
        })
      )
    } as any,
    deleteSessionUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    deleteAllOtherSessionsUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
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

    expect(deps.deleteAllOtherSessionsUseCase.invoke).toHaveBeenCalledTimes(1)
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
})

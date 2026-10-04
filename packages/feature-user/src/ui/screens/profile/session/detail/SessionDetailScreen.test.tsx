import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientType, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SessionDetailScreen, SessionDetailTestTags } from '@/ui/screens/profile/session/detail/SessionDetailScreen'
import type { SessionDetailStoreDependencies } from '@/ui/screens/profile/session/detail/SessionDetailStore'
import { enUserStrings } from '@/locales/index'

describe('SessionDetailScreen', () => {
  const mockSession: UserSession = {
    id: toUserSessionIdOrThrow('550e8400-e29b-41d4-a716-446655440000'),
    userId: toUserIdOrThrow('usr_12345'),
    userRole: UserRole.USER,
    identifier: 'user@example.com',
    identifierId: toUserIdentifierIdOrThrow('660e8400-e29b-41d4-a716-446655440000'),
    identifierDisplayName: 'user@example.com',
    identifierAuthProvider: UserAuthProvider.EMAIL,
    deviceInfo: {
      clientType: ClientType.WEB,
      language: 'en',
      deviceId: null,
      deviceName: 'Chrome on Windows',
      appVersion: '1.0.0',
      operationSystemVersion: 'Windows 11'
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

  const createMockDeps = (isCurrent = false): SessionDetailStoreDependencies => ({
    session: mockSession,
    isCurrentSession: isCurrent,
    deleteSessionUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    onSessionRevoked: vi.fn(),
    onNavigateToIdentifierDetail: vi.fn(),
    onNavigateToUserDetail: vi.fn(),
    onNavigateToProfile: vi.fn(),
    onBack: vi.fn()
  })

  it('renders session details card for remote session', () => {
    const deps = createMockDeps(false)

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(SessionDetailTestTags.TITLE).textContent).toBe(enUserStrings.session_detail_title_session)
    expect(screen.getByTestId(SessionDetailTestTags.IDENTIFIER_DISPLAY_NAME).textContent).toBe('user@example.com')
    expect(screen.getByTestId(SessionDetailTestTags.DEVICE_NAME).textContent).toContain('Chrome on Windows')
    expect(screen.getByTestId(SessionDetailTestTags.REVOKE_BUTTON)).not.toBeNull()
  })

  it('hides revoke button for current session', () => {
    const deps = createMockDeps(true)

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(SessionDetailTestTags.TITLE).textContent).toBe(enUserStrings.session_detail_title_current_session)
    expect(screen.queryByTestId(SessionDetailTestTags.REVOKE_BUTTON)).toBeNull()
  })

  it('executes deleteSessionUseCase and triggers onSessionRevoked when revoke button is clicked', async () => {
    const deps = createMockDeps(false)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(SessionDetailTestTags.REVOKE_BUTTON))

    expect(deps.deleteSessionUseCase?.execute).toHaveBeenCalledWith(mockSession.id)
    expect(deps.onSessionRevoked).toHaveBeenCalledWith(mockSession.id)
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps(false)
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(SessionDetailTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

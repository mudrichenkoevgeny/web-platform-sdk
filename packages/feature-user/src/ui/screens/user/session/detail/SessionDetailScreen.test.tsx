import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClientType, CommonLocales, TEST_EMAIL, TEST_IDENTIFIER_ID, TEST_IP_ADDRESS, TEST_SESSION_ID, TEST_USER_AGENT, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { SessionDetailScreen, SessionDetailTestTags } from '@/ui/screens/user/session/detail/SessionDetailScreen'
import type { SessionDetailStoreDependencies } from '@/ui/screens/user/session/detail/session-detail-store'

describe('SessionDetailScreen', () => {
  const mockSession: UserSessionPrivate = {
    id: toUserSessionIdOrThrow(TEST_SESSION_ID),
    userId: toUserIdOrThrow(TEST_USER_ID),
    userRole: UserRole.CLIENT_USER,
    identifier: TEST_EMAIL,
    identifierId: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID),
    identifierDisplayName: TEST_EMAIL,
    identifierAuthProvider: UserAuthProvider.EMAIL,
    clientDeviceInfo: {
      clientType: ClientType.WEB,
      language: CommonLocales.ENGLISH,
      deviceId: null,
      deviceName: 'Chrome on Windows',
      appVersion: '1.0.0',
      operationSystemVersion: 'Windows 11'
    },
    userAgent: TEST_USER_AGENT,
    ipAddress: TEST_IP_ADDRESS,
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
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    onSessionRevoked: vi.fn(),
    onNavigateToIdentifierDetail: vi.fn(),
    onNavigateToUserDetail: vi.fn(),
    onNavigateToUserMain: vi.fn(),
    onBack: vi.fn()
  })

  it('renders session details card for remote session', () => {
    const deps = createMockDeps(false)

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(SessionDetailTestTags.TITLE).textContent).toBe(userStrings.ui.sessionDetailTitleSession)
    expect(screen.getByTestId(SessionDetailTestTags.IDENTIFIER_DISPLAY_NAME).textContent).toBe(TEST_EMAIL)
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

    expect(screen.getByTestId(SessionDetailTestTags.TITLE).textContent).toBe(userStrings.ui.sessionDetailTitleCurrentSession)
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

  it('navigates to user detail when clicking user for session matching currentUserId', async () => {
    const deps = createMockDeps(false)
    deps.currentUserId = mockSession.userId
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(SessionDetailTestTags.USER_ROW))
    expect(deps.onNavigateToUserDetail).toHaveBeenCalledWith(mockSession.userId)
  })

  it('disables revoke button when session belongs to currentUserId', async () => {
    const deps = createMockDeps(false)
    deps.currentUserId = mockSession.userId

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const revokeBtn = await screen.findByTestId(SessionDetailTestTags.REVOKE_BUTTON)
    expect(revokeBtn.getAttribute('disabled')).not.toBeNull()
  })

  it('enables revoke button when session belongs to another user', async () => {
    const deps = createMockDeps(false)
    deps.currentUserId = toUserIdOrThrow('usr_other_999')

    render(
      <ComponentTestHarness>
        <SessionDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const revokeBtn = await screen.findByTestId(SessionDetailTestTags.REVOKE_BUTTON)
    expect(revokeBtn.getAttribute('disabled')).toBeNull()
  })
})

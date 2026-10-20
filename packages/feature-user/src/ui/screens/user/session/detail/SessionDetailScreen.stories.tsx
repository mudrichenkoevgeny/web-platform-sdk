import type { Meta, StoryObj } from '@storybook/react'
import { ClientType, CommonLocales, TEST_EMAIL, TEST_IDENTIFIER_ID, TEST_IP_ADDRESS, TEST_SESSION_ID, TEST_USER_AGENT, TEST_USER_ID, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { SessionDetailScreen } from '@/ui/screens/user/session/detail/SessionDetailScreen'
import type { SessionDetailStoreDependencies } from '@/ui/screens/user/session/detail/session-detail-store'

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
    execute: async () => appResultSuccess(undefined)
  },
  onSessionRevoked: () => {},
  onNavigateToIdentifierDetail: () => {},
  onNavigateToUserDetail: () => {},
  onNavigateToUserMain: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SessionDetailScreen> = {
  title: 'Feature/User/Main/Session/Detail/SessionDetailScreen',
  component: SessionDetailScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md h-[36rem] border rounded-xl overflow-hidden bg-background">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps(false)
  }
}

export default meta
type Story = StoryObj<typeof SessionDetailScreen>

export const RemoteSession: Story = {}

export const CurrentSession: Story = {
  args: {
    dependencies: createMockDeps(true)
  }
}

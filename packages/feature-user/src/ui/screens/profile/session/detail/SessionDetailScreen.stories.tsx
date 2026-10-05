import type { Meta, StoryObj } from '@storybook/react'
import { ClientType, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SessionDetailScreen } from '@/ui/screens/profile/session/detail/SessionDetailScreen'
import type { SessionDetailStoreDependencies } from '@/ui/screens/profile/session/detail/session-detail-store'

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
    execute: async () => appResultSuccess(undefined)
  } as any,
  onSessionRevoked: () => {},
  onNavigateToIdentifierDetail: () => {},
  onNavigateToUserDetail: () => {},
  onNavigateToProfile: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SessionDetailScreen> = {
  title: 'Feature/User/Profile/Session/Detail/SessionDetailScreen',
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

import type { Meta, StoryObj } from '@storybook/react'
import { ClientType, toUserIdentifierIdOrThrow, toUserIdOrThrow, toUserSessionIdOrThrow, UserAuthProvider, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSession } from '@mudrichenkoevgeny/shared-foundation'
import { SelfSessionListScreen } from '@/ui/screens/profile/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/profile/session/list/self-session-list-store'

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
    invoke: async () =>
      appResultSuccess({
        items: [session1, session2],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 1
      })
  } as any,
  deleteSessionUseCase: {
    invoke: async () => appResultSuccess(undefined)
  } as any,
  deleteAllOtherSessionsUseCase: {
    invoke: async () => appResultSuccess(undefined)
  } as any,
  onNavigateToSessionDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof SelfSessionListScreen> = {
  title: 'Feature/User/Profile/Session/List/SelfSessionListScreen',
  component: SelfSessionListScreen,
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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof SelfSessionListScreen>

export const Default: Story = {}

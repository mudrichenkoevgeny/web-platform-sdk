import type { Meta, StoryObj } from '@storybook/react'
import { ClientType, toUserSessionIdOrThrow, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { UserSessionSummary } from '@mudrichenkoevgeny/shared-foundation'
import { SelfSessionListScreen } from '@/ui/screens/profile/session/list/SelfSessionListScreen'
import type { SelfSessionListStoreDependencies } from '@/ui/screens/profile/session/list/self-session-list-store'

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
    execute: async () =>
      appResultSuccess({
        items: [session1, session2],
        totalCount: 2,
        pageNumber: 1,
        pageSize: 20,
        totalPages: 1
      })
  } as unknown as SelfSessionListStoreDependencies['getSessionsUseCase'],
  deleteSessionUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as SelfSessionListStoreDependencies['deleteSessionUseCase'],
  deleteAllOtherSessionsUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as SelfSessionListStoreDependencies['deleteAllOtherSessionsUseCase'],
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

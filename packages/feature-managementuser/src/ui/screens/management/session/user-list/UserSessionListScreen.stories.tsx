import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { UserId } from '@mudrichenkoevgeny/shared-foundation'
import { UserSessionListScreen } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/user-list/UserSessionListStore'

const createMockDeps = (): UserSessionListStoreDependencies => ({
  userId: 'usr_123' as unknown as UserId,
  managementGetSessionsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userSessionMock(), userSessionMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as unknown as UserSessionListStoreDependencies['managementGetSessionsUseCase'],
  managementDeleteSessionUseCase: {
    execute: async () => appResultSuccess({})
  } as unknown as UserSessionListStoreDependencies['managementDeleteSessionUseCase'],
  managementDeleteAllUserSessionsUseCase: {
    execute: async () => appResultSuccess({})
  } as unknown as UserSessionListStoreDependencies['managementDeleteAllUserSessionsUseCase'],
  onNavigateToSessionDetail: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UserSessionListScreen> = {
  title: 'Feature/ManagementUser/Session/UserSessionListScreen',
  component: UserSessionListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof UserSessionListScreen>

export const Default: Story = {}

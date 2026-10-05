import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userSessionMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserSessionListScreen } from '@/ui/screens/management/session/userlist/UserSessionListScreen'
import type { UserSessionListStoreDependencies } from '@/ui/screens/management/session/userlist/UserSessionListStore'

const createMockDeps = (): UserSessionListStoreDependencies => ({
  userId: 'usr_123' as any,
  managementGetSessionsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userSessionMock(), userSessionMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as any,
  managementDeleteSessionUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  managementDeleteAllUserSessionsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
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

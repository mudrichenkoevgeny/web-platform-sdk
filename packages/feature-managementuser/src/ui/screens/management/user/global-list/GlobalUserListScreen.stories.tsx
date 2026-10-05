import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { GlobalUserListScreen } from '@/ui/screens/management/user/globallist/GlobalUserListScreen'
import type { GlobalUserListStoreDependencies } from '@/ui/screens/management/user/globallist/GlobalUserListStore'

const createMockDeps = (): GlobalUserListStoreDependencies => ({
  getUsersUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [userDetailsMock(), userDetailsMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as any,
  onNavigateToUserDetail: () => {},
  onNavigateToCreateUser: () => {},
  onBack: () => {}
})

const meta: Meta<typeof GlobalUserListScreen> = {
  title: 'Feature/ManagementUser/User/GlobalUserListScreen',
  component: GlobalUserListScreen,
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
type Story = StoryObj<typeof GlobalUserListScreen>

export const Default: Story = {}

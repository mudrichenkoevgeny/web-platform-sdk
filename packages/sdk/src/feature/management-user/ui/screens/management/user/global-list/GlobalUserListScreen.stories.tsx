import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { GlobalUserListScreen } from '@/feature/management-user/ui/screens/management/user/global-list/GlobalUserListScreen'
import { globalUserListDependenciesMock } from '@/feature/management-user/mock/ui/screen/management/user/global-list/global-user-list-component-mock'

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
    dependencies: globalUserListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof GlobalUserListScreen>

export const Default: Story = {}

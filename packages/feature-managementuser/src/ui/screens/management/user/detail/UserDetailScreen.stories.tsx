import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserDetailScreen } from '@/ui/screens/management/user/detail/UserDetailScreen'
import { userDetailDependenciesMock } from '@/mock/ui/screen/management/user/detail/user-detail-component-mock'

const meta: Meta<typeof UserDetailScreen> = {
  title: 'Feature/ManagementUser/User/UserDetailScreen',
  component: UserDetailScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: userDetailDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof UserDetailScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { CreateUserScreen } from '@/feature/management-user/ui/screens/management/user/create/CreateUserScreen'
import { createUserDependenciesMock } from '@/feature/management-user/mock/ui/screen/management/user/create/create-user-component-mock'

const meta: Meta<typeof CreateUserScreen> = {
  title: 'Feature/ManagementUser/User/CreateUserScreen',
  component: CreateUserScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createUserDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof CreateUserScreen>

export const Default: Story = {}

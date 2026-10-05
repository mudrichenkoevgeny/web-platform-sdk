import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { CreateUserScreen } from '@/ui/screens/management/user/create/CreateUserScreen'
import type { CreateUserStoreDependencies } from '@/ui/screens/management/user/create/CreateUserStore'

const createMockDeps = (): CreateUserStoreDependencies => ({
  createUserUseCase: {
    execute: async () => ({ isSuccess: true, data: undefined })
  } as unknown as CreateUserStoreDependencies['createUserUseCase'],
  onSuccess: () => {},
  onBack: () => {}
})

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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof CreateUserScreen>

export const Default: Story = {}

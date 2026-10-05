import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserDetailScreen } from '@/ui/screens/management/user/detail/UserDetailScreen'
import type { UserDetailStoreDependencies } from '@/ui/screens/management/user/detail/UserDetailStore'

const createMockDeps = (): UserDetailStoreDependencies => ({
  userId: 'usr_123' as any,
  getUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as any,
  updateUserUseCase: {
    execute: async () => appResultSuccess(userDetailsMock())
  } as any,
  deleteUserUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  managementDisableTotpUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onNavigateToSessions: () => {},
  onNavigateToIdentifiers: () => {},
  onBack: () => {}
})

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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof UserDetailScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { PendingDeletionScreen } from '@/ui/screens/auth/login/pendingdeletion/PendingDeletionScreen'
import type { PendingDeletionStoreDependencies } from '@/ui/screens/auth/login/pendingdeletion/PendingDeletionStore'

const createMockDeps = (): PendingDeletionStoreDependencies => ({
  restoreUserUseCase: {
    invoke: async () => appResultSuccess(undefined)
  } as any,
  logoutUseCase: {
    invoke: async () => appResultSuccess(undefined)
  } as any,
  onRestoreSuccess: () => {},
  onSignOut: () => {}
})

const meta: Meta<typeof PendingDeletionScreen> = {
  title: 'Feature/User/Auth/Login/PendingDeletion/PendingDeletionScreen',
  component: PendingDeletionScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-[420px] h-[520px] border rounded-xl overflow-hidden">
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
type Story = StoryObj<typeof PendingDeletionScreen>

export const Default: Story = {}

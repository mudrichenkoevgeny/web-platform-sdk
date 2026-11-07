import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { PendingDeletionScreen } from '@/ui/screens/auth/login/pending-deletion/PendingDeletionScreen'
import type { PendingDeletionStoreDependencies } from '@/ui/screens/auth/login/pending-deletion/pending-deletion-store'

const createMockDeps = (): PendingDeletionStoreDependencies => ({
  restoreUserUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  logoutUseCase: {
    execute: async () => appResultSuccess(undefined)
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
        <div className="w-dialog-default h-dialog-default border rounded-xl overflow-hidden">
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

import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRootScreen } from '@/ui/screens/auth/unlock/root/UnlockRootScreen'
import type { UnlockRootStoreDependencies } from '@/ui/screens/auth/unlock/root/unlock-root-store'

const createMockDeps = (): UnlockRootStoreDependencies => ({
  getUserIdentifiersUseCase: {
    execute: async () => appResultSuccess({ items: [] })
  } as unknown as UnlockRootStoreDependencies['getUserIdentifiersUseCase'],
  sendUnlockEmailConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as unknown as UnlockRootStoreDependencies['sendUnlockEmailConfirmationUseCase'],
  sendUnlockPhoneConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as unknown as UnlockRootStoreDependencies['sendUnlockPhoneConfirmationUseCase'],
  unlockByEmailUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as UnlockRootStoreDependencies['unlockByEmailUseCase'],
  unlockByPhoneUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as UnlockRootStoreDependencies['unlockByPhoneUseCase'],
  onUnlockSuccess: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UnlockRootScreen> = {
  title: 'Feature/User/Auth/Unlock/Root/UnlockRootScreen',
  component: UnlockRootScreen,
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
type Story = StoryObj<typeof UnlockRootScreen>

export const Default: Story = {}

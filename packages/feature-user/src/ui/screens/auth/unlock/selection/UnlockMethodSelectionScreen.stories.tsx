import type { Meta, StoryObj } from '@storybook/react'
import { AccountLockoutType } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethodSelectionScreen } from '@/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen'
import type { UnlockMethodSelectionStoreDependencies } from '@/ui/screens/auth/unlock/selection/unlock-method-selection-store'

const createMockDeps = (): UnlockMethodSelectionStoreDependencies => ({
  lockoutType: AccountLockoutType.TEMPORARY,
  lockoutUntil: Date.now() + 300000,
  getUserIdentifiersUseCase: {
    execute: async () => appResultSuccess({ items: [] })
  } as any,
  unlockByGoogleUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  onNavigateToEmailInput: () => {},
  onNavigateToPhoneInput: () => {},
  onUnlockSuccess: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UnlockMethodSelectionScreen> = {
  title: 'Feature/User/Auth/Unlock/Selection/UnlockMethodSelectionScreen',
  component: UnlockMethodSelectionScreen,
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
type Story = StoryObj<typeof UnlockMethodSelectionScreen>

export const Default: Story = {}

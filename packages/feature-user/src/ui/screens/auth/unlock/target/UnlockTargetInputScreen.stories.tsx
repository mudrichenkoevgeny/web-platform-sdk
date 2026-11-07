import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockTargetInputScreen } from '@/ui/screens/auth/unlock/target/UnlockTargetInputScreen'
import type { UnlockTargetInputStoreDependencies } from '@/ui/screens/auth/unlock/target/unlock-target-input-store'

const createMockDeps = (method: UnlockMethod = UnlockMethod.EMAIL): UnlockTargetInputStoreDependencies => ({
  method,
  sendUnlockEmailConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 30 })
  } as any,
  sendUnlockPhoneConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 30 })
  } as any,
  onNavigateToOtp: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UnlockTargetInputScreen> = {
  title: 'Feature/User/Auth/Unlock/Target/UnlockTargetInputScreen',
  component: UnlockTargetInputScreen,
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
    dependencies: createMockDeps(UnlockMethod.EMAIL)
  }
}

export default meta
type Story = StoryObj<typeof UnlockTargetInputScreen>

export const EmailMethod: Story = {}

export const PhoneMethod: Story = {
  args: {
    dependencies: createMockDeps(UnlockMethod.PHONE)
  }
}

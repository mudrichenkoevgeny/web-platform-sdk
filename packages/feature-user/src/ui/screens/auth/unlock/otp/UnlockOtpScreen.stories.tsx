import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockOtpScreen } from '@/ui/screens/auth/unlock/otp/UnlockOtpScreen'
import type { UnlockOtpStoreDependencies } from '@/ui/screens/auth/unlock/otp/UnlockOtpStore'

const createMockDeps = (): UnlockOtpStoreDependencies => ({
  method: UnlockMethod.EMAIL,
  target: 'user@example.com',
  initialDelaySeconds: 30,
  unlockByEmailUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  unlockByPhoneUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  sendUnlockEmailConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 30 })
  } as any,
  sendUnlockPhoneConfirmationUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 30 })
  } as any,
  onUnlockSuccess: () => {},
  onBack: () => {}
})

const meta: Meta<typeof UnlockOtpScreen> = {
  title: 'Feature/User/Auth/Unlock/OTP/UnlockOtpScreen',
  component: UnlockOtpScreen,
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
type Story = StoryObj<typeof UnlockOtpScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ResetEmailPasswordScreen } from '@/ui/screens/auth/reset-password/ResetEmailPasswordScreen'
import type { ResetEmailPasswordStoreDependencies } from '@/ui/screens/auth/reset-password/reset-email-password-store'

const createMockDeps = (): ResetEmailPasswordStoreDependencies => ({
  resetPasswordRepository: {
    getRemainingResetPasswordConfirmationDelayInSeconds: () => 0
  } as any,
  sendResetPasswordConfirmationToEmailUseCase: {
    execute: async () =>
      appResultSuccess({
        retryAfterSeconds: 30
      })
  } as any,
  resetEmailPasswordUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  validatePasswordUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  onBack: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof ResetEmailPasswordScreen> = {
  title: 'Feature/User/Auth/ResetPassword/ResetEmailPasswordScreen',
  component: ResetEmailPasswordScreen,
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
type Story = StoryObj<typeof ResetEmailPasswordScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RegistrationByEmailScreen } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import type { RegistrationByEmailStoreDependencies } from '@/ui/screens/auth/registration/email/RegistrationByEmailStore'

const createMockDeps = (): RegistrationByEmailStoreDependencies => ({
  registrationRepository: {
    getRemainingRegistrationConfirmationDelayInSeconds: () => 0
  } as unknown as RegistrationByEmailStoreDependencies['registrationRepository'],
  sendRegistrationConfirmationToEmailUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as unknown as RegistrationByEmailStoreDependencies['sendRegistrationConfirmationToEmailUseCase'],
  registrationByEmailUseCase: {
    execute: async () =>
      appResultSuccess({
        userDetails: {
          id: 'usr_123',
          accountStatus: 'ACTIVE'
        }
      })
  } as unknown as RegistrationByEmailStoreDependencies['registrationByEmailUseCase'],
  validatePasswordUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as unknown as RegistrationByEmailStoreDependencies['validatePasswordUseCase'],
  onBack: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof RegistrationByEmailScreen> = {
  title: 'Feature/ClientUser/Auth/Registration/Email/RegistrationByEmailScreen',
  component: RegistrationByEmailScreen,
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
type Story = StoryObj<typeof RegistrationByEmailScreen>

export const Default: Story = {}

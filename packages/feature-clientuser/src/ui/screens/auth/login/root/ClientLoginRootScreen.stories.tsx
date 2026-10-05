import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { ClientLoginRootScreen } from '@/ui/screens/auth/login/root/ClientLoginRootScreen'
import type { ClientLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ClientLoginRootStore'

const createMockDeps = (): ClientLoginRootStoreDependencies => ({
  appType: AppType.CLIENT,
  getOpenGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    execute: async () =>
      appResultSuccess({
        primary: ['EMAIL'],
        secondary: ['PHONE']
      })
  } as any,
  loginByGoogleUseCase: {} as any,
  loginByEmailUseCase: {} as any,
  loginRepository: {} as any,
  sendLoginConfirmationToPhoneUseCase: {} as any,
  loginByPhoneUseCase: {} as any,
  registrationRepository: {} as any,
  sendRegistrationConfirmationToEmailUseCase: {} as any,
  registrationByEmailUseCase: {} as any,
  resetPasswordRepository: {} as any,
  sendResetPasswordConfirmationToEmailUseCase: {} as any,
  resetEmailPasswordUseCase: {} as any,
  validatePasswordUseCase: {} as any,
  loginByTotpUseCase: {} as any,
  loginByTotpRecoveryCodeUseCase: {} as any,
  restoreUserUseCase: {} as any,
  logoutUseCase: {} as any,
  getUserIdentifiersUseCase: {} as any,
  unlockByGoogleUseCase: {} as any,
  sendUnlockEmailConfirmationUseCase: {} as any,
  sendUnlockPhoneConfirmationUseCase: {} as any,
  unlockByEmailUseCase: {} as any,
  unlockByPhoneUseCase: {} as any,
  externalLauncher: {} as any,
  onDismiss: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof ClientLoginRootScreen> = {
  title: 'Feature/ClientUser/Auth/Login/Root/ClientLoginRootScreen',
  component: ClientLoginRootScreen,
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
type Story = StoryObj<typeof ClientLoginRootScreen>

export const Default: Story = {}

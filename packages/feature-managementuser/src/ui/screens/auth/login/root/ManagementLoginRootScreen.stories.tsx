import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementLoginRootScreen } from '@/ui/screens/auth/login/root/ManagementLoginRootScreen'
import type { ManagementLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ManagementLoginRootStore'

const createMockDeps = (): ManagementLoginRootStoreDependencies => ({
  appType: AppType.MANAGEMENT,
  getOpenGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    execute: async () =>
      appResultSuccess({
        primary: ['EMAIL'],
        secondary: []
      })
  } as any,
  loginByEmailUseCase: {} as any,
  resetPasswordRepository: {} as any,
  sendResetPasswordConfirmationToEmailUseCase: {} as any,
  resetEmailPasswordUseCase: {} as any,
  validatePasswordUseCase: {} as any,
  loginByTotpUseCase: {} as any,
  loginByTotpRecoveryCodeUseCase: {} as any,
  restoreUserUseCase: {} as any,
  logoutUseCase: {} as any,
  getUserIdentifiersUseCase: {} as any,
  sendUnlockEmailConfirmationUseCase: {} as any,
  sendUnlockPhoneConfirmationUseCase: {} as any,
  unlockByEmailUseCase: {} as any,
  unlockByPhoneUseCase: {} as any,
  externalLauncher: {} as any,
  onDismiss: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof ManagementLoginRootScreen> = {
  title: 'Feature/ManagementUser/Auth/Login/Root/ManagementLoginRootScreen',
  component: ManagementLoginRootScreen,
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
type Story = StoryObj<typeof ManagementLoginRootScreen>

export const Default: Story = {}

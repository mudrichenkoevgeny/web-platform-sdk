import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { LoginWelcomeScreen } from '@/ui/screens/auth/login/welcome/LoginWelcomeScreen'
import type { LoginWelcomeStoreDependencies } from '@/ui/screens/auth/login/welcome/login-welcome-store'

const createMockDeps = (): LoginWelcomeStoreDependencies => ({
  externalLauncher: { openUrl: () => {}, openMail: () => {}, openFile: () => {} },
  getOpenGlobalSettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        privacyPolicyUrl: 'https://example.com/privacy',
        termsOfServiceUrl: 'https://example.com/terms'
      })
  } as any,
  getAvailableUserAuthProvidersUseCase: {
    execute: async () =>
      appResultSuccess({
        primary: [UserAuthProvider.EMAIL, UserAuthProvider.PHONE],
        secondary: [UserAuthProvider.GOOGLE, UserAuthProvider.APPLE]
      })
  } as any,
  onNavigateToLoginByEmail: () => {},
  onNavigateToLoginByPhone: () => {},
  onNavigateToTotp: () => {},
  onNavigateToPendingDeletion: () => {},
  onNavigateToAccountUnlock: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof LoginWelcomeScreen> = {
  title: 'Feature/User/Auth/Login/Welcome/LoginWelcomeScreen',
  component: LoginWelcomeScreen,
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
type Story = StoryObj<typeof LoginWelcomeScreen>

export const Default: Story = {}

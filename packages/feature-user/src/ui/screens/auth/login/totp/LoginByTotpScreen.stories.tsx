import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByTotpScreen } from '@/ui/screens/auth/login/totp/LoginByTotpScreen'
import type { LoginByTotpStoreDependencies } from '@/ui/screens/auth/login/totp/login-by-totp-store'

const createMockDeps = (): LoginByTotpStoreDependencies => ({
  mfaToken: 'mock_mfa_token',
  loginByTotpUseCase: {
    execute: async () =>
      appResultSuccess({
        userDetails: {
          id: 'usr_123',
          accountStatus: 'ACTIVE'
        }
      })
  } as any,
  loginByTotpRecoveryCodeUseCase: {
    execute: async () =>
      appResultSuccess({
        userDetails: {
          id: 'usr_123',
          accountStatus: 'ACTIVE'
        }
      })
  } as any,
  onNavigateToPendingDeletion: () => {},
  onBack: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof LoginByTotpScreen> = {
  title: 'Feature/User/Auth/Login/TOTP/LoginByTotpScreen',
  component: LoginByTotpScreen,
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
type Story = StoryObj<typeof LoginByTotpScreen>

export const Default: Story = {}

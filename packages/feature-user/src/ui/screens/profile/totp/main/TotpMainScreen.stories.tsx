import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TotpMainScreen } from '@/ui/screens/profile/totp/main/TotpMainScreen'
import type { TotpMainStoreDependencies } from '@/ui/screens/profile/totp/main/totp-main-store'

const createMockDeps = (user = {
  id: 'usr_123',
  isTotpEnabled: false
}): TotpMainStoreDependencies => ({
  userRepository: {
    getCurrentUser: () => user as any,
    refreshCurrentUser: async () => appResultSuccess(user)
  } as any,
  setupTotpUseCase: {
    invoke: async () =>
      appResultSuccess({
        totpSecretKey: 'JBSWY3DPEHPK3PXP',
        totpOtpAuthUrl: 'otpauth://totp/Test?secret=JBSWY3DPEHPK3PXP',
        mfaToken: 'mfa_123'
      })
  } as any,
  enableTotpUseCase: {
    invoke: async () =>
      appResultSuccess({
        totpRecoveryCodes: ['1111-2222', '3333-4444']
      })
  } as any,
  disableTotpUseCase: {
    invoke: async () => appResultSuccess(undefined)
  } as any,
  onNavigateToRecoveryCodes: () => {},
  onBack: () => {}
})

const meta: Meta<typeof TotpMainScreen> = {
  title: 'Feature/User/Profile/TOTP/Main/TotpMainScreen',
  component: TotpMainScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md h-[36rem] border rounded-xl overflow-hidden bg-background">
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
type Story = StoryObj<typeof TotpMainScreen>

export const Disabled: Story = {}

export const Enabled: Story = {
  args: {
    dependencies: createMockDeps({ id: 'usr_123', isTotpEnabled: true })
  }
}

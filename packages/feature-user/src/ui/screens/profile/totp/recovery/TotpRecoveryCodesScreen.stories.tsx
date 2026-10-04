import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TotpRecoveryCodesScreen } from '@/ui/screens/profile/totp/recovery/TotpRecoveryCodesScreen'
import type { TotpRecoveryCodesStoreDependencies } from '@/ui/screens/profile/totp/recovery/TotpRecoveryCodesStore'

const createMockDeps = (): TotpRecoveryCodesStoreDependencies => ({
  getRecoveryCodesUseCase: {
    invoke: async () =>
      appResultSuccess({
        totpRecoveryCodes: ['1111-2222', '3333-4444', '5555-6666', '7777-8888']
      })
  } as any,
  regenerateRecoveryCodesUseCase: {
    invoke: async () =>
      appResultSuccess({
        totpRecoveryCodes: ['AAAA-BBBB', 'CCCC-DDDD', 'EEEE-FFFF', 'GGGG-HHHH']
      })
  } as any,
  onBack: () => {}
})

const meta: Meta<typeof TotpRecoveryCodesScreen> = {
  title: 'Feature/User/Profile/TOTP/Recovery/TotpRecoveryCodesScreen',
  component: TotpRecoveryCodesScreen,
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
type Story = StoryObj<typeof TotpRecoveryCodesScreen>

export const Default: Story = {}

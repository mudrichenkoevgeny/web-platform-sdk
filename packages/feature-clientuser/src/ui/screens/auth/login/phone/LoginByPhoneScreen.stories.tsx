import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByPhoneScreen } from '@/ui/screens/auth/login/phone/LoginByPhoneScreen'
import type { LoginByPhoneStoreDependencies } from '@/ui/screens/auth/login/phone/LoginByPhoneStore'

const createMockDeps = (): LoginByPhoneStoreDependencies => ({
  loginRepository: {
    getRemainingLoginConfirmationDelayInSeconds: () => 0
  } as any,
  sendLoginConfirmationToPhoneUseCase: {
    execute: async () => appResultSuccess({ retryAfterSeconds: 60 })
  } as any,
  loginByPhoneUseCase: {
    execute: async () =>
      appResultSuccess({
        userPrivate: {
          id: 'usr_123',
          accountStatus: 'ACTIVE'
        }
      })
  } as any,
  onNavigateToTotp: () => {},
  onNavigateToPendingDeletion: () => {},
  onNavigateToAccountUnlock: () => {},
  onBack: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof LoginByPhoneScreen> = {
  title: 'Feature/ClientUser/Auth/Login/Phone/LoginByPhoneScreen',
  component: LoginByPhoneScreen,
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
type Story = StoryObj<typeof LoginByPhoneScreen>

export const Default: Story = {}

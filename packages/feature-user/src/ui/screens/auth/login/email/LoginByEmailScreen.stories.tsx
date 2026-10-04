import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { LoginByEmailScreen } from './LoginByEmailScreen'
import { LoginByEmailStoreDependencies } from './LoginByEmailStore'

const createMockDeps = (): LoginByEmailStoreDependencies => ({
  appType: AppType.CLIENT,
  loginByEmailUseCase: {
    execute: async () =>
      appResultSuccess({
        userDetails: {
          id: 'usr_123',
          accountStatus: 'ACTIVE'
        }
      })
  } as any,
  onNavigateToRegistrationByEmail: () => {},
  onNavigateToForgotPassword: () => {},
  onNavigateToTotp: () => {},
  onNavigateToPendingDeletion: () => {},
  onNavigateToAccountUnlock: () => {},
  onBack: () => {},
  onFinished: () => {}
})

const meta: Meta<typeof LoginByEmailScreen> = {
  title: 'Feature/User/Auth/Login/Email/LoginByEmailScreen',
  component: LoginByEmailScreen,
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
type Story = StoryObj<typeof LoginByEmailScreen>

export const Default: Story = {}

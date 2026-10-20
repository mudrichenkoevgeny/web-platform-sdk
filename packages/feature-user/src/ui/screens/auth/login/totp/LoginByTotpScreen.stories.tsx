import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByTotpScreen } from '@/ui/screens/auth/login/totp/LoginByTotpScreen'
import { loginByTotpDependenciesMock } from '@/mock/ui/screen/auth/login/totp/login-by-totp-component-mock'

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
    dependencies: loginByTotpDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof LoginByTotpScreen>

export const Default: Story = {}

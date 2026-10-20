import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByEmailScreen } from '@/ui/screens/auth/login/email/LoginByEmailScreen'
import { loginByEmailDependenciesMock } from '@/mock/ui/screen/auth/login/email/login-by-email-component-mock'

const meta: Meta<typeof LoginByEmailScreen> = {
  title: 'Feature/User/Auth/Login/Email/LoginByEmailScreen',
  component: LoginByEmailScreen,
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
    dependencies: loginByEmailDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof LoginByEmailScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByPhoneScreen } from '@/ui/screens/auth/login/phone/LoginByPhoneScreen'
import { loginByPhoneDependenciesMock } from '@/mock/ui/screen/auth/login/phone/login-by-phone-component-mock'

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
    dependencies: loginByPhoneDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof LoginByPhoneScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { RegistrationByEmailScreen } from '@/ui/screens/auth/registration/email/RegistrationByEmailScreen'
import { registrationByEmailDependenciesMock } from '@/mock/ui/screen/auth/registration/email/registration-by-email-component-mock'

const meta: Meta<typeof RegistrationByEmailScreen> = {
  title: 'Feature/ClientUser/Auth/Registration/Email/RegistrationByEmailScreen',
  component: RegistrationByEmailScreen,
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
    dependencies: registrationByEmailDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof RegistrationByEmailScreen>

export const Default: Story = {}

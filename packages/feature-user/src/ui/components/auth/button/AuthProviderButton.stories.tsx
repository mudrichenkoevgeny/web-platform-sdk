import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderButton } from '@/ui/components/auth/button/AuthProviderButton'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/AuthProviderButtonMode'

const meta: Meta<typeof AuthProviderButton> = {
  title: 'Feature/User/Auth/AuthProviderButton',
  component: AuthProviderButton,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-80">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    authProvider: UserAuthProvider.EMAIL,
    mode: AuthProviderButtonMode.SIGN_IN
  }
}

export default meta
type Story = StoryObj<typeof AuthProviderButton>

export const EmailSignIn: Story = {}

export const PhoneAdd: Story = {
  args: {
    authProvider: UserAuthProvider.PHONE,
    mode: AuthProviderButtonMode.ADD
  }
}

export const GoogleSignIn: Story = {
  args: {
    authProvider: UserAuthProvider.GOOGLE
  }
}

export const AppleSignIn: Story = {
  args: {
    authProvider: UserAuthProvider.APPLE
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

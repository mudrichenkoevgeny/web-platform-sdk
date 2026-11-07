import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderItem } from '@/ui/components/auth/item/AuthProviderItem'

const meta: Meta<typeof AuthProviderItem> = {
  title: 'Feature/User/Auth/AuthProviderItem',
  component: AuthProviderItem,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    authProvider: UserAuthProvider.GOOGLE
  }
}

export default meta
type Story = StoryObj<typeof AuthProviderItem>

export const Google: Story = {}

export const Email: Story = {
  args: {
    authProvider: UserAuthProvider.EMAIL
  }
}

export const Phone: Story = {
  args: {
    authProvider: UserAuthProvider.PHONE
  }
}

export const Apple: Story = {
  args: {
    authProvider: UserAuthProvider.APPLE
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

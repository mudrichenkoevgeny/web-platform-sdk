import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { AuthProviderGrid } from '@/ui/components/auth/grid/AuthProviderGrid'

const meta: Meta<typeof AuthProviderGrid> = {
  title: 'Feature/User/Auth/AuthProviderGrid',
  component: AuthProviderGrid,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-80 p-4">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    authProviders: [
      UserAuthProvider.EMAIL,
      UserAuthProvider.PHONE,
      UserAuthProvider.GOOGLE,
      UserAuthProvider.APPLE
    ]
  }
}

export default meta
type Story = StoryObj<typeof AuthProviderGrid>

export const Default: Story = {}

export const OAuthOnly: Story = {
  args: {
    authProviders: [UserAuthProvider.GOOGLE, UserAuthProvider.APPLE]
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

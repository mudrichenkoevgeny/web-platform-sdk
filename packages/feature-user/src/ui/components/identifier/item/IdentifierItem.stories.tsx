import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'
import { userIdentifierMock } from '@mudrichenkoevgeny/shared-foundation'

const meta: Meta<typeof IdentifierItem> = {
  title: 'Feature/User/Identifier/IdentifierItem',
  component: IdentifierItem,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-96 p-4">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    identifier: userIdentifierMock()
  }
}

export default meta
type Story = StoryObj<typeof IdentifierItem>

export const Default: Story = {}

export const CurrentIdentifier: Story = {
  args: {
    isCurrentIdentifier: true
  }
}

export const PhoneIdentifier: Story = {
  args: {
    identifier: userIdentifierMock({
      userAuthProvider: UserAuthProvider.PHONE,
      displayName: '+1234567890',
      identifier: '+1234567890'
    })
  }
}

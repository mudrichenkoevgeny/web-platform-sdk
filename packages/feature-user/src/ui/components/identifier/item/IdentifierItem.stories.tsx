import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider, createTestUserIdentifierPrivate, TEST_PHONE } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'

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
    identifier: createTestUserIdentifierPrivate()
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
    identifier: createTestUserIdentifierPrivate({
      userAuthProvider: UserAuthProvider.PHONE,
      displayName: TEST_PHONE,
      identifier: TEST_PHONE
    })
  }
}

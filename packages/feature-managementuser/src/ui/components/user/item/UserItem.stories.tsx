import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userDetailsMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { UserItem } from '@/ui/components/user/item/UserItem'

const meta: Meta<typeof UserItem> = {
  title: 'Feature/ManagementUser/User/UserItem',
  component: UserItem,
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
    user: userDetailsMock(),
    onClick: () => {}
  }
}

export default meta
type Story = StoryObj<typeof UserItem>

export const Default: Story = {}

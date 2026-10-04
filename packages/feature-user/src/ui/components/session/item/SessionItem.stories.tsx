import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { SessionItem } from './SessionItem'
import { userSessionMock } from '@mudrichenkoevgeny/shared-foundation'

const meta: Meta<typeof SessionItem> = {
  title: 'Feature/User/Session/SessionItem',
  component: SessionItem,
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
    session: userSessionMock(),
    enabled: true
  }
}

export default meta
type Story = StoryObj<typeof SessionItem>

export const Default: Story = {}

export const CurrentSession: Story = {
  args: {
    isCurrentSession: true
  }
}

export const DisabledRevoke: Story = {
  args: {
    enabled: false
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserSessionListScreen } from '@/ui/screens/management/session/user-list/UserSessionListScreen'
import { userSessionListDependenciesMock } from '@/mock/ui/screen/management/session/user-list/user-session-list-component-mock'

const meta: Meta<typeof UserSessionListScreen> = {
  title: 'Feature/ManagementUser/Session/UserSessionListScreen',
  component: UserSessionListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: userSessionListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof UserSessionListScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserIdentifierListScreen } from '@/ui/screens/management/identifier/user-list/UserIdentifierListScreen'
import { userIdentifierListDependenciesMock } from '@/mock/ui/screen/management/identifier/user-list/user-identifier-list-component-mock'

const meta: Meta<typeof UserIdentifierListScreen> = {
  title: 'Feature/ManagementUser/Identifier/UserIdentifierListScreen',
  component: UserIdentifierListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: userIdentifierListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof UserIdentifierListScreen>

export const Default: Story = {}

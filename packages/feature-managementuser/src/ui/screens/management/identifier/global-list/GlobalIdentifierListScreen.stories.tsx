import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GlobalIdentifierListScreen } from '@/ui/screens/management/identifier/global-list/GlobalIdentifierListScreen'
import { globalIdentifierListDependenciesMock } from '@/mock/ui/screen/management/identifier/global-list/global-identifier-list-component-mock'

const meta: Meta<typeof GlobalIdentifierListScreen> = {
  title: 'Feature/ManagementUser/Identifier/GlobalIdentifierListScreen',
  component: GlobalIdentifierListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: globalIdentifierListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof GlobalIdentifierListScreen>

export const Default: Story = {}

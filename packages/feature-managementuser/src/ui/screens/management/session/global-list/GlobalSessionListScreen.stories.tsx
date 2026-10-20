import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { GlobalSessionListScreen } from '@/ui/screens/management/session/global-list/GlobalSessionListScreen'
import { globalSessionListDependenciesMock } from '@/mock/ui/screen/management/session/global-list/global-session-list-component-mock'

const meta: Meta<typeof GlobalSessionListScreen> = {
  title: 'Feature/ManagementUser/Session/GlobalSessionListScreen',
  component: GlobalSessionListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: globalSessionListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof GlobalSessionListScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { MainManagementScreen } from '@/ui/screens/management/main/MainManagementScreen'
import type { MainManagementStoreDependencies } from '@/ui/screens/management/main/MainManagementStore'

const createMockDeps = (): MainManagementStoreDependencies => ({
  onEditAuthSettingsClick: () => {},
  onEditGlobalSettingsClick: () => {},
  onEditSecuritySettingsClick: () => {},
  onGlobalUserListClick: () => {},
  onAuditEventListClick: () => {},
  onGlobalSessionListClick: () => {},
  onGlobalIdentifierListClick: () => {}
})

const meta: Meta<typeof MainManagementScreen> = {
  title: 'Feature/ManagementUser/MainManagementScreen',
  component: MainManagementScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof MainManagementScreen>

export const Default: Story = {}

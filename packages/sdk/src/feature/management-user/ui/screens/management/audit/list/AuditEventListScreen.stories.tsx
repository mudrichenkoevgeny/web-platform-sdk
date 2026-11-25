import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk/core/common'
import { AuditEventListScreen } from '@/feature/management-user/ui/screens/management/audit/list/AuditEventListScreen'
import { auditEventListDependenciesMock } from '@/feature/management-user/mock/ui/screen/management/audit/list/audit-event-list-component-mock'

const meta: Meta<typeof AuditEventListScreen> = {
  title: 'Feature/ManagementUser/Audit/AuditEventListScreen',
  component: AuditEventListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: auditEventListDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof AuditEventListScreen>

export const Default: Story = {}

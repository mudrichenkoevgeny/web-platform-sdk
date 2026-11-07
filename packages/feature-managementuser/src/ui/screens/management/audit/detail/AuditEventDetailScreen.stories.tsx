import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AuditEventDetailScreen } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import { auditEventDetailDependenciesMock } from '@/mock/ui/screen/management/audit/detail/audit-event-detail-component-mock'

const meta: Meta<typeof AuditEventDetailScreen> = {
  title: 'Feature/ManagementUser/Audit/AuditEventDetailScreen',
  component: AuditEventDetailScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: auditEventDetailDependenciesMock()
  }
}

export default meta
type Story = StoryObj<typeof AuditEventDetailScreen>

export const Default: Story = {}

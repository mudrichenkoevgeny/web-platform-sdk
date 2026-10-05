import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AuditItem } from '@/ui/components/audit/item/AuditItem'
import { auditEventMock } from '@/mock/audit/domain/model/event/auditEventMock'

const meta: Meta<typeof AuditItem> = {
  title: 'Feature/ManagementUser/Audit/AuditItem',
  component: AuditItem,
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
    event: auditEventMock(),
    onClick: () => {}
  }
}

export default meta
type Story = StoryObj<typeof AuditItem>

export const Default: Story = {}

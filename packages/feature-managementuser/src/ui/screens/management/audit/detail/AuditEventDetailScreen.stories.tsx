import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventDetailScreen } from '@/ui/screens/management/audit/detail/AuditEventDetailScreen'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'

const createMockDeps = (): AuditEventDetailStoreDependencies => ({
  eventId: auditEventMock().id,
  getAuditEventUseCase: {
    execute: async () => appResultSuccess(auditEventMock())
  } as any,
  onBack: () => {}
})

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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof AuditEventDetailScreen>

export const Default: Story = {}

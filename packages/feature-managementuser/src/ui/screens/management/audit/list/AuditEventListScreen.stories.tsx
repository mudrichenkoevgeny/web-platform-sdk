import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import { AuditEventListScreen } from '@/ui/screens/management/audit/list/AuditEventListScreen'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'

const createMockDeps = (): AuditEventListStoreDependencies => ({
  getAuditEventsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [auditEventMock(), auditEventMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1
      })
  } as any,
  onNavigateToEventDetail: () => {},
  onBack: () => {}
})

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
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof AuditEventListScreen>

export const Default: Story = {}

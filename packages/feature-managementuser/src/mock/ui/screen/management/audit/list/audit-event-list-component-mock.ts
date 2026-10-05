import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'

export const auditEventListDependenciesMock = (
  overrides?: Partial<AuditEventListStoreDependencies>
): AuditEventListStoreDependencies => ({
  getAuditEventsUseCase: {
    execute: async () =>
      appResultSuccess({
        items: [auditEventMock()],
        pageNumber: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1
      })
  } as any,
  onNavigateToEventDetail: () => {},
  onBack: () => {},
  ...overrides
})

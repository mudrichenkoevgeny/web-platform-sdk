import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { auditEventMock } from '@/mock/audit/domain/model/event/audit-event-mock'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'

export const auditEventDetailDependenciesMock = (
  overrides?: Partial<AuditEventDetailStoreDependencies>
): AuditEventDetailStoreDependencies => ({
  eventId: auditEventMock().id ?? toAuditEventIdOrThrow('evt_1'),
  getAuditEventUseCase: {
    execute: async () => appResultSuccess(auditEventMock())
  } as any,
  onBack: () => {},
  ...overrides
})

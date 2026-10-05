import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { auditEventMock } from '@/mock/audit/domain/model/event/auditEventMock'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'

export const auditEventDetailDependenciesMock = (
  overrides?: Partial<AuditEventDetailStoreDependencies>
): AuditEventDetailStoreDependencies => ({
  eventId: auditEventMock().id,
  getAuditEventUseCase: {
    execute: async () => appResultSuccess(auditEventMock())
  } as any,
  onBack: () => {},
  ...overrides
})

import { createTestAuditEventPrivate, TEST_AUDIT_EVENT_ID, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { GetAuditEventUseCaseMock } from '@/feature/management-user/mock/usecase/audit/get-audit-event-use-case-mock'
import type { AuditEventDetailStoreDependencies } from '@/feature/management-user/ui/screens/management/audit/detail/audit-event-detail-store'

export const auditEventDetailDependenciesMock = (
  overrides?: Partial<AuditEventDetailStoreDependencies>
): AuditEventDetailStoreDependencies => {
  const getAuditEventUseCase = new GetAuditEventUseCaseMock()

  return {
    eventId: createTestAuditEventPrivate().id ?? toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID),
    getAuditEventUseCase,
    onBack: () => {},
    ...overrides
  }
}

import { createTestAuditEventPrivate, TEST_AUDIT_EVENT_ID, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { GetAuditEventUseCaseMock } from '@/mock/usecase/audit/get-audit-event-use-case-mock'
import type { AuditEventDetailStoreDependencies } from '@/ui/screens/management/audit/detail/AuditEventDetailStore'

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

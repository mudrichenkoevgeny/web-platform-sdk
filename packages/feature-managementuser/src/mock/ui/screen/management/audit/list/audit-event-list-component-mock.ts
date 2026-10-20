import { GetAuditEventsUseCaseMock } from '@/mock/usecase/audit/get-audit-events-use-case-mock'
import type { AuditEventListStoreDependencies } from '@/ui/screens/management/audit/list/AuditEventListStore'

export const auditEventListDependenciesMock = (
  overrides?: Partial<AuditEventListStoreDependencies>
): AuditEventListStoreDependencies => {
  const getAuditEventsUseCase = new GetAuditEventsUseCaseMock()

  return {
    getAuditEventsUseCase,
    onNavigateToEventDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}

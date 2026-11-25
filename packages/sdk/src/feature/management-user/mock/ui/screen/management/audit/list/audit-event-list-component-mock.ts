import { GetAuditEventsUseCaseMock } from '@/feature/management-user/mock/usecase/audit/get-audit-events-use-case-mock'
import type { AuditEventListStoreDependencies } from '@/feature/management-user/ui/screens/management/audit/list/audit-event-list-store'

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

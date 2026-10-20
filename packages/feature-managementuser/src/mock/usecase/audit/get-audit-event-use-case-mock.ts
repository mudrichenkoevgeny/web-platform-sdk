import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuditEventPrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEventId, AuditEventPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { GetAuditEventUseCase } from '@/usecase/audit/get-audit-event-use-case'
import { ManagementAuditRepositoryMock } from '@/mock/audit/repository/management-audit-repository-mock'

/** Mock implementation of {@link GetAuditEventUseCase}. */
export class GetAuditEventUseCaseMock extends GetAuditEventUseCase {
  public resultProvider: (eventId: AuditEventId) => Promise<AppResult<AuditEventPrivate, AppError>> =
    async () => appResultSuccess(createTestAuditEventPrivate())

  public constructor() {
    super(new ManagementAuditRepositoryMock())
  }

  public override async execute(eventId: AuditEventId): Promise<AppResult<AuditEventPrivate, AppError>> {
    return this.resultProvider(eventId)
  }
}

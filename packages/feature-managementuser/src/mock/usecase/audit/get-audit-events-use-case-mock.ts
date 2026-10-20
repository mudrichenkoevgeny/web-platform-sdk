import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestAuditEventSummaryList, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import type { AuditEventSummary, ManagementAuditEventListParams, PagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'
import { ManagementAuditRepositoryMock } from '@/mock/audit/repository/management-audit-repository-mock'

/** Mock implementation of {@link GetAuditEventsUseCase}. */
export class GetAuditEventsUseCaseMock extends GetAuditEventsUseCase {
  public resultProvider: (
    params?: ManagementAuditEventListParams
  ) => Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> = async () =>
    appResultSuccess(
      createTestPagedResult({
        items: createTestAuditEventSummaryList(2)
      })
    )

  public constructor() {
    super(new ManagementAuditRepositoryMock())
  }

  public override async execute(
    params?: ManagementAuditEventListParams
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> {
    return this.resultProvider(params)
  }
}

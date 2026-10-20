import { createTestAuditEventPrivate, createTestAuditEventSummaryList, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventId,
  AuditEventPrivate,
  AuditEventSummary,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'

/** Mock implementation of {@link ManagementAuditRepository}. */
export class ManagementAuditRepositoryMock implements ManagementAuditRepository {
  public getAuditEventsResultProvider: (
    params?: ManagementAuditEventListParams | null
  ) => Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> = async () =>
    appResultSuccess(
      createTestPagedResult({
        items: createTestAuditEventSummaryList(2)
      })
    )

  public getAuditEventResultProvider: (
    eventId: AuditEventId
  ) => Promise<AppResult<AuditEventPrivate, AppError>> = async () =>
    appResultSuccess(createTestAuditEventPrivate())

  public async getAuditEvents(
    params?: ManagementAuditEventListParams | null
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> {
    return this.getAuditEventsResultProvider(params)
  }

  public async getAuditEvent(eventId: AuditEventId): Promise<AppResult<AuditEventPrivate, AppError>> {
    return this.getAuditEventResultProvider(eventId)
  }
}

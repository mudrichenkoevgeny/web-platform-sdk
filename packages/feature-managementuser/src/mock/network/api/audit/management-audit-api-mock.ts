import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventId,
  AuditEventPrivatePayload,
  AuditEventSummaryPayload,
  ManagementAuditEventDetailParams,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import { createTestAuditEventPrivatePayload, createTestAuditEventSummaryPayloadList, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditApi } from '@/network/api/audit/management-audit-api'

/** Mock implementation of {@link ManagementAuditApi}. */
export class ManagementAuditApiMock implements ManagementAuditApi {
  public getAuditEventsResult: AppResult<PagedResult<AuditEventSummaryPayload>, AppError> = appResultSuccess(
    createTestPagedResult({ items: createTestAuditEventSummaryPayloadList(2) })
  )
  public getAuditEventResult: AppResult<AuditEventPrivatePayload, AppError> = appResultSuccess(
    createTestAuditEventPrivatePayload()
  )

  public lastListParams: ManagementAuditEventListParams | null | undefined = null
  public lastDetailParams: ManagementAuditEventDetailParams | AuditEventId | string | null = null

  public async getAuditEvents(
    params?: ManagementAuditEventListParams | null
  ): Promise<AppResult<PagedResult<AuditEventSummaryPayload>, AppError>> {
    this.lastListParams = params
    return this.getAuditEventsResult
  }

  public async getAuditEvent(
    params: ManagementAuditEventDetailParams | AuditEventId | string
  ): Promise<AppResult<AuditEventPrivatePayload, AppError>> {
    this.lastDetailParams = params
    return this.getAuditEventResult
  }
}

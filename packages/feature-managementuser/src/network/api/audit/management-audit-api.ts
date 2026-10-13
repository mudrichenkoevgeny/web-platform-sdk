import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventPrivatePayload,
  AuditEventSummaryPayload,
  ManagementAuditEventDetailParams,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'

/** Network API contract for administrative audit log operations. */
export interface ManagementAuditApi {
  /**
   * Retrieves a paginated list of audit events based on parameters.
   *
   * @param params - Management audit event list parameters
   * @returns Paginated result containing audit event summary payloads, or a failure
   */
  getAuditEvents(
    params?: ManagementAuditEventListParams | null
  ): Promise<AppResult<PagedResult<AuditEventSummaryPayload>, AppError>>

  /**
   * Retrieves specific audit event details by ID or detail params.
   *
   * @param params - Audit event detail parameters or unique event ID string
   * @returns Audit event private payload, or a failure
   */
  getAuditEvent(
    params: ManagementAuditEventDetailParams | string
  ): Promise<AppResult<AuditEventPrivatePayload, AppError>>
}

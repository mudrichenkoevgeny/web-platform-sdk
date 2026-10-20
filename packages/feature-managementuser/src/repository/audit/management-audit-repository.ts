import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventId,
  AuditEventPrivate,
  AuditEventSummary,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Repository contract providing access to administrative audit logs and events.
 */
export interface ManagementAuditRepository {
  /**
   * Retrieves a paginated list of domain audit event summaries.
   *
   * @param params - Management audit event list parameters
   * @returns Paginated result containing domain audit event summaries, or a failure
   */
  getAuditEvents(
    params?: ManagementAuditEventListParams | null
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>>

  /**
   * Retrieves specific domain audit event details by ID.
   *
   * @param eventId - Unique audit event identifier
   * @returns Domain audit event private details, or a failure
   */
  getAuditEvent(eventId: AuditEventId): Promise<AppResult<AuditEventPrivate, AppError>>
}

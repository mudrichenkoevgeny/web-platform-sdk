import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEventPrivatePayload,
  AuditEventSortBy,
  AuditEventSummaryPayload,
  AuditStatus,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'

/** Network API contract for administrative audit log operations. */
export interface ManagementAuditApi {
  /**
   * Retrieves a paginated list of audit events.
   *
   * @param pageNumber - One-based page index
   * @param pageSize - Maximum items returned per page
   * @param sortBy - Field to sort by
   * @param sortOrder - Sorting direction
   * @param actorIds - Filters by actor IDs
   * @param actorTypes - Filters by actor types
   * @param actorUserRoles - Filters by actor user roles
   * @param actions - Filters by action strings
   * @param resources - Filters by resource strings
   * @param resourceIds - Filters by resource IDs
   * @param statuses - Filters by audit status
   * @param messages - Filters by message substrings
   * @returns Paginated result containing audit event summary payloads, or a failure
   */
  getAuditEvents(
    pageNumber?: number | null,
    pageSize?: number | null,
    sortBy?: AuditEventSortBy | null,
    sortOrder?: SortOrder | null,
    actorIds?: string[] | null,
    actorTypes?: AuditActorType[] | null,
    actorUserRoles?: UserRole[] | null,
    actions?: string[] | null,
    resources?: string[] | null,
    resourceIds?: string[] | null,
    statuses?: AuditStatus[] | null,
    messages?: string[] | null
  ): Promise<AppResult<PagedResult<AuditEventSummaryPayload>, AppError>>

  /**
   * Retrieves specific audit event details by ID.
   *
   * @param eventId - Unique audit event identifier string
   * @returns Audit event private payload, or a failure
   */
  getAuditEvent(eventId: string): Promise<AppResult<AuditEventPrivatePayload, AppError>>
}

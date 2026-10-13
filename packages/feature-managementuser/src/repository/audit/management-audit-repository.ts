import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEventPrivate,
  AuditEventSortBy,
  AuditEventSummary,
  AuditStatus,
  ManagementAuditEventListParams,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Repository contract providing access to administrative audit logs and events.
 */
export interface ManagementAuditRepository {
  /**
   * Retrieves a paginated list of domain audit event summaries.
   *
   * @param params - Management audit event list parameters or pageNumber
   * @returns Paginated result containing domain audit event summaries, or a failure
   */
  getAuditEvents(
    params?: ManagementAuditEventListParams | number | null,
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
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>>

  /**
   * Retrieves specific domain audit event details by ID.
   *
   * @param eventId - Unique audit event identifier string
   * @returns Domain audit event private details, or a failure
   */
  getAuditEvent(eventId: string): Promise<AppResult<AuditEventPrivate, AppError>>
}


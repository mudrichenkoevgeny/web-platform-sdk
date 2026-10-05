import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEvent,
  AuditEventSortBy,
  AuditStatus,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditRepository } from '@/repository/audit/ManagementAuditRepository'

/** Parameters for retrieving administrative audit events. */
export interface GetAuditEventsParams {
  pageNumber?: number | null
  pageSize?: number | null
  sortBy?: AuditEventSortBy | null
  sortOrder?: SortOrder | null
  actorIds?: string[] | null
  actorTypes?: AuditActorType[] | null
  actorUserRoles?: UserRole[] | null
  actions?: string[] | null
  resources?: string[] | null
  resourceIds?: string[] | null
  statuses?: AuditStatus[] | null
  messages?: string[] | null
}

/** Returns a paginated list of audit events for administrative purposes. */
export class GetAuditEventsUseCase {
  /**
   * Constructs a new {@link GetAuditEventsUseCase}.
   *
   * @param managementAuditRepository - Administrative audit repository
   */
  public constructor(private readonly managementAuditRepository: ManagementAuditRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Query and filter parameters
   * @returns Paginated result containing audit events, or a failure
   */
  public async execute(params?: GetAuditEventsParams): Promise<AppResult<PagedResult<AuditEvent>, AppError>> {
    return this.managementAuditRepository.getAuditEvents(
      params?.pageNumber,
      params?.pageSize,
      params?.sortBy,
      params?.sortOrder,
      params?.actorIds,
      params?.actorTypes,
      params?.actorUserRoles,
      params?.actions,
      params?.resources,
      params?.resourceIds,
      params?.statuses,
      params?.messages
    )
  }
}

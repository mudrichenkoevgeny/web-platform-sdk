import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEvent,
  AuditEventSortBy,
  AuditStatus,
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { toAuditEvent } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditApi } from '@/network/api/audit/ManagementAuditApi'
import type { ManagementAuditRepository } from '@/repository/audit/ManagementAuditRepository'

/**
 * Implementation of {@link ManagementAuditRepository}.
 */
export class ManagementAuditRepositoryImpl implements ManagementAuditRepository {
  /**
   * Constructs a new {@link ManagementAuditRepositoryImpl}.
   *
   * @param managementAuditApi - Network API source
   * @param compositeActionTypeParser - Parser for audit action types
   * @param compositeResourceTypeParser - Parser for audit resource types
   * @param compositeMetadataKeyParser - Parser for audit metadata keys
   */
  public constructor(
    private readonly managementAuditApi: ManagementAuditApi,
    private readonly compositeActionTypeParser: CompositeAuditActionTypeParser,
    private readonly compositeResourceTypeParser: CompositeAuditResourceTypeParser,
    private readonly compositeMetadataKeyParser: CompositeAuditMetadataKeyParser
  ) {}

  public async getAuditEvents(
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
  ): Promise<AppResult<PagedResult<AuditEvent>, AppError>> {
    const result = await this.managementAuditApi.getAuditEvents(
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      actorIds,
      actorTypes,
      actorUserRoles,
      actions,
      resources,
      resourceIds,
      statuses,
      messages
    )
    return mapSuccess(result, (pagedPayload) => ({
      ...pagedPayload,
      items: pagedPayload.items.map((payload) =>
        toAuditEvent(
          payload,
          this.compositeActionTypeParser,
          this.compositeResourceTypeParser,
          this.compositeMetadataKeyParser
        )
      )
    }))
  }

  public async getAuditEvent(eventId: string): Promise<AppResult<AuditEvent, AppError>> {
    const result = await this.managementAuditApi.getAuditEvent(eventId)
    return mapSuccess(result, (payload) =>
      toAuditEvent(
        payload,
        this.compositeActionTypeParser,
        this.compositeResourceTypeParser,
        this.compositeMetadataKeyParser
      )
    )
  }
}

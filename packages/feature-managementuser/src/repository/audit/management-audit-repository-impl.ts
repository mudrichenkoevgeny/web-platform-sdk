import { mapSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEventPrivate,
  AuditEventSortBy,
  AuditEventSummary,
  AuditStatus,
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import { toAuditEventPrivate, toAuditEventSummary } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditApi } from '@/network/api/audit/management-audit-api'
import type { ManagementAuditRepository } from '@/repository/audit/management-audit-repository'

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
  ): Promise<AppResult<PagedResult<AuditEventSummary>, AppError>> {
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
        toAuditEventSummary(
          payload,
          this.compositeActionTypeParser,
          this.compositeResourceTypeParser
        )
      )
    }))
  }

  public async getAuditEvent(eventId: string): Promise<AppResult<AuditEventPrivate, AppError>> {
    const result = await this.managementAuditApi.getAuditEvent(eventId)
    return mapSuccess(result, (payload) =>
      toAuditEventPrivate(
        payload,
        this.compositeActionTypeParser,
        this.compositeResourceTypeParser,
        this.compositeMetadataKeyParser
      )
    )
  }
}

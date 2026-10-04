import { callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditActorType,
  AuditEventPayload,
  AuditEventSortBy,
  AuditStatus,
  PagedResult,
  SortOrder,
  UserRole
} from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditApiPaths,
  AuditFilterValues,
  ListingParamNames,
  ManagementAuditRoutes
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditApi } from '@/network/api/audit/ManagementAuditApi'

/** {@link ManagementAuditApi} implementation backed by {@link HttpClient}. */
export class FetchManagementAuditApi implements ManagementAuditApi {
  /**
   * Constructs a new {@link FetchManagementAuditApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

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
  ): Promise<AppResult<PagedResult<AuditEventPayload>, AppError>> {
    const query = new URLSearchParams()
    if (pageNumber != null) query.append(ListingParamNames.PAGE_NUMBER, String(pageNumber))
    if (pageSize != null) query.append(ListingParamNames.PAGE_SIZE, String(pageSize))
    if (sortBy != null) query.append(ListingParamNames.SORT_BY, String(sortBy))
    if (sortOrder != null) query.append(ListingParamNames.SORT_ORDER, String(sortOrder))

    if (actorIds) {
      actorIds.forEach((id) => query.append(AuditFilterValues.AuditEventFilterValues.ACTOR_ID, id))
    }
    if (actorTypes) {
      actorTypes.forEach((type) => query.append(AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE, String(type)))
    }
    if (actorUserRoles) {
      actorUserRoles.forEach((role) => query.append(AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE, String(role)))
    }
    if (actions) {
      actions.forEach((action) => query.append(AuditFilterValues.AuditEventFilterValues.ACTION, action))
    }
    if (resources) {
      resources.forEach((resource) => query.append(AuditFilterValues.AuditEventFilterValues.RESOURCE, resource))
    }
    if (resourceIds) {
      resourceIds.forEach((id) => query.append(AuditFilterValues.AuditEventFilterValues.RESOURCE_ID, id))
    }
    if (statuses) {
      statuses.forEach((status) => query.append(AuditFilterValues.AuditEventFilterValues.STATUS, String(status)))
    }
    if (messages) {
      messages.forEach((msg) => query.append(AuditFilterValues.AuditEventFilterValues.MESSAGE, msg))
    }

    const queryString = query.toString()
    const path = queryString
      ? `${ManagementAuditRoutes.GET_AUDIT_EVENTS}?${queryString}`
      : ManagementAuditRoutes.GET_AUDIT_EVENTS

    return callResult(() => this.client.request<PagedResult<AuditEventPayload>>(path))
  }

  public async getAuditEvent(eventId: string): Promise<AppResult<AuditEventPayload, AppError>> {
    const path = ManagementAuditRoutes.GET_AUDIT_EVENT.replace(`{${AuditApiPaths.EVENT_ID}}`, eventId)
    return callResult(() => this.client.request<AuditEventPayload>(path))
  }
}

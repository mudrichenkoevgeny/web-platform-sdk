import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  AuditEventId,
  AuditEventPrivatePayload,
  AuditEventSummaryPayload,
  ManagementAuditEventDetailParams,
  ManagementAuditEventListParams,
  PagedResult
} from '@mudrichenkoevgeny/shared-foundation'
import {
  AuditApiPaths,
  auditEventPrivatePayloadSchema,
  auditEventSummaryPayloadSchema,
  ManagementAuditRoutes,
  pagedResultSchema
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementAuditApi } from '@/network/api/audit/management-audit-api'

/** {@link ManagementAuditApi} implementation backed by {@link HttpClient}. */
export class FetchManagementAuditApi implements ManagementAuditApi {
  /**
   * Constructs a new {@link FetchManagementAuditApi}.
   *
   * @param client - Network HTTP client
   */
  public constructor(private readonly client: HttpClient) {}

  public async getAuditEvents(
    params?: ManagementAuditEventListParams | null
  ): Promise<AppResult<PagedResult<AuditEventSummaryPayload>, AppError>> {
    const path = appendQueryParamsToPath(
      ManagementAuditRoutes.GET_AUDIT_EVENTS,
      params
    )
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return pagedResultSchema(auditEventSummaryPayloadSchema).parse(raw)
    })
  }

  public async getAuditEvent(
    params: ManagementAuditEventDetailParams | AuditEventId | string
  ): Promise<AppResult<AuditEventPrivatePayload, AppError>> {
    const eventId = typeof params === 'string' ? params : params.eventId
    if (!eventId) {
      return callResult(async () => {
        throw new Error('Event ID is required')
      })
    }
    const basePath = ManagementAuditRoutes.GET_AUDIT_EVENT.replace(`{${AuditApiPaths.EVENT_ID}}`, eventId)
    let queryParams: Record<string, unknown> | null = null
    if (typeof params !== 'string' && params) {
      const { eventId: _ignored, ...rest } = params
      queryParams = rest
    }
    const path = appendQueryParamsToPath(basePath, queryParams)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return auditEventPrivatePayloadSchema.parse(raw)
    })
  }
}

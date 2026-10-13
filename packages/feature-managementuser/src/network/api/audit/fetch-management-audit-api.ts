import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
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
    params: ManagementAuditEventDetailParams | string
  ): Promise<AppResult<AuditEventPrivatePayload, AppError>> {
    const eventId = typeof params === 'string' ? params : params.eventId
    if (!eventId) {
      return callResult(async () => {
        throw new Error('Event ID is required')
      })
    }
    const basePath = ManagementAuditRoutes.GET_AUDIT_EVENT.replace(`{${AuditApiPaths.EVENT_ID}}`, eventId)
    const path = appendQueryParamsToPath(basePath, typeof params === 'string' ? null : params)
    return callResult(async () => {
      const raw = await this.client.request<unknown>(path)
      return auditEventPrivatePayloadSchema.parse(raw)
    })
  }
}

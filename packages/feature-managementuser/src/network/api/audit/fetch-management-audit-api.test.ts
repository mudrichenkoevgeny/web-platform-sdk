import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import {
  createTestAuditEventPrivatePayload,
  ManagementAuditRoutes,
  ManagementAuditEventListParamsParser,
  SortOrder,
  TEST_AUDIT_EVENT_ID,
  TEST_USER_ID,
  toAuditEventIdOrThrow,
  createTestPagedResult,
  createTestPagedResultPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementAuditApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementAuditApi

  const auditEventsPagedPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementAuditApi(mockHttpClient)
  })

  it('dispatches getAuditEvents request with query params', async () => {
    const expectedAuditEventsPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(auditEventsPagedPayload)

    const auditEventListParams = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      actorIds: [],
      actorTypes: [],
      actorUserRoles: [],
      actions: [],
      resources: [],
      resourceIds: [],
      statuses: [],
      messages: []
    }
    const auditEventsResult = await api.getAuditEvents(auditEventListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementAuditRoutes.GET_AUDIT_EVENTS,
      ManagementAuditEventListParamsParser.toQueryMap(auditEventListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(auditEventsResult).toEqual({ success: true, data: expectedAuditEventsPagedResult })
  })

  it('formats actorIds into actor_id query parameter', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(auditEventsPagedPayload)

    const auditEventListParams = { actorIds: [TEST_USER_ID] }
    await api.getAuditEvents(auditEventListParams)

    const expectedUrl = appendQueryParamsToPath(
      ManagementAuditRoutes.GET_AUDIT_EVENTS,
      ManagementAuditEventListParamsParser.toQueryMap(auditEventListParams)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
  })

  it('dispatches getAuditEvent request', async () => {
    const mockAuditEventPrivatePayload = createTestAuditEventPrivatePayload({ id: toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockAuditEventPrivatePayload)

    const auditEventResult = await api.getAuditEvent(TEST_AUDIT_EVENT_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuditRoutes.GET_AUDIT_EVENT.replace('{event_id}', TEST_AUDIT_EVENT_ID)
    )
    expect(auditEventResult).toEqual({ success: true, data: mockAuditEventPrivatePayload })
  })

  it('returns failure result when eventId is empty', async () => {
    const auditEventResult = await api.getAuditEvent('')

    expect(auditEventResult.success).toBe(false)
    if (!auditEventResult.success) {
      expect(auditEventResult.error.code).toBeDefined()
    }
  })
})

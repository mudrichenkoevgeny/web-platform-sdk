import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import { createTestAuditEventPrivatePayload, ManagementAuditRoutes, ManagementAuditEventListParamsParser, SortOrder, TEST_AUDIT_EVENT_ID, TEST_USER_ID, toAuditEventIdOrThrow, createTestPagedResultPayload, createTestPagedResult } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementAuditApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementAuditApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementAuditApi(mockHttpClient)
  })

  it('dispatches getAuditEvents request with query params', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    const expectedAuditEventsPagedResult = createTestPagedResult({ pageSize: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = {
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
    const result = await api.getAuditEvents(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementAuditRoutes.GET_AUDIT_EVENTS,
      ManagementAuditEventListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedAuditEventsPagedResult })
  })

  it('formats actorIds into actor_id query parameter', async () => {
    const mockPayload = createTestPagedResultPayload({ page_size: 10 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const params = { actorIds: [TEST_USER_ID] }
    await api.getAuditEvents(params)

    const expectedUrl = appendQueryParamsToPath(
      ManagementAuditRoutes.GET_AUDIT_EVENTS,
      ManagementAuditEventListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
  })

  it('dispatches getAuditEvent request', async () => {
    const mockPayload = createTestAuditEventPrivatePayload({ id: toAuditEventIdOrThrow(TEST_AUDIT_EVENT_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getAuditEvent(TEST_AUDIT_EVENT_ID)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuditRoutes.GET_AUDIT_EVENT.replace('{event_id}', TEST_AUDIT_EVENT_ID)
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('returns failure result when eventId is empty', async () => {
    const result = await api.getAuditEvent('')

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBeDefined()
    }
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import { ManagementAuditRoutes, SortOrder, toAuditEventIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { auditEventPrivatePayloadMock, pagedResultPayloadMock } from '@/mock'

describe('FetchManagementAuditApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementAuditApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    mockHttpClient.request = vi.fn() as any
    api = new FetchManagementAuditApi(mockHttpClient)
  })

  it('dispatches getAuditEvents request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedAuditEventsPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

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

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementAuditRoutes.GET_AUDIT_EVENTS)
    )
    expect(result).toEqual({ success: true, data: expectedAuditEventsPagedResult })
  })

  it('formats actorIds into actor_id query parameter', async () => {
    const mockPayload = pagedResultPayloadMock()
    mockHttpClient.request.mockResolvedValue(mockPayload)

    await api.getAuditEvents({
      actorIds: ['usr_123']
    })

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('actor_id=usr_123')
    )
  })

  it('dispatches getAuditEvent request', async () => {
    const mockPayload = auditEventPrivatePayloadMock({ id: toAuditEventIdOrThrow('550e8400-e29b-41d4-a716-446655440000') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const result = await api.getAuditEvent('550e8400-e29b-41d4-a716-446655440000')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuditRoutes.GET_AUDIT_EVENT.replace('{event_id}', '550e8400-e29b-41d4-a716-446655440000')
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

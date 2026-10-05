import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementAuditApi } from '@/network/api/audit/fetch-management-audit-api'
import { ManagementAuditRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementAuditApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementAuditApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementAuditApi(mockHttpClient)
  })

  it('dispatches getAuditEvents request with query params', async () => {
    const dummyPayload = { items: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getAuditEvents(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementAuditRoutes.GET_AUDIT_EVENTS)
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches getAuditEvent request', async () => {
    const dummyPayload = { id: 'evt_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getAuditEvent('evt_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementAuditRoutes.GET_AUDIT_EVENT.replace('{event_id}', 'evt_1')
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})

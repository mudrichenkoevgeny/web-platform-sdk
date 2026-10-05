import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenUserApi } from '@/network/api/user/fetch-open-user-api'
import { OpenUserRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenUserApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchOpenUserApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchOpenUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    const dummyPayload = { id: 'usr_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.GET_USER
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches scheduleUserDeletion request', async () => {
    const dummyPayload = { id: 'usr_1', account_status: 'PENDING_DELETION' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.scheduleUserDeletion()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.SCHEDULE_DELETION,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches restoreUser request', async () => {
    const dummyPayload = { id: 'usr_1', account_status: 'ACTIVE' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.restoreUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.RESTORE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })
})

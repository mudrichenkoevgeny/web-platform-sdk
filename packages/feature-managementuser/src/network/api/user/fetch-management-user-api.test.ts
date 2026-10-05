import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementUserApi } from '@/network/api/user/fetch-management-user-api'
import { ManagementUserRoutes, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementUserApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementUserApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementUserApi(mockHttpClient)
  })

  it('dispatches createUser request', async () => {
    const dummyPayload = { id: 'usr_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const request = { email: 'user@example.com', password: 'secret' } as any
    const result = await api.createUser(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementUserRoutes.CREATE_USER,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches getUsers request with query params', async () => {
    const dummyPayload = { items: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUsers(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementUserRoutes.GET_USERS)
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches getUser request', async () => {
    const dummyPayload = { id: 'usr_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.getUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_id=usr_1')
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches updateUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const request = { authority_level: 10 } as any
    const result = await api.updateUser(userId, request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_id=usr_1'),
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches deleteUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteUser(userId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_id=usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })
})

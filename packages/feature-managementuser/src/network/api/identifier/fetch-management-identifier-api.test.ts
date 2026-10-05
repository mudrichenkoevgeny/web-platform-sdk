import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementIdentifierApi } from '@/network/api/identifier/fetch-management-identifier-api'
import { ManagementIdentifierRoutes, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementIdentifierApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementIdentifierApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementIdentifierApi(mockHttpClient)
  })

  it('dispatches getIdentifiers request with query params', async () => {
    const dummyPayload = { items: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getIdentifiers(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(ManagementIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches getIdentifier request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getIdentifier('ident_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('user_identifier_id=ident_1')
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches deleteIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifier(userId, 'ident_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches deleteIdentifierPassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const userId = toUserIdOrThrow('usr_1')
    const result = await api.deleteIdentifierPassword(userId, 'ident_1')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining('usr_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })
})

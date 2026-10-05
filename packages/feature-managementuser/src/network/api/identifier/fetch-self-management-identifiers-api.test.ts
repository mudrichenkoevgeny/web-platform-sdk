import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import { SelfManagementIdentifierRoutes, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchSelfManagementIdentifiersApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchSelfManagementIdentifiersApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchSelfManagementIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const dummyPayload = { id: 'ident_1' } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.getUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', 'ident_1')
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const dummyPayload = { items: [] } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getUserIdentifiers(1, 10)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(SelfManagementIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ success: true, data: dummyPayload })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { email: 'admin@example.com', old_password: 'old', new_password: 'new' }
    const result = await api.emailChangePassword(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})

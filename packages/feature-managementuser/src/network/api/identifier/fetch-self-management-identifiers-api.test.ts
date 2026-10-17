import { describe, it, expect, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchSelfManagementIdentifiersApi } from '@/network/api/identifier/fetch-self-management-identifiers-api'
import { SelfManagementIdentifierRoutes, SortOrder, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock'

describe('FetchSelfManagementIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchSelfManagementIdentifiersApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    mockHttpClient.request = vi.fn() as any
    api = new FetchSelfManagementIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const mockPayload = userIdentifierPayloadMock({ id: toUserIdentifierIdOrThrow('ident_1') })
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.getUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', 'ident_1')
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedIdentifierListPagedResult = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    mockHttpClient.request.mockResolvedValue(mockPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    }
    const result = await api.getUserIdentifiers(params)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(SelfManagementIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ success: true, data: expectedIdentifierListPagedResult })
  })

  it('dispatches emailChangePassword request', async () => {
    mockHttpClient.request.mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow('ident_1')
    const request = { old_password: 'old', new_password: 'new' }
    const result = await api.emailChangePassword(identifierId, request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      SelfManagementIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace('{user_identifier_id}', 'ident_1'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})

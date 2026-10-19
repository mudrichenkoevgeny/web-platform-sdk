import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenIdentifiersApi, OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE } from '@/network/api/identifier/fetch-open-identifiers-api'
import { OpenIdentifierRoutes, selfIdentifierListParamsSchema, SortOrder, toUserIdentifierIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPrivatePayloadMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { pagedResultPayloadMock } from '@/mock/network/paged-result-payload-mock'
import { otpConfirmationPayloadMock } from '@/mock/network/otp-confirmation-payload-mock'

describe('FetchOpenIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenIdentifiersApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const mockPayload = userIdentifierPrivatePayloadMock({ id: toUserIdentifierIdOrThrow('ident_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.getUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', 'ident_1')
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const mockPayload = pagedResultPayloadMock()
    const expectedData = { items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getUserIdentifiers(
      selfIdentifierListParamsSchema.parse({
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: SortOrder.DESC,
        userAuthProviders: [],
        identifiers: []
      })
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      expect.stringContaining(OpenIdentifierRoutes.GET_IDENTIFIERS)
    )
    expect(result).toEqual({ success: true, data: expectedData })
  })

  it('dispatches deleteUserIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.deleteUserIdentifier(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.DELETE_IDENTIFIER.replace('{user_identifier_id}', 'ident_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches deletePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const id = toUserIdentifierIdOrThrow('ident_1')
    const result = await api.deletePassword(id)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE.replace('{user_identifier_id}', 'ident_1'),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })

  it('dispatches addUserIdentifierEmail request', async () => {
    const mockPayload = userIdentifierPrivatePayloadMock({ id: toUserIdentifierIdOrThrow('ident_1') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.addUserIdentifierEmail('user@example.com', 'secret', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com', password: 'secret', confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches addUserIdentifierPhone request', async () => {
    const mockPayload = userIdentifierPrivatePayloadMock({ id: toUserIdentifierIdOrThrow('ident_2') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.addUserIdentifierPhone('+1234567890', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890', confirmation_code: '123456' })
      })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches addUserIdentifierExternalAuthProvider request', async () => {
    const mockPayload = userIdentifierPrivatePayloadMock({ id: toUserIdentifierIdOrThrow('ident_3') })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.addUserIdentifierExternalAuthProvider('GOOGLE', 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
      })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches sendAddEmailIdentifierConfirmation request', async () => {
    const mockPayload = otpConfirmationPayloadMock()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.sendAddEmailIdentifierConfirmation('user@example.com')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' })
      })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches sendAddPhoneIdentifierConfirmation request', async () => {
    const mockPayload = otpConfirmationPayloadMock()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.sendAddPhoneIdentifierConfirmation('+1234567890')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: '+1234567890' })
      })
    )
    expect(result).toEqual({ success: true, data: mockPayload })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow('ident-123')
    const result = await api.emailChangePassword(identifierId, 'old', 'new')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace('{user_identifier_id}', identifierId),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ old_password: 'old', new_password: 'new' })
      })
    )
    expect(result).toEqual({ success: true, data: undefined })
  })
})

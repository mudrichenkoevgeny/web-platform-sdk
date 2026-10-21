import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HttpClientMock, appendQueryParamsToPath } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenIdentifiersApi, OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE } from '@/network/api/identifier/fetch-open-identifiers-api'
import {
  createTestUserIdentifierPrivatePayload,
  OpenIdentifierRoutes,
  SelfIdentifierListParamsParser,
  selfIdentifierListParamsSchema,
  SortOrder,
  TEST_EMAIL,
  TEST_IDENTIFIER_ID,
  TEST_PHONE,
  toUserIdentifierIdOrThrow,
  createTestPagedResult,
  createTestPagedResultPayload,
  createTestOtpConfirmationPayload
} from '@mudrichenkoevgeny/shared-foundation'

describe('FetchOpenIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenIdentifiersApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request', async () => {
    const identifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPayload)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const identifierResult = await api.getUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.GET_IDENTIFIER.replace('{user_identifier_id}', TEST_IDENTIFIER_ID)
    )
    expect(identifierResult).toEqual({ success: true, data: identifierPayload })
  })

  it('dispatches getUserIdentifiers request with query params', async () => {
    const userIdentifiersPagedPayload = createTestPagedResultPayload({
      items: [],
      total_count: 0,
      page_number: 1,
      page_size: 10,
      total_pages: 0
    })
    const expectedIdentifiersPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(userIdentifiersPagedPayload)

    const params = selfIdentifierListParamsSchema.parse({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: SortOrder.DESC,
      userAuthProviders: [],
      identifiers: []
    })
    const identifiersResult = await api.getUserIdentifiers(params)

    const expectedUrl = appendQueryParamsToPath(
      OpenIdentifierRoutes.GET_IDENTIFIERS,
      SelfIdentifierListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(identifiersResult).toEqual({ success: true, data: expectedIdentifiersPagedResult })
  })

  it('dispatches deleteUserIdentifier request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const deleteIdentifierResult = await api.deleteUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.DELETE_IDENTIFIER.replace('{user_identifier_id}', TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deleteIdentifierResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches deletePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const deletePasswordResult = await api.deletePassword(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE.replace('{user_identifier_id}', TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(deletePasswordResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches addUserIdentifierEmail request', async () => {
    const emailIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(emailIdentifierPayload)

    const addEmailResult = await api.addUserIdentifierEmail(TEST_EMAIL, 'secret', '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL, password: 'secret', confirmation_code: '123456' })
      })
    )
    expect(addEmailResult).toEqual({ success: true, data: emailIdentifierPayload })
  })

  it('dispatches addUserIdentifierPhone request', async () => {
    const phoneIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(phoneIdentifierPayload)

    const addPhoneResult = await api.addUserIdentifierPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' })
      })
    )
    expect(addPhoneResult).toEqual({ success: true, data: phoneIdentifierPayload })
  })

  it('dispatches addUserIdentifierExternalAuthProvider request', async () => {
    const externalAuthIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID) })
    vi.mocked(mockHttpClient.request).mockResolvedValue(externalAuthIdentifierPayload)

    const addExternalAuthResult = await api.addUserIdentifierExternalAuthProvider('GOOGLE', 'token123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'token123' })
      })
    )
    expect(addExternalAuthResult).toEqual({ success: true, data: externalAuthIdentifierPayload })
  })

  it('dispatches sendAddEmailIdentifierConfirmation request', async () => {
    const emailConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(emailConfirmationPayload)

    const sendEmailConfirmationResult = await api.sendAddEmailIdentifierConfirmation(TEST_EMAIL)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL })
      })
    )
    expect(sendEmailConfirmationResult).toEqual({ success: true, data: emailConfirmationPayload })
  })

  it('dispatches sendAddPhoneIdentifierConfirmation request', async () => {
    const phoneConfirmationPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(phoneConfirmationPayload)

    const sendPhoneConfirmationResult = await api.sendAddPhoneIdentifierConfirmation(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE })
      })
    )
    expect(sendPhoneConfirmationResult).toEqual({ success: true, data: phoneConfirmationPayload })
  })

  it('dispatches emailChangePassword request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
    const changePasswordResult = await api.emailChangePassword(identifierId, 'old', 'new')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace('{user_identifier_id}', identifierId),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ old_password: 'old', new_password: 'new' })
      })
    )
    expect(changePasswordResult).toEqual({ success: true, data: undefined })
  })
})

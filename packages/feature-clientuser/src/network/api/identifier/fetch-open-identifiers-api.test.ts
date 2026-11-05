import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ApiException,
  HttpClientMock,
  isFailure,
  isSuccess,
  ServerError,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork,
  appendQueryParamsToPath
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  OpenIdentifierRoutes,
  SelfIdentifierListParamsParser,
  SortOrder,
  TEST_EMAIL,
  TEST_IDENTIFIER_ID,
  TEST_PHONE,
  UserApiPaths,
  UserAuthProvider,
  createTestApiErrorResponse,
  createTestOtpConfirmationPayload,
  createTestPagedResultPayload,
  createTestUserIdentifierPrivatePayload,
  toUserIdentifierIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenIdentifiersApi, OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE } from './fetch-open-identifiers-api'

describe('FetchOpenIdentifiersApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenIdentifiersApi

  const identifierId = toUserIdentifierIdOrThrow(TEST_IDENTIFIER_ID)
  const identifierPagedPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenIdentifiersApi(mockHttpClient)
  })

  it('dispatches getUserIdentifier request with correct route', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload({ id: identifierId })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.getUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.GET_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID)
    )
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockIdentifierPayload)
    }
  })

  it('dispatches getUserIdentifiers request with formatted query params', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(identifierPagedPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      userAuthProviders: [UserAuthProvider.EMAIL],
      identifiers: [TEST_EMAIL]
    }
    const result = await api.getUserIdentifiers(params)

    const expectedUrl = appendQueryParamsToPath(
      OpenIdentifierRoutes.GET_IDENTIFIERS,
      SelfIdentifierListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteUserIdentifier request with DELETE method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteUserIdentifier(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.DELETE_IDENTIFIER.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deletePassword request with DELETE method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deletePassword(identifierId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OPEN_IDENTIFIER_DELETE_PASSWORD_ROUTE.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches addUserIdentifierEmail request with POST body', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.addUserIdentifierEmail(TEST_EMAIL, 'secret123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EMAIL,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL, password: 'secret123', confirmation_code: '654321' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches addUserIdentifierPhone request with POST body', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.addUserIdentifierPhone(TEST_PHONE, '123456')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_PHONE,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE, confirmation_code: '123456' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches addUserIdentifierExternalAuthProvider request with POST body', async () => {
    const mockIdentifierPayload = createTestUserIdentifierPrivatePayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockIdentifierPayload)

    const result = await api.addUserIdentifierExternalAuthProvider('GOOGLE', 'google-token-123')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.ADD_IDENTIFIER_EXTERNAL_AUTH_PROVIDER,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ auth_provider: 'GOOGLE', external_provider_token: 'google-token-123' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches sendAddEmailIdentifierConfirmation request', async () => {
    const mockOtpPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpPayload)

    const result = await api.sendAddEmailIdentifierConfirmation(TEST_EMAIL)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_EMAIL_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: TEST_EMAIL })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches sendAddPhoneIdentifierConfirmation request', async () => {
    const mockOtpPayload = createTestOtpConfirmationPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockOtpPayload)

    const result = await api.sendAddPhoneIdentifierConfirmation(TEST_PHONE)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.SEND_ADD_PHONE_IDENTIFIER_CONFIRMATION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ phone_number: TEST_PHONE })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches emailChangePassword request with POST body', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.emailChangePassword(identifierId, 'old_pass', 'new_pass')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenIdentifierRoutes.IDENTIFIER_EMAIL_CHANGE_PASSWORD.replace(`{${UserApiPaths.USER_IDENTIFIER_ID}}`, TEST_IDENTIFIER_ID),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ old_password: 'old_pass', new_password: 'new_pass' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'IDENTIFIER_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getUserIdentifier(identifierId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('IDENTIFIER_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getUserIdentifier(identifierId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})

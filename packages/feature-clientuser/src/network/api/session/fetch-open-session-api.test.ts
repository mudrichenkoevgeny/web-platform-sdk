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
  OpenSessionRoutes,
  SelfSessionListParamsParser,
  SortOrder,
  TEST_SESSION_ID,
  createTestApiErrorResponse,
  createTestPagedResult,
  createTestPagedResultPayload,
  createTestUserSessionPrivatePayload,
  toUserSessionIdOrThrow
} from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenSessionApi } from './fetch-open-session-api'

describe('FetchOpenSessionApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenSessionApi

  const sessionId = toUserSessionIdOrThrow(TEST_SESSION_ID)
  const sessionListPayload = createTestPagedResultPayload({
    items: [],
    total_count: 0,
    page_number: 1,
    page_size: 10,
    total_pages: 0
  })

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenSessionApi(mockHttpClient)
  })

  it('dispatches getSessions request with query params', async () => {
    const expectedPagedResult = createTestPagedResult({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10, totalPages: 0 })
    vi.mocked(mockHttpClient.request).mockResolvedValue(sessionListPayload)

    const params = {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at' as const,
      sortOrder: SortOrder.DESC,
      identifiers: [],
      identifierIds: [],
      userAuthProviders: [],
      clientTypes: [],
      userAgents: [],
      ipAddresses: [],
      languages: [],
      deviceIds: [],
      deviceNames: [],
      appVersions: [],
      osVersions: []
    }
    const result = await api.getSessions(params)

    const expectedUrl = appendQueryParamsToPath(
      OpenSessionRoutes.GET_SESSIONS,
      SelfSessionListParamsParser.toQueryMap(params)
    )

    expect(mockHttpClient.request).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual({ success: true, data: expectedPagedResult })
  })

  it('dispatches getSession request', async () => {
    const mockSessionPayload = createTestUserSessionPrivatePayload({ id: sessionId })
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSessionPayload)

    const result = await api.getSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.GET_SESSION.replace('{session_id}', TEST_SESSION_ID)
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches logout request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.logout()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.LOGOUT,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteSession(sessionId)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_SESSION.replace('{session_id}', TEST_SESSION_ID),
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches deleteAllOtherSessions request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue({ deleted_session_ids: ['sess-2'] })

    const result = await api.deleteAllOtherSessions()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.DELETE_ALL_OTHER_SESSIONS,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches reauthenticateSession request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.reauthenticateSession('mfa-token-123', '654321')

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenSessionRoutes.REAUTHENTICATE_SESSION,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ mfa_token: 'mfa-token-123', totp_code: '654321' })
      })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'SESSION_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getSession(sessionId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('SESSION_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getSession(sessionId)

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})

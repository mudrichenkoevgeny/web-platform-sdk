import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  ApiException,
  HttpClientMock,
  isFailure,
  isSuccess,
  ServerError,
  CommonErrorNoInternetConnection,
  CommonErrorNetwork
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  OpenUserRoutes,
  createTestApiErrorResponse,
  createTestUserPrivatePayload
} from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenUserApi } from './fetch-open-user-api'

describe('FetchOpenUserApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenUserApi

  const mockUserPayload = createTestUserPrivatePayload()

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenUserApi(mockHttpClient)
  })

  it('dispatches getUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.getUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.GET_USER
    )
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockUserPayload)
    }
  })

  it('dispatches selfUpdateUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.selfUpdateUser({ nickname: 'new_nick' })

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.UPDATE_USER,
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ nickname: 'new_nick', display_name: null, avatar_file_id: null, birthdate: null }) })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches scheduleUserDeletion request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.scheduleUserDeletion()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.SCHEDULE_DELETION,
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('dispatches restoreUser request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockUserPayload)

    const result = await api.restoreUser()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenUserRoutes.RESTORE_USER,
      expect.objectContaining({ method: 'POST' })
    )
    expect(isSuccess(result)).toBe(true)
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'UNAUTHORIZED', message: 'Unauthorized' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getUser()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('UNAUTHORIZED')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getUser()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})

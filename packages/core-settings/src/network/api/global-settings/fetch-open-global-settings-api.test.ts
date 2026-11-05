import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorContractViolation, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestApiErrorResponse, createTestOpenGlobalSettingsPayload, OpenGlobalSettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'
import { FetchOpenGlobalSettingsApi } from './fetch-open-global-settings-api'

describe('FetchOpenGlobalSettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchOpenGlobalSettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchOpenGlobalSettingsApi(mockHttpClient)
  })

  it('fetches open global settings successfully with correct route and method', async () => {
    const mockPayload = createTestOpenGlobalSettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPayload)

    const result = await api.getOpenGlobalSettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      OpenGlobalSettingsRoutes.GET_OPEN_GLOBAL_SETTINGS,
      expect.objectContaining({ method: 'GET' })
    )
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(mockPayload)
    }
  })

  it('maps ApiException to ServerError on API error response', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'SETTINGS_ERROR', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getOpenGlobalSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('SETTINGS_ERROR')
    }
  })

  it('maps SyntaxError to CommonErrorContractViolation', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new SyntaxError('Bad JSON'))

    const result = await api.getOpenGlobalSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(CommonErrorContractViolation)
    }
  })

  it('maps network TypeError to CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getOpenGlobalSettings()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiException, HttpClientMock, isFailure, isSuccess, ServerError, CommonErrorNoInternetConnection, CommonErrorNetwork } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementStorageRoutes, createTestApiErrorResponse } from '@mudrichenkoevgeny/shared-foundation'
import { FetchManagementStorageApi } from './fetch-management-storage-api'

describe('FetchManagementStorageApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementStorageApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementStorageApi(mockHttpClient)
  })

  it('deletes files batch with POST method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })

    expect(isSuccess(result)).toBe(true)
    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementStorageRoutes.DELETE_FILES_BATCH,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ fileIds: ['file-1', 'file-2'] })
      })
    )
  })

  it('handles ApiException and returns ServerError', async () => {
    const apiErrorResponse = createTestApiErrorResponse({ code: 'FILE_NOT_FOUND', message: 'Not found' })
    vi.mocked(mockHttpClient.request).mockRejectedValue(new ApiException(apiErrorResponse))

    const result = await api.getFileDetail('file-123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(ServerError)
      expect(result.error.code).toBe('FILE_NOT_FOUND')
    }
  })

  it('handles network TypeError and returns CommonErrorNetwork or CommonErrorNoInternetConnection', async () => {
    vi.mocked(mockHttpClient.request).mockRejectedValue(new TypeError('Failed to fetch'))

    const result = await api.getFileDetail('file-123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(
        result.error instanceof CommonErrorNetwork ||
        result.error instanceof CommonErrorNoInternetConnection
      ).toBe(true)
    }
  })
})

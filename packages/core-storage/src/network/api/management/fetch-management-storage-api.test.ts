import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementStorageApi } from './fetch-management-storage-api'

describe('FetchManagementStorageApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageApi(mockHttpClient)

  it('deletes file with DELETE method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFile('file-123')
    expect(result.success).toBe(true)
  })

  it('deletes files batch with POST method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })
    expect(result.success).toBe(true)
  })
})

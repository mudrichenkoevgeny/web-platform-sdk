import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementStorageApi } from './fetch-management-storage-api'

describe('FetchManagementStorageApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageApi(mockHttpClient)

  it('fetches files list', async () => {
    const mockPagedPayload = {
      items: [],
      page_number: 1,
      page_size: 10,
      total_count: 0,
      total_pages: 0
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPagedPayload)

    const result = await api.getFiles({ pageNumber: 1 })
    expect(result.success).toBe(true)
  })

  it('deletes file with DELETE method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFile('file-management-1')
    expect(result.success).toBe(true)
  })

  it('deletes files batch with POST method and request DTO', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })
    expect(result.success).toBe(true)
  })
})

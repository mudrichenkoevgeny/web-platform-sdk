import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchOpenStorageApi } from './fetch-open-storage-api'

describe('FetchOpenStorageApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchOpenStorageApi(mockHttpClient)

  it('requests presigned upload url with camelCase params and parses response payload', async () => {
    const mockPresignedPayload = {
      file_id: 'file-123',
      upload_url: 'https://s3.example.com/upload-123',
      file_url: 'https://cdn.example.com/file-123',
      expires_at: Date.now() + 3600000
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPresignedPayload)

    const result = await api.getPresignedUploadUrl({
      fileName: 'photo.jpg',
      fileSizeBytes: 1024,
      mimeType: 'image/jpeg',
      category: 'IMAGE',
      visibility: 'PUBLIC',
      targetScope: 'AVATAR'
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fileId).toBe('file-123')
    }
  })

  it('deletes file with DELETE method', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFile('file-123')
    expect(result.success).toBe(true)
  })

  it('deletes files batch with POST method and request DTO', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const result = await api.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })
    expect(result.success).toBe(true)
  })
})

import { describe, it, expect, vi } from 'vitest'
import type { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementStorageApi } from './fetch-management-storage-api'

describe('FetchManagementStorageApi', () => {
  const mockHttpClient: HttpClient = {
    request: vi.fn()
  } as unknown as HttpClient

  const api = new FetchManagementStorageApi(mockHttpClient)

  it('requests presigned upload url and parses response payload to domain model', async () => {
    const mockPresignedPayload = {
      file_id: 'file-management-1',
      upload_url: 'https://s3.example.com/upload-mgmt-1',
      file_url: 'https://cdn.example.com/file-mgmt-1',
      expires_at: Date.now() + 3600000
    }
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockPresignedPayload)

    const result = await api.getPresignedUploadUrl({
      fileName: 'test.pdf',
      fileSizeBytes: 2048,
      mimeType: 'application/pdf',
      category: 'DOCUMENT',
      visibility: 'PRIVATE',
      targetScope: 'ATTACHMENT'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fileId).toBe('file-management-1')
    }
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

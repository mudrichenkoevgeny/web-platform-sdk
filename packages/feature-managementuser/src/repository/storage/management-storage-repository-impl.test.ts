import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageApi } from '../../network/api/storage/management-storage-api'
import { ManagementStorageRepositoryImpl } from './management-storage-repository-impl'

describe('ManagementStorageRepositoryImpl', () => {
  const mockApi: ManagementStorageApi = {
    getFiles: vi.fn(),
    getFileDetail: vi.fn(),
    deleteFile: vi.fn(),
    deleteFilesBatch: vi.fn()
  }

  const repository = new ManagementStorageRepositoryImpl(mockApi)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps paged result DTOs to domain models in getFiles', async () => {
    const mockPagedPayload = {
      items: [
        {
          id: 'file-m-1',
          fileName: 'banner.png',
          fileSizeBytes: 2048,
          mimeType: 'image/png',
          category: 'IMAGE',
          fileUrl: 'https://cdn.example.com/file-m-1'
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 1,
      totalCount: 1,
      totalPages: 1
    }
    vi.mocked(mockApi.getFiles).mockResolvedValue(appResultSuccess(mockPagedPayload as any))

    const result = await repository.getFiles({ pageNumber: 1 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.items[0]?.id).toBe('file-m-1')
      expect(result.data.items[0]?.fileName).toBe('banner.png')
    }
  })

  it('maps private file detail DTO to domain model in getFileDetail', async () => {
    const mockPrivatePayload = {
      id: 'file-m-1',
      ownerUserId: 'user-m-1',
      targetScope: 'PROMOTION',
      category: 'IMAGE',
      fileName: 'banner.png',
      fileSizeBytes: 2048,
      mimeType: 'image/png',
      visibility: 'PUBLIC',
      status: 'READY',
      fileUrl: 'https://cdn.example.com/file-m-1',
      createdAtMillis: 1000,
      updatedAtMillis: 2000
    }
    vi.mocked(mockApi.getFileDetail).mockResolvedValue(appResultSuccess(mockPrivatePayload as any))

    const result = await repository.getFileDetail('file-m-1')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe('file-m-1')
    }
  })

  it('delegates deleteFile and deleteFilesBatch to api', async () => {
    vi.mocked(mockApi.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))

    await repository.deleteFile('file-m-1')
    expect(mockApi.deleteFile).toHaveBeenCalledWith('file-m-1')

    await repository.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })
    expect(mockApi.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

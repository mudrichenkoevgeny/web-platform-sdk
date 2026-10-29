import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageApi } from '../../network/api/management/management-storage-api'
import { ManagementStorageRepositoryImpl } from './management-storage-repository-impl'

describe('ManagementStorageRepositoryImpl', () => {
  let mockApi: ManagementStorageApi

  beforeEach(() => {
    mockApi = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates deleteFile and deleteFilesBatch to api', async () => {
    const repository = new ManagementStorageRepositoryImpl(mockApi)
    vi.mocked(mockApi.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))

    await repository.deleteFile('file-123')
    expect(mockApi.deleteFile).toHaveBeenCalledWith('file-123')

    await repository.deleteFilesBatch({ fileIds: ['file-1', 'file-2'] })
    expect(mockApi.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementGetFilesUseCase } from './management-get-files-use-case'
import { ManagementGetFileDetailUseCase } from './management-get-file-detail-use-case'
import { ManagementDeleteFileUseCase } from './management-delete-file-use-case'
import { ManagementDeleteFilesBatchUseCase } from './management-delete-files-batch-use-case'
import type { ManagementStorageRepository } from '@/repository/storage/management-storage-repository'

describe('Management Storage File Use Cases', () => {
  const mockRepo: ManagementStorageRepository = {
    getFiles: vi.fn(),
    getFileDetail: vi.fn(),
    deleteFile: vi.fn(),
    deleteFilesBatch: vi.fn()
  }

  it('ManagementGetFilesUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.getFiles).mockResolvedValue(appResultSuccess({ items: [], pageNumber: 1, pageSize: 10, totalElements: 0, totalPages: 0 }))
    const useCase = new ManagementGetFilesUseCase(mockRepo)

    const pagedFilesResult = await useCase.execute({ pageNumber: 1 })
    expect(pagedFilesResult.success).toBe(true)
    expect(mockRepo.getFiles).toHaveBeenCalledWith({ pageNumber: 1 })
  })

  it('ManagementGetFileDetailUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.getFileDetail).mockResolvedValue(appResultSuccess({ fileId: 'file-mgmt-123' } as any))
    const useCase = new ManagementGetFileDetailUseCase(mockRepo)

    const fileDetailResult = await useCase.execute('file-mgmt-123')
    expect(fileDetailResult.success).toBe(true)
    expect(mockRepo.getFileDetail).toHaveBeenCalledWith('file-mgmt-123')
  })

  it('ManagementDeleteFileUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFileUseCase(mockRepo)

    const deleteResult = await useCase.execute('file-mgmt-123')
    expect(deleteResult.success).toBe(true)
    expect(mockRepo.deleteFile).toHaveBeenCalledWith('file-mgmt-123')
  })

  it('ManagementDeleteFilesBatchUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFilesBatchUseCase(mockRepo)

    const batchDeleteResult = await useCase.execute({ fileIds: ['file-1', 'file-2'] })
    expect(batchDeleteResult.success).toBe(true)
    expect(mockRepo.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

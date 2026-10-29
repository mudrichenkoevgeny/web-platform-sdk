import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageRepository } from '../../repository/management/management-storage-repository'
import { ManagementGetFilesUseCase } from './management-get-files-use-case'
import { ManagementGetFileDetailUseCase } from './management-get-file-detail-use-case'
import { ManagementDeleteFileUseCase } from './management-delete-file-use-case'
import { ManagementDeleteFilesBatchUseCase } from './management-delete-files-batch-use-case'

describe('Management Storage UseCases', () => {
  let repository: ManagementStorageRepository

  beforeEach(() => {
    repository = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates ManagementGetFilesUseCase to repository', async () => {
    vi.mocked(repository.getFiles).mockResolvedValue(
      appResultSuccess({ items: [], pageNumber: 0, pageSize: 10, totalElements: 0, totalCount: 0, totalPages: 0 })
    )
    const useCase = new ManagementGetFilesUseCase(repository)
    const result = await useCase.execute({ pageNumber: 1 })
    expect(result.success).toBe(true)
    expect(repository.getFiles).toHaveBeenCalledWith({ pageNumber: 1 })
  })

  it('delegates ManagementGetFileDetailUseCase to repository', async () => {
    vi.mocked(repository.getFileDetail).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new ManagementGetFileDetailUseCase(repository)
    await useCase.execute('file-123')
    expect(repository.getFileDetail).toHaveBeenCalledWith('file-123')
  })

  it('delegates ManagementDeleteFileUseCase to repository', async () => {
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFileUseCase(repository)
    await useCase.execute('file-123')
    expect(repository.deleteFile).toHaveBeenCalledWith('file-123')
  })

  it('delegates ManagementDeleteFilesBatchUseCase to repository', async () => {
    vi.mocked(repository.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFilesBatchUseCase(repository)
    await useCase.execute({ fileIds: ['file-1', 'file-2'] })
    expect(repository.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

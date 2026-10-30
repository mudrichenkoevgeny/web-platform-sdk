import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageCategory, StorageFileVisibility } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '../../repository/base/storage-repository'
import { GetFilesUseCase } from './get-files-use-case'
import { GetFileDetailUseCase } from './get-file-detail-use-case'
import { UploadFileUseCase } from './upload-file-use-case'
import { DeleteFileUseCase } from './delete-file-use-case'
import { DeleteFilesBatchUseCase } from './delete-files-batch-use-case'

describe('Base Storage UseCases', () => {
  let repository: StorageRepository

  beforeEach(() => {
    repository = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      uploadFile: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates GetFilesUseCase to repository', async () => {
    vi.mocked(repository.getFiles).mockResolvedValue(
      appResultSuccess({ items: [], pageNumber: 0, pageSize: 10, totalElements: 0, totalCount: 0, totalPages: 0 })
    )
    const useCase = new GetFilesUseCase(repository)
    const result = await useCase.execute({ pageNumber: 1 })
    expect(result.success).toBe(true)
    expect(repository.getFiles).toHaveBeenCalledWith({ pageNumber: 1 })
  })

  it('delegates GetFileDetailUseCase to repository', async () => {
    vi.mocked(repository.getFileDetail).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new GetFileDetailUseCase(repository)
    await useCase.execute('file-123')
    expect(repository.getFileDetail).toHaveBeenCalledWith('file-123')
  })

  it('delegates UploadFileUseCase to repository', async () => {
    vi.mocked(repository.uploadFile).mockResolvedValue(appResultSuccess({} as any))
    const useCase = new UploadFileUseCase(repository)
    const file = new File([], 'test.png')
    await useCase.execute({
      file,
      category: StorageCategory.IMAGE,
      visibility: StorageFileVisibility.PUBLIC,
      targetScope: 'AVATAR'
    })
    expect(repository.uploadFile).toHaveBeenCalledWith(file, StorageCategory.IMAGE, StorageFileVisibility.PUBLIC, 'AVATAR', undefined)
  })

  it('delegates DeleteFileUseCase to repository', async () => {
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new DeleteFileUseCase(repository)
    await useCase.execute('file-123')
    expect(repository.deleteFile).toHaveBeenCalledWith('file-123')
  })

  it('delegates DeleteFilesBatchUseCase to repository', async () => {
    vi.mocked(repository.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new DeleteFilesBatchUseCase(repository)
    await useCase.execute({ fileIds: ['file-1', 'file-2'] })
    expect(repository.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

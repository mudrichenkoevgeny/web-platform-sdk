import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { GetFilesUseCase } from './get-files-use-case'
import { GetFileDetailUseCase } from './get-file-detail-use-case'
import { UploadFileUseCase } from './upload-file-use-case'
import { DeleteFileUseCase } from './delete-file-use-case'
import { DeleteFilesBatchUseCase } from './delete-files-batch-use-case'

describe('Storage Use Cases', () => {
  const mockRepo: StorageRepository = {
    getFiles: vi.fn(),
    getFileDetail: vi.fn(),
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    deleteFilesBatch: vi.fn()
  }

  it('GetFilesUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.getFiles).mockResolvedValue(appResultSuccess({ items: [], pageNumber: 1, pageSize: 10, totalElements: 0, totalPages: 0 }))
    const useCase = new GetFilesUseCase(mockRepo)

    const pagedFilesResult = await useCase.execute({ pageNumber: 1 })
    expect(pagedFilesResult.success).toBe(true)
    expect(mockRepo.getFiles).toHaveBeenCalledWith({ pageNumber: 1 })
  })

  it('GetFileDetailUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.getFileDetail).mockResolvedValue(appResultSuccess({ fileId: 'file-123' } as any))
    const useCase = new GetFileDetailUseCase(mockRepo)

    const fileDetailResult = await useCase.execute('file-123')
    expect(fileDetailResult.success).toBe(true)
    expect(mockRepo.getFileDetail).toHaveBeenCalledWith('file-123')
  })

  it('UploadFileUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.uploadFile).mockResolvedValue(appResultSuccess({ fileId: 'file-123' } as any))
    const useCase = new UploadFileUseCase(mockRepo)

    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const uploadResult = await useCase.execute({
      file,
      category: 'IMAGE',
      visibility: 'PUBLIC',
      targetScope: 'AVATAR'
    })

    expect(uploadResult.success).toBe(true)
    expect(mockRepo.uploadFile).toHaveBeenCalledWith(file, 'IMAGE', 'PUBLIC', 'AVATAR', undefined)
  })

  it('DeleteFileUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new DeleteFileUseCase(mockRepo)

    const deleteResult = await useCase.execute('file-123')
    expect(deleteResult.success).toBe(true)
    expect(mockRepo.deleteFile).toHaveBeenCalledWith('file-123')
  })

  it('DeleteFilesBatchUseCase delegates to repository', async () => {
    vi.mocked(mockRepo.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new DeleteFilesBatchUseCase(mockRepo)

    const batchDeleteResult = await useCase.execute({ fileIds: ['file-1', 'file-2'] })
    expect(batchDeleteResult.success).toBe(true)
    expect(mockRepo.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

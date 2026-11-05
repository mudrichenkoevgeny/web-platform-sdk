import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@/repository/base/storage-repository'
import { DeleteFileUseCase } from './delete-file-use-case'

describe('DeleteFileUseCase', () => {
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

  it('delegates deleteFile to repository and returns success', async () => {
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new DeleteFileUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isSuccess(result)).toBe(true)
    expect(repository.deleteFile).toHaveBeenCalledWith('file-123')
  })

  it('returns failure when repository fails to delete file', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new DeleteFileUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

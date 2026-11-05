import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageRepository } from '@/repository/management/management-storage-repository'
import { ManagementDeleteFileUseCase } from './management-delete-file-use-case'

describe('ManagementDeleteFileUseCase', () => {
  let repository: ManagementStorageRepository

  beforeEach(() => {
    repository = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates deleteFile to repository and returns success', async () => {
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFileUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isSuccess(result)).toBe(true)
    expect(repository.deleteFile).toHaveBeenCalledWith('file-123')
  })

  it('returns failure when management delete file fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.deleteFile).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new ManagementDeleteFileUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

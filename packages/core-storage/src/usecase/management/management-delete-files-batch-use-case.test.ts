import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageRepository } from '@/repository/management/management-storage-repository'
import { ManagementDeleteFilesBatchUseCase } from './management-delete-files-batch-use-case'

describe('ManagementDeleteFilesBatchUseCase', () => {
  let repository: ManagementStorageRepository

  beforeEach(() => {
    repository = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates deleteFilesBatch to repository on success', async () => {
    vi.mocked(repository.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))
    const useCase = new ManagementDeleteFilesBatchUseCase(repository)
    const params = { fileIds: ['file-1', 'file-2'] }

    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    expect(repository.deleteFilesBatch).toHaveBeenCalledWith(params)
  })

  it('returns failure when management batch delete fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.deleteFilesBatch).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new ManagementDeleteFilesBatchUseCase(repository)

    const result = await useCase.execute({ fileIds: ['file-1'] })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

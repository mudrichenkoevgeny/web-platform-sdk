import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '@/repository/base/storage-repository'
import { GetFileDetailUseCase } from './get-file-detail-use-case'

describe('GetFileDetailUseCase', () => {
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

  it('delegates getFileDetail to repository and returns payload on success', async () => {
    const expectedDetail = createTestStorageFilePrivate()
    vi.mocked(repository.getFileDetail).mockResolvedValue(appResultSuccess(expectedDetail))
    const useCase = new GetFileDetailUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedDetail)
    }
    expect(repository.getFileDetail).toHaveBeenCalledWith('file-123')
  })

  it('returns failure when getFileDetail fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.getFileDetail).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new GetFileDetailUseCase(repository)

    const result = await useCase.execute('file-123')

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

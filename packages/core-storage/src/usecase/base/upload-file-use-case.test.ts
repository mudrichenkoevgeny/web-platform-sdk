import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageCategory, StorageFileVisibility, UserStorageTargetScopes, createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '@/repository/base/storage-repository'
import { UploadFileUseCase } from './upload-file-use-case'

describe('UploadFileUseCase', () => {
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

  it('delegates uploadFile to repository and passes onProgress callback', async () => {
    const expectedDetail = createTestStorageFilePrivate()
    vi.mocked(repository.uploadFile).mockResolvedValue(appResultSuccess(expectedDetail))
    const useCase = new UploadFileUseCase(repository)
    const file = new File([], 'test.png')
    const onProgress = vi.fn()
    const params = {
      file,
      category: StorageCategory.IMAGE,
      visibility: StorageFileVisibility.PUBLIC,
      targetScope: UserStorageTargetScopes.AVATAR,
      onProgress
    }

    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedDetail)
    }
    expect(repository.uploadFile).toHaveBeenCalledWith(
      params.file,
      params.category,
      params.visibility,
      params.targetScope,
      params.onProgress
    )
  })

  it('returns failure when upload fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.uploadFile).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new UploadFileUseCase(repository)
    const file = new File([], 'test.png')

    const result = await useCase.execute({
      file,
      category: StorageCategory.IMAGE,
      visibility: StorageFileVisibility.PUBLIC,
      targetScope: UserStorageTargetScopes.AVATAR
    })

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestStorageFileSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '@/repository/management/management-storage-repository'
import { ManagementGetFilesUseCase } from './management-get-files-use-case'

describe('ManagementGetFilesUseCase', () => {
  let repository: ManagementStorageRepository

  beforeEach(() => {
    repository = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }
  })

  it('delegates getFiles to repository with params and returns paged result', async () => {
    const expectedPaged = createTestPagedResult({ items: createTestStorageFileSummaryList(2) })
    vi.mocked(repository.getFiles).mockResolvedValue(appResultSuccess(expectedPaged))
    const useCase = new ManagementGetFilesUseCase(repository)
    const params = { pageNumber: 1, pageSize: 10 }

    const result = await useCase.execute(params)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPaged)
    }
    expect(repository.getFiles).toHaveBeenCalledWith(params)
  })

  it('returns failure when management getFiles fails', async () => {
    const expectedError = CommonError.unknown()
    vi.mocked(repository.getFiles).mockResolvedValue(appResultFailure(expectedError))
    const useCase = new ManagementGetFilesUseCase(repository)

    const result = await useCase.execute()

    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })
})

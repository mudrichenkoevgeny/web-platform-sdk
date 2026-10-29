import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFilePrivate,
  StorageFileSummary,
  ManagementStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '../../../repository/management/management-storage-repository'

/**
 * Mock implementation of {@link ManagementStorageRepository} for unit and integration testing.
 */
export class ManagementStorageRepositoryMock implements ManagementStorageRepository {
  public mockGetFilesResult?: AppResult<PagedResult<StorageFileSummary>, AppError>
  public mockGetFileDetailResult?: AppResult<StorageFilePrivate, AppError>
  public mockDeleteFileResult?: AppResult<void, AppError>
  public mockDeleteFilesBatchResult?: AppResult<void, AppError>

  public async getFiles(
    _params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return (
      this.mockGetFilesResult ??
      appResultSuccess({
        items: [],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalCount: 0,
        totalPages: 0
      })
    )
  }

  public async getFileDetail(_fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.mockGetFileDetailResult ?? appResultSuccess(createTestStorageFilePrivate())
  }

  public async deleteFile(_fileId: string): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFileResult ?? appResultSuccess(undefined)
  }

  public async deleteFilesBatch(
    _request: DeleteFilesBatchRequest
  ): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFilesBatchResult ?? appResultSuccess(undefined)
  }
}

import type { StorageApi, PresignedUrlParams } from '../../../network/api/base/storage-api'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestPresignedUrl,
  createTestStorageFilePrivate
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  PresignedUrl,
  StorageFilePrivate,
  StorageFileSummary,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link StorageApi} for unit and integration testing.
 */
export class StorageApiMock implements StorageApi {
  public mockGetPresignedUploadUrlResult?: AppResult<PresignedUrl, AppError>
  public mockConfirmUploadResult?: AppResult<StorageFilePrivate, AppError>
  public mockGetFilesResult?: AppResult<PagedResult<StorageFileSummary>, AppError>
  public mockGetFileDetailResult?: AppResult<StorageFilePrivate, AppError>
  public mockDeleteFileResult?: AppResult<void, AppError>
  public mockDeleteFilesBatchResult?: AppResult<void, AppError>

  public async getPresignedUploadUrl(_params: PresignedUrlParams): Promise<AppResult<PresignedUrl, AppError>> {
    return this.mockGetPresignedUploadUrlResult ?? appResultSuccess(createTestPresignedUrl())
  }

  public async confirmUpload(_fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.mockConfirmUploadResult ?? appResultSuccess(createTestStorageFilePrivate())
  }

  public async getFiles(_params?: SelfStorageFileListParams | null): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.mockGetFilesResult ?? appResultSuccess({
      items: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalCount: 0,
      totalPages: 0
    })
  }

  public async getFileDetail(_fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.mockGetFileDetailResult ?? appResultSuccess(createTestStorageFilePrivate())
  }

  public async deleteFile(_fileId: string): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFileResult ?? appResultSuccess(undefined)
  }

  public async deleteFilesBatch(_request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFilesBatchResult ?? appResultSuccess(undefined)
  }
}

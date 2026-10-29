import type { StorageRepository } from '../../../repository/base/storage-repository'
import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  createTestStorageFilePrivate
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFilePrivate,
  StorageFileSummary,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

export class StorageRepositoryMock implements StorageRepository {
  public mockGetFilesResult?: AppResult<PagedResult<StorageFileSummary>, AppError>
  public mockGetFileDetailResult?: AppResult<StorageFilePrivate, AppError>
  public mockUploadFileResult?: AppResult<StorageFilePrivate, AppError>
  public mockDeleteFileResult?: AppResult<void, AppError>
  public mockDeleteFilesBatchResult?: AppResult<void, AppError>

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

  public async uploadFile(_file: File, _category: string, _visibility: string, _targetScope: string, _onProgress?: (percent: number) => void): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.mockUploadFileResult ?? appResultSuccess(createTestStorageFilePrivate())
  }

  public async deleteFile(_fileId: string): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFileResult ?? appResultSuccess(undefined)
  }

  public async deleteFilesBatch(_request: DeleteFilesBatchRequest | string[]): Promise<AppResult<void, AppError>> {
    return this.mockDeleteFilesBatchResult ?? appResultSuccess(undefined)
  }
}

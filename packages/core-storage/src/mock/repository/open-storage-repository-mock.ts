import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'
import { createTestStorageFilePrivate, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '@/repository/storage-repository'

/**
 * Mock implementation of {@link StorageRepository} for unit and integration testing.
 */
export class OpenStorageRepositoryMock implements StorageRepository {
  /** Call count tracking invocations of {@link getFiles}. */
  public getFilesCallCount = 0

  /** Call count tracking invocations of {@link getFileDetail}. */
  public getFileDetailCallCount = 0

  /** Call count tracking invocations of {@link uploadFile}. */
  public uploadFileCallCount = 0

  /** Call count tracking invocations of {@link deleteFile}. */
  public deleteFileCallCount = 0

  /** Call count tracking invocations of {@link deleteFilesBatch}. */
  public deleteFilesBatchCallCount = 0

  /**
   * Constructs a new {@link OpenStorageRepositoryMock}.
   *
   * @param shouldFail - Optional flag indicating whether repository operations should return failure results.
   */
  public constructor(private readonly shouldFail: boolean = false) {}

  /**
   * Fetches mock paged list of storage files or fails.
   *
   * @param _params - Optional search and pagination parameters.
   * @returns AppResult containing mock {@link PagedResult} of {@link StorageFileSummary} or {@link AppError}.
   */
  public async getFiles(
    _params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    this.getFilesCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess({ items: [], pageNumber: 1, pageSize: 10, totalElements: 0, totalCount: 0, totalPages: 0 })
  }

  /**
   * Retrieves detail for a mock storage file or fails.
   *
   * @param fileId - Unique identifier of the target file.
   * @returns AppResult containing mock {@link StorageFilePrivate} or {@link AppError}.
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    this.getFileDetailCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(createTestStorageFilePrivate({ id: toFileIdOrThrow(fileId) }))
  }

  /**
   * Simulates uploading a file and returns a mock {@link StorageFilePrivate} domain model.
   *
   * @param _file - Binary File object to upload.
   * @param _category - Target storage category.
   * @param _visibility - Target visibility setting.
   * @param _targetScope - Target application scope.
   * @param _onProgress - Optional upload progress callback.
   * @returns AppResult containing mock {@link StorageFilePrivate} or {@link AppError}.
   */
  public async uploadFile(
    _file: File,
    _category: string,
    _visibility: string,
    _targetScope: string,
    _onProgress?: (percent: number) => void
  ): Promise<AppResult<StorageFilePrivate, AppError>> {
    this.uploadFileCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(createTestStorageFilePrivate({ id: toFileIdOrThrow('file-uploaded-1') }))
  }

  /**
   * Simulates single file deletion.
   *
   * @param _fileId - Unique identifier of file to delete.
   * @returns AppResult containing void or {@link AppError}.
   */
  public async deleteFile(_fileId: string): Promise<AppResult<void, AppError>> {
    this.deleteFileCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(undefined)
  }

  /**
   * Simulates batch file deletion.
   *
   * @param _request - Batch deletion request payload or array of file IDs.
   * @returns AppResult containing void or {@link AppError}.
   */
  public async deleteFilesBatch(_request: DeleteFilesBatchRequest | string[]): Promise<AppResult<void, AppError>> {
    this.deleteFilesBatchCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(undefined)
  }
}

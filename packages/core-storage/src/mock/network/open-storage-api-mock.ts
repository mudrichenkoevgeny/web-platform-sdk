import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { appResultFailure, appResultSuccess, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { PresignedUrlParams, StorageApi } from '@/network/api/storage/storage-api'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  PresignedUrl,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'
import { createTestStorageFilePrivate, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Mock implementation of {@link StorageApi} for unit and integration testing.
 */
export class OpenStorageApiMock implements StorageApi {
  /** Call count tracking invocations of {@link getPresignedUploadUrl}. */
  public getPresignedUploadUrlCallCount = 0

  /** Call count tracking invocations of {@link confirmUpload}. */
  public confirmUploadCallCount = 0

  /** Call count tracking invocations of {@link getFiles}. */
  public getFilesCallCount = 0

  /** Call count tracking invocations of {@link getFileDetail}. */
  public getFileDetailCallCount = 0

  /** Call count tracking invocations of {@link deleteFile}. */
  public deleteFileCallCount = 0

  /** Call count tracking invocations of {@link deleteFilesBatch}. */
  public deleteFilesBatchCallCount = 0

  /**
   * Constructs a new {@link OpenStorageApiMock}.
   *
   * @param shouldFail - Optional flag indicating whether API calls should return failure results.
   */
  public constructor(private readonly shouldFail: boolean = false) {}

  /**
   * Generates a mock presigned upload URL or fails if configured.
   *
   * @param _params - Presigned URL request parameters.
   * @returns AppResult containing mock {@link PresignedUrl} or {@link AppError}.
   */
  public async getPresignedUploadUrl(
    _params: PresignedUrlParams
  ): Promise<AppResult<PresignedUrl, AppError>> {
    this.getPresignedUploadUrlCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess({
      fileId: toFileIdOrThrow('file-123'),
      uploadUrl: 'https://s3.example.com/upload-123',
      fileUrl: 'https://cdn.example.com/file-123',
      expiresAt: Date.now() + 3600000
    })
  }

  /**
   * Confirms upload and returns a mock {@link StorageFilePrivate} model or fails.
   *
   * @param fileId - Target file identifier string.
   * @returns AppResult containing mock {@link StorageFilePrivate} or {@link AppError}.
   */
  public async confirmUpload(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    this.confirmUploadCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(createTestStorageFilePrivate({ id: toFileIdOrThrow(fileId) }))
  }

  /**
   * Fetches mock paged list of storage files or fails.
   *
   * @param _params - Optional list parameters.
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
   * @param _request - Batch deletion request payload.
   * @returns AppResult containing void or {@link AppError}.
   */
  public async deleteFilesBatch(_request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    this.deleteFilesBatchCallCount++
    if (this.shouldFail) {
      return appResultFailure(CommonError.unknown())
    }
    return appResultSuccess(undefined)
  }
}

import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams,
  DeleteFilesBatchRequest
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Repository interface for global administrative file storage operations.
 */
export interface ManagementStorageRepository {
  /**
   * Fetches a paginated list of all files in the platform.
   *
   * @param params - Optional query parameters for filtering, sorting, and pagination
   * @returns AppResult containing {@link PagedResult} of {@link StorageFileSummary}
   */
  getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of any specific file in the platform.
   *
   * @param fileId - Unique identifier of target file
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of file to delete
   * @returns AppResult containing void on success
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files across the platform in a single batch operation.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns AppResult containing void on success
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

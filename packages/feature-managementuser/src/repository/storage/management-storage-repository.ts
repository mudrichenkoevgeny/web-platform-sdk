import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Management Storage Repository contract for staff administrative file operations.
 */
export interface ManagementStorageRepository {
  /**
   * Fetches a paginated list of all files in the platform.
   *
   * @param params - Optional query parameters for filtering, sorting, and pagination
   * @returns A promise resolving to an {@link AppResult} containing a {@link PagedResult} of {@link StorageFileSummary} or {@link AppError}
   */
  getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of any specific file in the platform.
   *
   * @param fileId - Unique identifier of the target file
   * @returns A promise resolving to an {@link AppResult} containing {@link StorageFilePrivate} or {@link AppError}
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file from the platform.
   *
   * @param fileId - Unique identifier of the file to delete
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files across the platform in a single batch operation.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

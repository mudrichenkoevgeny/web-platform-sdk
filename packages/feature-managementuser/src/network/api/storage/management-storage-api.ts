import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Management Storage API contract for staff administrative file operations.
 */
export interface ManagementStorageApi {
  /**
   * Fetches a paginated list of files uploaded across the platform.
   *
   * @param params - Optional query parameters matching the administrative listing search schema
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
   * Deletes any specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of the target file to delete
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files across the platform in a single batch operation using a request DTO.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

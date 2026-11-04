import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageCategory,
  StorageFileSummary,
  StorageFilePrivate,
  StorageFileVisibility,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Common repository contract for file storage operations.
 */
export interface StorageRepository {
  /**
   * Fetches a paginated list of storage files based on parameters.
   *
   * @param params - Optional query parameters for filtering, sorting, and pagination
   * @returns A promise resolving to an {@link AppResult} containing a {@link PagedResult} of {@link StorageFileSummary} or {@link AppError}
   */
  getFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of a specific file.
   *
   * @param fileId - Unique identifier of the target file
   * @returns A promise resolving to an {@link AppResult} containing {@link StorageFilePrivate} or {@link AppError}
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Performs direct S3 upload flow and confirms file creation.
   *
   * @param file - Binary File object to upload
   * @param category - Target storage category
   * @param visibility - Target visibility setting
   * @param targetScope - Target application scope
   * @param onProgress - Optional callback for tracking upload completion percentage (0-100)
   * @returns A promise resolving to an {@link AppResult} containing confirmed {@link StorageFilePrivate} or {@link AppError}
   */
  uploadFile(
    file: File,
    category: StorageCategory,
    visibility: StorageFileVisibility,
    targetScope: string,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file.
   *
   * @param fileId - Unique identifier of the file to delete
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files in a single batch operation.
   *
   * @param request - Batch deletion request object or array of unique file identifiers
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest | string[]): Promise<AppResult<void, AppError>>
}

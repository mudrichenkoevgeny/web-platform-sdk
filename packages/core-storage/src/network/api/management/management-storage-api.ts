import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Management REST API client interface for global file storage administrative operations.
 */
export interface ManagementStorageApi {
  /**
   * Fetches a paginated list of files uploaded across the platform.
   *
   * @param params - Optional query parameters matching administrative listing schema
   * @returns AppResult containing {@link PagedResult} of {@link StorageFileSummary}
   */
  getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of any specific file in the platform.
   *
   * @param fileId - Unique identifier of the requested file
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes any specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of target file
   * @returns AppResult containing void on success
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files across the platform in a single batch operation.
   *
   * @param request - Batch deletion request parameters DTO
   * @returns AppResult containing void on success
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  PresignedUrl,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/** Input parameters for requesting a presigned S3 upload URL. */
export interface PresignedUrlParams {
  fileName: string
  fileSizeBytes: number
  mimeType: string
  category: string
  visibility?: string
  targetScope?: string | null
}

/**
 * Common REST API client interface for file storage operations returning mapped domain models.
 */
export interface StorageApi {
  /**
   * Retrieves a presigned URL to upload a file directly to S3 using input parameters.
   *
   * @param params - Presigned upload URL request parameters
   * @returns A promise resolving to an {@link AppResult} containing {@link PresignedUrl} or {@link AppError}
   */
  getPresignedUploadUrl(
    params: PresignedUrlParams
  ): Promise<AppResult<PresignedUrl, AppError>>

  /**
   * Confirms that a file has been successfully uploaded to S3.
   *
   * @param fileId - Unique identifier of the uploaded file
   * @returns A promise resolving to an {@link AppResult} containing {@link StorageFilePrivate} or {@link AppError}
   */
  confirmUpload(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Fetches a paginated list of storage files based on query parameters.
   *
   * @param params - Optional query parameters for filtering and pagination
   * @returns A promise resolving to an {@link AppResult} containing a {@link PagedResult} of {@link StorageFileSummary} or {@link AppError}
   */
  getFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of a specific file.
   *
   * @param fileId - Unique identifier of the requested file
   * @returns A promise resolving to an {@link AppResult} containing {@link StorageFilePrivate} or {@link AppError}
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file.
   *
   * @param fileId - Unique identifier of the target file to delete
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files in a single batch operation using a request DTO.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns A promise resolving to an {@link AppResult} containing void or {@link AppError}
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

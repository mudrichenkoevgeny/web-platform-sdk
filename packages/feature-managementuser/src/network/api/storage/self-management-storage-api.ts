import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { PresignedUrlParams } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  PresignedUrl,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/** Self-service storage API contract for staff members. */
export interface SelfManagementStorageApi {
  /**
   * Fetches a paginated list of files uploaded by the current staff member.
   */
  getFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of a specific file uploaded by the current staff member.
   */
  getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Requests a presigned S3 upload URL for a new file uploaded by current staff member.
   */
  getPresignedUploadUrl(
    params: PresignedUrlParams
  ): Promise<AppResult<PresignedUrl, AppError>>

  /**
   * Confirms that a file has been uploaded to S3 by current staff member.
   */
  confirmUpload(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file uploaded by current staff member.
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files uploaded by current staff member in a single batch operation.
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

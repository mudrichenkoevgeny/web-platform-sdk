import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/** Self-service storage repository contract for staff members. */
export interface SelfManagementStorageRepository {
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
   * Performs direct-to-S3 upload flow for current staff member.
   */
  uploadFile(
    file: File,
    category: string,
    visibility: string,
    targetScope: string,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<StorageFilePrivate, AppError>>

  /**
   * Deletes a specific file uploaded by current staff member.
   */
  deleteFile(fileId: string): Promise<AppResult<void, AppError>>

  /**
   * Deletes multiple files uploaded by current staff member in a single batch operation.
   */
  deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>>
}

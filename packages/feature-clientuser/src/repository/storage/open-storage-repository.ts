import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type {
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * Open Storage Repository contract for self-service user file operations.
 */
export interface OpenStorageRepository extends StorageRepository {
  /**
   * Fetches a paginated list of files uploaded by the current user.
   */
  getSelfFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>>

  /**
   * Retrieves detailed private view of a specific file uploaded by the current user.
   */
  getSelfFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>>
}

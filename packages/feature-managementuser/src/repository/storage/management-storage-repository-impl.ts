import type { AppResult, AppError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams,
  DeleteFilesBatchRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageApi } from '../../network/api/storage/management-storage-api'
import type { ManagementStorageRepository } from './management-storage-repository'

/**
 * Default implementation of {@link ManagementStorageRepository}.
 */
export class ManagementStorageRepositoryImpl implements ManagementStorageRepository {
  /**
   * Constructs a new {@link ManagementStorageRepositoryImpl} instance.
   *
   * @param api - Management Storage API client interface
   */
  public constructor(
    private readonly api: ManagementStorageApi
  ) {}

  /**
   * Fetches a paginated list of all files in the platform.
   *
   * @param params - Optional query parameters for filtering, sorting, and pagination
   * @returns AppResult containing {@link PagedResult} of {@link StorageFileSummary}
   */
  public async getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.api.getFiles(params)
  }

  /**
   * Retrieves detailed private view of any specific file in the platform.
   *
   * @param fileId - Unique identifier of target file
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.api.getFileDetail(fileId)
  }

  /**
   * Deletes a specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of file to delete
   * @returns AppResult containing void on success
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    return this.api.deleteFile(fileId)
  }

  /**
   * Deletes multiple files across the platform in a single batch operation.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns AppResult containing void on success
   */
  public async deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.api.deleteFilesBatch(request)
  }
}

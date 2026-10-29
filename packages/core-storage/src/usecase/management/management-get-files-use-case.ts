import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  PagedResult,
  ManagementStorageFileListParams,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '../../repository/management/management-storage-repository'

/** Fetches a paginated list of all files across the platform administratively. */
export class ManagementGetFilesUseCase {
  /**
   * Constructs a new {@link ManagementGetFilesUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(protected readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Optional query, filter, and pagination parameters
   * @returns Paginated result of storage file summary domain models
   */
  public async execute(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.managementStorageRepository.getFiles(params)
  }
}

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type {
  PagedResult,
  SelfStorageFileListParams,
  StorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'

/** Fetches a paginated list of storage files uploaded by the authenticated user. */
export class GetFilesUseCase {
  /**
   * Constructs a new {@link GetFilesUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Optional query, filter, and pagination parameters
   * @returns Paginated result of storage file summary domain models
   */
  public async execute(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.storageRepository.getFiles(params)
  }
}

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { DeleteFilesBatchRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '@/repository/storage/management-storage-repository'

/** Deletes multiple files across the platform in a single batch operation. */
export class ManagementDeleteFilesBatchUseCase {
  /**
   * Constructs a new {@link ManagementDeleteFilesBatchUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(private readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - Batch deletion request containing array of file identifiers
   * @returns Void on success
   */
  public async execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.managementStorageRepository.deleteFilesBatch(request)
  }
}

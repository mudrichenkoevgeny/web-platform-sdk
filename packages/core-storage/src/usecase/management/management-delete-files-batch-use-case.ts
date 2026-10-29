import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { DeleteFilesBatchRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '../../repository/management/management-storage-repository'

/** Deletes multiple files administratively across the platform in a batch operation. */
export class ManagementDeleteFilesBatchUseCase {
  /**
   * Constructs a new {@link ManagementDeleteFilesBatchUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(protected readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - Batch deletion request object containing file IDs
   * @returns Void result on success
   */
  public async execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.managementStorageRepository.deleteFilesBatch(request)
  }
}

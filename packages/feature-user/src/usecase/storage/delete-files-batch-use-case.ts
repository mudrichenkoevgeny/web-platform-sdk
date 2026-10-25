import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { DeleteFilesBatchRequest } from '@mudrichenkoevgeny/shared-foundation'

/** Deletes multiple files uploaded by the authenticated user in a single batch operation. */
export class DeleteFilesBatchUseCase {
  /**
   * Constructs a new {@link DeleteFilesBatchUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - Batch deletion request containing array of file identifiers
   * @returns Void on success
   */
  public async execute(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.storageRepository.deleteFilesBatch(request)
  }
}

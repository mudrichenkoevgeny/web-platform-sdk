import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { DeleteFilesBatchRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '@/repository/storage/storage-repository'

/** Deletes multiple storage files in a single batch operation. */
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

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { DeleteFilesBatchRequest } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '../../repository/base/storage-repository'

/** Deletes multiple files in a batch operation. */
export class DeleteFilesBatchUseCase {
  /**
   * Constructs a new {@link DeleteFilesBatchUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(protected readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param request - Request containing array of file IDs or DTO
   * @returns Void result on success
   */
  public async execute(request: DeleteFilesBatchRequest | string[]): Promise<AppResult<void, AppError>> {
    return this.storageRepository.deleteFilesBatch(request)
  }
}

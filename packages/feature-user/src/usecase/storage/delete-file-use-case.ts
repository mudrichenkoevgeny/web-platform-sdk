import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'

/** Deletes a specific file uploaded by the authenticated user. */
export class DeleteFileUseCase {
  /**
   * Constructs a new {@link DeleteFileUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param fileId - Unique identifier of the file to delete
   * @returns Void on success
   */
  public async execute(fileId: string): Promise<AppResult<void, AppError>> {
    return this.storageRepository.deleteFile(fileId)
  }
}

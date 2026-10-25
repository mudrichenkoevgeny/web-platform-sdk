import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageRepository } from '@/repository/storage/management-storage-repository'

/** Deletes a specific file from object storage across the platform administratively. */
export class ManagementDeleteFileUseCase {
  /**
   * Constructs a new {@link ManagementDeleteFileUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(private readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param fileId - Unique identifier of the file to delete
   * @returns Void on success
   */
  public async execute(fileId: string): Promise<AppResult<void, AppError>> {
    return this.managementStorageRepository.deleteFile(fileId)
  }
}

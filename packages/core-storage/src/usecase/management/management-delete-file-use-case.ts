import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ManagementStorageRepository } from '../../repository/management/management-storage-repository'

/** Deletes a specific file administratively across the platform. */
export class ManagementDeleteFileUseCase {
  /**
   * Constructs a new {@link ManagementDeleteFileUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(protected readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param fileId - Unique identifier of target file to delete
   * @returns Void result on success
   */
  public async execute(fileId: string): Promise<AppResult<void, AppError>> {
    return this.managementStorageRepository.deleteFile(fileId)
  }
}

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageRepository } from '@/repository/storage/management-storage-repository'

/** Retrieves detailed private view of any specific file in the platform administratively. */
export class ManagementGetFileDetailUseCase {
  /**
   * Constructs a new {@link ManagementGetFileDetailUseCase}.
   *
   * @param managementStorageRepository - Management storage repository
   */
  public constructor(private readonly managementStorageRepository: ManagementStorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param fileId - Unique identifier of the target file
   * @returns Detailed private file domain model
   */
  public async execute(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.managementStorageRepository.getFileDetail(fileId)
  }
}

import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '@/repository/storage/storage-repository'

/** Retrieves detailed private view of a specific storage file. */
export class GetFileDetailUseCase {
  /**
   * Constructs a new {@link GetFileDetailUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param fileId - Unique identifier of the target file
   * @returns Detailed private file domain model
   */
  public async execute(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.storageRepository.getFileDetail(fileId)
  }
}

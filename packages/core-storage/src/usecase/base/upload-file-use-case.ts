import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageCategory, StorageFilePrivate, StorageFileVisibility } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '../../repository/base/storage-repository'

export interface UploadFileUseCaseParams {
  file: File
  category: StorageCategory
  visibility: StorageFileVisibility
  targetScope: string
  onProgress?: (percent: number) => void
}

/** Uploads a file directly to S3 and confirms creation. */
export class UploadFileUseCase {
  /**
   * Constructs a new {@link UploadFileUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(protected readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case. Accepts a single options parameters object.
   *
   * @param params - Upload parameters options object
   * @returns AppResult containing uploaded StorageFilePrivate on success
   */
  public async execute(
    params: UploadFileUseCaseParams
  ): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.storageRepository.uploadFile(
      params.file,
      params.category,
      params.visibility,
      params.targetScope,
      params.onProgress
    )
  }
}

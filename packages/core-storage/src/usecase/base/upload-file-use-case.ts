import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageRepository } from '../../repository/base/storage-repository'

export interface UploadFileUseCaseParams {
  file: File
  category: string
  visibility: string
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
   * Executes the use case. Accepts either an options object or positional parameters.
   */
  public async execute(
    paramsOrFile: UploadFileUseCaseParams | File,
    category?: string,
    visibility?: string,
    targetScope?: string,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<StorageFilePrivate, AppError>> {
    if (paramsOrFile instanceof File) {
      return this.storageRepository.uploadFile(
        paramsOrFile,
        category ?? '',
        visibility ?? '',
        targetScope ?? '',
        onProgress
      )
    }

    return this.storageRepository.uploadFile(
      paramsOrFile.file,
      paramsOrFile.category,
      paramsOrFile.visibility,
      paramsOrFile.targetScope,
      paramsOrFile.onProgress
    )
  }
}

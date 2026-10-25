import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { StorageRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'

/** Input parameters for uploading a file in the self-service flow. */
export interface UploadFileParams {
  file: File
  category: string
  visibility: string
  targetScope: string
  onProgress?: (percent: number) => void
}

/** Executes the complete direct S3 upload flow for the authenticated user. */
export class UploadFileUseCase {
  /**
   * Constructs a new {@link UploadFileUseCase}.
   *
   * @param storageRepository - Storage repository for file operations
   */
  public constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * Executes the use case.
   *
   * @param params - Upload parameters including binary File and target category
   * @returns Confirmed detailed private file domain model
   */
  public async execute(params: UploadFileParams): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.storageRepository.uploadFile(
      params.file,
      params.category,
      params.visibility,
      params.targetScope,
      params.onProgress
    )
  }
}

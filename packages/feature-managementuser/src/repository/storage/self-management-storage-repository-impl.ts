import type { AppResult, AppError, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { uploadFileToS3 } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import {
  StorageWebSocketEventTypes,
  storageFilePrivatePayloadSchema,
  toStorageFilePrivate,
  type PagedResult,
  type StorageFileSummary,
  type StorageFilePrivate,
  type SelfStorageFileListParams,
  type DeleteFilesBatchRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { SelfManagementStorageApi } from '@/network/api/storage/self-management-storage-api'
import type { SelfManagementStorageRepository } from '@/repository/storage/self-management-storage-repository'

/** Observer callback signature for file updates. */
export type SelfManagementStorageFileObserver = (file: StorageFilePrivate) => void

/** Default implementation of {@link SelfManagementStorageRepository}. */
export class SelfManagementStorageRepositoryImpl implements SelfManagementStorageRepository {
  private readonly observers = new Set<SelfManagementStorageFileObserver>()

  /**
   * Constructs a new {@link SelfManagementStorageRepositoryImpl} instance.
   *
   * @param api - Self management Storage API client interface
   * @param webSocketService - WebSocket service for listening to real-time file updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly api: SelfManagementStorageApi,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Fetches a paginated list of storage files for the current staff member.
   *
   * @param params - Optional listing query and filter parameters
   * @returns AppResult containing {@link PagedResult} of {@link StorageFileSummary}
   */
  public async getFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.api.getFiles(params)
  }

  /**
   * Retrieves detailed private view of a specific file for the current staff member.
   *
   * @param fileId - Unique file identifier
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.api.getFileDetail(fileId)
  }

  /**
   * Performs the complete direct-to-S3 upload flow for the current staff member:
   * 1. Requests a presigned URL from the backend.
   * 2. Uploads the binary file directly to S3 via XMLHttpRequest, reporting progress.
   * 3. Confirms the completed upload session with the backend.
   *
   * @param file - Binary File object to upload
   * @param category - Target storage category
   * @param visibility - Target visibility setting
   * @param targetScope - Target application scope
   * @param onProgress - Optional callback for tracking upload completion percentage (0-100)
   * @returns A promise resolving to an {@link AppResult} containing confirmed {@link StorageFilePrivate}
   */
  public async uploadFile(
    file: File,
    category: string,
    visibility: string,
    targetScope: string,
    onProgress?: (percent: number) => void
  ): Promise<AppResult<StorageFilePrivate, AppError>> {
    const presignedResult = await this.api.getPresignedUploadUrl({
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/octet-stream',
      category,
      visibility,
      targetScope
    })

    if (isFailure(presignedResult)) {
      return presignedResult
    }

    const presigned = presignedResult.data
    const uploadResult = await uploadFileToS3(presigned.uploadUrl, file, onProgress)
    if (isFailure(uploadResult)) {
      return uploadResult
    }

    return this.api.confirmUpload(presigned.fileId)
  }

  /**
   * Deletes a specific file uploaded by the current staff member.
   *
   * @param fileId - Unique identifier of file to delete
   * @returns AppResult containing void on success
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    return this.api.deleteFile(fileId)
  }

  /**
   * Deletes multiple files uploaded by current staff member in a single batch operation.
   *
   * @param request - Batch deletion request parameters containing target file identifiers
   * @returns AppResult containing void on success
   */
  public async deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    return this.api.deleteFilesBatch(request)
  }

  /**
   * Registers an observer for live updates to storage files.
   *
   * @param observer - Observer callback
   * @returns Unsubscribe function
   */
  public observeFileUpdates(observer: SelfManagementStorageFileObserver): () => void {
    this.observers.add(observer)
    return () => {
      this.observers.delete(observer)
    }
  }

  private startWebSocketObservation(): void {
    if (!this.webSocketService) {
      return
    }

    this.webSocketService.observeEvents((frame: SocketFrame) => {
      if (frame.type === StorageWebSocketEventTypes.STORAGE_FILE_UPDATED) {
        try {
          if (frame.payload) {
            const validationResult = storageFilePrivatePayloadSchema.safeParse(frame.payload)
            if (validationResult.success) {
              const file = toStorageFilePrivate(validationResult.data)
              for (const observer of this.observers) {
                observer(file)
              }
            } else {
              this.logger?.('SelfManagementStorageRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`SelfManagementStorageRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}

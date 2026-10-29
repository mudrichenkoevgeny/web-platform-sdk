import type { AppResult, AppError, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { isFailure } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
import { uploadFileDirectly } from '../../uploader/direct-file-uploader'
import type { StorageApi } from '../../network/api/base/storage-api'
import type { StorageRepository } from '../base/storage-repository'

/** Observer callback signature for file updates. */
export type StorageFileObserver = (file: StorageFilePrivate) => void

/**
 * Default implementation of {@link StorageRepository} for open storage endpoints.
 */
export class OpenStorageRepositoryImpl implements StorageRepository {
  private readonly observers = new Set<StorageFileObserver>()

  /**
   * Constructs a new {@link OpenStorageRepositoryImpl}.
   *
   * @param api - File Storage API client interface
   * @param webSocketService - WebSocket service for listening to real-time file updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly api: StorageApi,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Fetches a paginated list of storage files for the current user.
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
   * Retrieves detailed private view of a specific file for the current user.
   *
   * @param fileId - Unique file identifier
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.api.getFileDetail(fileId)
  }

  /**
   * Performs the complete direct-to-S3 upload flow:
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
    const uploadResult = await uploadFileDirectly(presigned.uploadUrl, file, onProgress)
    if (isFailure(uploadResult)) {
      return uploadResult
    }

    return this.api.confirmUpload(presigned.fileId)
  }

  /**
   * Deletes a specific file uploaded by current user.
   *
   * @param fileId - Unique identifier of file to delete
   * @returns AppResult containing void on success
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    return this.api.deleteFile(fileId)
  }

  /**
   * Deletes multiple files uploaded by current user in a single batch operation.
   *
   * @param request - Batch deletion request parameters containing target file identifiers or array of IDs
   * @returns AppResult containing void on success
   */
  public async deleteFilesBatch(request: DeleteFilesBatchRequest | string[]): Promise<AppResult<void, AppError>> {
    const payload: DeleteFilesBatchRequest = Array.isArray(request) ? { fileIds: request } : request
    return this.api.deleteFilesBatch(payload)
  }

  /**
   * Registers an observer for live updates to storage files.
   *
   * @param observer - Observer callback
   * @returns Unsubscribe function
   */
  public observeFileUpdates(observer: StorageFileObserver): () => void {
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
              this.logger?.('OpenStorageRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`OpenStorageRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}

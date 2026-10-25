import type { AppResult, AppError, WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageWebSocketEventTypes,
  storageFilePrivatePayloadSchema,
  toStorageFilePrivate,
  type PagedResult,
  type StorageFileSummary,
  type StorageFilePrivate,
  type ManagementStorageFileListParams,
  type DeleteFilesBatchRequest
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageApi } from '../../network/api/storage/management-storage-api'
import type { ManagementStorageRepository } from './management-storage-repository'

/** Observer callback signature for file updates. */
export type ManagementStorageFileObserver = (file: StorageFilePrivate) => void

/**
 * Default implementation of {@link ManagementStorageRepository}.
 */
export class ManagementStorageRepositoryImpl implements ManagementStorageRepository {
  private readonly observers = new Set<ManagementStorageFileObserver>()

  /**
   * Constructs a new {@link ManagementStorageRepositoryImpl} instance.
   *
   * @param api - Management Storage API client interface
   * @param webSocketService - WebSocket service for listening to real-time file updates
   * @param logger - Optional diagnostic logger
   */
  public constructor(
    private readonly api: ManagementStorageApi,
    private readonly webSocketService?: WebSocketService,
    private readonly logger?: (msg: string) => void
  ) {
    this.startWebSocketObservation()
  }

  /**
   * Fetches a paginated list of all files in the platform.
   *
   * @param params - Optional query parameters for filtering, sorting, and pagination
   * @returns AppResult containing {@link PagedResult} of {@link StorageFileSummary}
   */
  public async getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    return this.api.getFiles(params)
  }

  /**
   * Retrieves detailed private view of any specific file in the platform.
   *
   * @param fileId - Unique identifier of target file
   * @returns AppResult containing {@link StorageFilePrivate}
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    return this.api.getFileDetail(fileId)
  }

  /**
   * Deletes a specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of file to delete
   * @returns AppResult containing void on success
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    return this.api.deleteFile(fileId)
  }

  /**
   * Deletes multiple files across the platform in a single batch operation.
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
  public observeFileUpdates(observer: ManagementStorageFileObserver): () => void {
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
              this.logger?.('ManagementStorageRepositoryImpl: Invalid WS payload schema')
            }
          }
        } catch (e) {
          this.logger?.(`ManagementStorageRepositoryImpl: WS event parsing failed - ${String(e)}`)
        }
      }
    })
  }
}

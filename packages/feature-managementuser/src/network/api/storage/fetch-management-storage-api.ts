import {
  callResult,
  appendQueryParamsToPath
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type {
  HttpClient,
  AppResult,
  AppError
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  ManagementStorageRoutes,
  StorageApiPaths,
  ManagementStorageFileListParamsParser,
  deleteFilesBatchRequestSchema,
  storageFilePrivatePayloadSchema,
  storageFileSummaryPayloadSchema,
  pagedResultSchema,
  toStorageFilePrivate,
  toStorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  StorageFileSummary,
  StorageFilePrivate,
  ManagementStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'
import type { ManagementStorageApi } from './management-storage-api'

/**
 * Fetch-based implementation of {@link ManagementStorageApi}.
 */
export class FetchManagementStorageApi implements ManagementStorageApi {
  /**
   * Constructs a new {@link FetchManagementStorageApi} instance.
   *
   * @param client - The HTTP client instance used to execute network requests
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Fetches a paginated list of files uploaded across the platform and maps them to domain models.
   *
   * @param params - Optional query parameters matching the administrative listing search schema
   * @returns AppResult containing a {@link PagedResult} of {@link StorageFileSummary} on success or {@link AppError} on failure
   */
  public async getFiles(
    params?: ManagementStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    const queryMap = ManagementStorageFileListParamsParser.toQueryMap(params)
    const path = appendQueryParamsToPath(ManagementStorageRoutes.GET_FILES, queryMap)
    return callResult(async () => {
      const pagedFilesResponse = await this.client.request<unknown>(path)
      const pagedPayload = pagedResultSchema(storageFileSummaryPayloadSchema).parse(pagedFilesResponse)
      return {
        ...pagedPayload,
        items: pagedPayload.items.map(toStorageFileSummary)
      }
    })
  }

  /**
   * Retrieves detailed private view of any specific file in the platform and maps it to domain model.
   *
   * @param fileId - Unique identifier of the target file
   * @returns AppResult containing {@link StorageFilePrivate} on success or {@link AppError} on failure
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    const route = ManagementStorageRoutes.GET_FILE.replace(`{${StorageApiPaths.FILE_ID}}`, fileId)
    return callResult(async () => {
      const fileDetailResponse = await this.client.request<unknown>(route)
      const filePayload = storageFilePrivatePayloadSchema.parse(fileDetailResponse)
      return toStorageFilePrivate(filePayload)
    })
  }

  /**
   * Deletes any specific file from object storage across the platform.
   *
   * @param fileId - Unique identifier of the target file to delete
   * @returns AppResult containing void on success or {@link AppError} on failure
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    const path = ManagementStorageRoutes.DELETE_FILE.replace(`{${StorageApiPaths.FILE_ID}}`, fileId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  /**
   * Deletes multiple files across the platform in a single batch operation using a request DTO.
   *
   * @param request - Batch deletion request parameters containing target file identifiers DTO
   * @returns AppResult containing void on success or {@link AppError} on failure
   */
  public async deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    const payload = deleteFilesBatchRequestSchema.parse(request)
    return callResult(() =>
      this.client.request<void>(ManagementStorageRoutes.DELETE_FILES_BATCH, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }
}

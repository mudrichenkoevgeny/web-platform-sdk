import { appendQueryParamsToPath, callResult, HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { AppError, AppResult } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { PresignedUrlParams } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type {
  DeleteFilesBatchRequest,
  PagedResult,
  PresignedUrl,
  StorageFileSummary,
  StorageFilePrivate,
  SelfStorageFileListParams
} from '@mudrichenkoevgeny/shared-foundation'
import {
  OpenStorageRoutes,
  StorageApiPaths,
  SelfStorageFileListParamsParser,
  deleteFilesBatchRequestSchema,
  presignedUrlPayloadSchema,
  presignedUrlRequestSchema,
  storageFilePrivatePayloadSchema,
  storageFileSummaryPayloadSchema,
  pagedResultSchema,
  toPresignedUrl,
  toStorageFilePrivate,
  toStorageFileSummary
} from '@mudrichenkoevgeny/shared-foundation'
import type { OpenStorageApi } from './open-storage-api'

/**
 * Fetch-based HTTP client implementation of {@link OpenStorageApi}.
 */
export class FetchOpenStorageApi implements OpenStorageApi {
  /**
   * Constructs a new {@link FetchOpenStorageApi}.
   *
   * @param client - Configured HTTP client instance
   */
  public constructor(private readonly client: HttpClient) {}

  /**
   * Requests a presigned S3 upload URL for a new file using camelCase params and maps response to domain model.
   *
   * @param params - Presigned URL request parameters
   * @returns AppResult containing {@link PresignedUrl} on success or {@link AppError} on failure
   */
  public async getPresignedUploadUrl(
    params: PresignedUrlParams
  ): Promise<AppResult<PresignedUrl, AppError>> {
    const payload = presignedUrlRequestSchema.parse({
      file_name: params.fileName,
      file_size_bytes: params.fileSizeBytes,
      mime_type: params.mimeType,
      category: params.category,
      visibility: params.visibility,
      target_scope: params.targetScope
    })
    return callResult(async () => {
      const presignedUrlResponse = await this.client.request<unknown>(OpenStorageRoutes.POST_PRESIGNED_UPLOAD_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const presignedPayload = presignedUrlPayloadSchema.parse(presignedUrlResponse)
      return toPresignedUrl(presignedPayload)
    })
  }

  /**
   * Confirms that a file has been successfully uploaded to S3 and maps response to domain model.
   *
   * @param fileId - Unique identifier of the uploaded file
   * @returns AppResult containing confirmed {@link StorageFilePrivate} on success or {@link AppError} on failure
   */
  public async confirmUpload(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    const path = OpenStorageRoutes.CONFIRM_UPLOAD.replace(`{${StorageApiPaths.FILE_ID}}`, fileId)
    return callResult(async () => {
      const confirmedFileResponse = await this.client.request<unknown>(path, { method: 'POST' })
      const confirmedPayload = storageFilePrivatePayloadSchema.parse(confirmedFileResponse)
      return toStorageFilePrivate(confirmedPayload)
    })
  }

  /**
   * Returns a paged list of summary storage files uploaded by current user mapped to domain models.
   *
   * @param params - Optional listing query and filter parameters DTO
   * @returns AppResult containing a {@link PagedResult} of {@link StorageFileSummary} on success or {@link AppError} on failure
   */
  public async getFiles(
    params?: SelfStorageFileListParams | null
  ): Promise<AppResult<PagedResult<StorageFileSummary>, AppError>> {
    const queryMap = SelfStorageFileListParamsParser.toQueryMap(params)
    const path = appendQueryParamsToPath(OpenStorageRoutes.GET_FILES, queryMap)
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
   * Retrieves detailed private view of a specific file uploaded by current user mapped to domain model.
   *
   * @param fileId - Unique identifier of the requested file
   * @returns AppResult containing {@link StorageFilePrivate} on success or {@link AppError} on failure
   */
  public async getFileDetail(fileId: string): Promise<AppResult<StorageFilePrivate, AppError>> {
    const path = OpenStorageRoutes.GET_FILE.replace(`{${StorageApiPaths.FILE_ID}}`, fileId)
    return callResult(async () => {
      const fileDetailResponse = await this.client.request<unknown>(path)
      const filePayload = storageFilePrivatePayloadSchema.parse(fileDetailResponse)
      return toStorageFilePrivate(filePayload)
    })
  }

  /**
   * Deletes a specific file uploaded by current user.
   *
   * @param fileId - Unique identifier of the target file to delete
   * @returns AppResult containing void on success or {@link AppError} on failure
   */
  public async deleteFile(fileId: string): Promise<AppResult<void, AppError>> {
    const path = OpenStorageRoutes.DELETE_FILE.replace(`{${StorageApiPaths.FILE_ID}}`, fileId)
    return callResult(() => this.client.request<void>(path, { method: 'DELETE' }))
  }

  /**
   * Deletes multiple files uploaded by current user in a single batch operation using a request DTO.
   *
   * @param request - Batch deletion request parameters containing target file identifiers DTO
   * @returns AppResult containing void on success or {@link AppError} on failure
   */
  public async deleteFilesBatch(request: DeleteFilesBatchRequest): Promise<AppResult<void, AppError>> {
    const payload = deleteFilesBatchRequestSchema.parse(request)
    return callResult(() =>
      this.client.request<void>(OpenStorageRoutes.DELETE_FILES_BATCH, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    )
  }
}

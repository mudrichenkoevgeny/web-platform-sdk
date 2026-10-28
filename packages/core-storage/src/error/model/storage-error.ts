import { StorageErrorCodes, StorageErrorArgs, CommonErrorArgs, ClientStorageErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Error indicating direct S3 upload failed due to network error, CORS, or S3 error response. */
export type StorageErrorS3UploadFailed = {
  readonly id: ErrorId
  readonly code: typeof ClientStorageErrorCodes.S3_UPLOAD_FAILED
  readonly args: Record<string, string> | null
  readonly isRetryable: true
  readonly throwable?: unknown
}

/** Error indicating direct upload was cancelled by the user or client application. */
export type StorageErrorDirectUploadCancelled = {
  readonly id: ErrorId
  readonly code: typeof ClientStorageErrorCodes.DIRECT_UPLOAD_CANCELLED
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating file size exceeds maximum permitted limit during client pre-flight check. */
export type StorageErrorFileSizeExceedsLimit = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating file MIME type is unsupported during client pre-flight check. */
export type StorageErrorUnsupportedMimeType = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.UNSUPPORTED_MIME_TYPE
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating maximum permitted batch upload count was exceeded during client pre-flight check. */
export type StorageErrorMaxBatchUploadCountExceeded = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.MAX_BATCH_UPLOAD_COUNT_EXCEEDED
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/**
 * Discriminated union type representing storage domain errors instantiated on client.
 */
export type StorageError =
  | StorageErrorS3UploadFailed
  | StorageErrorDirectUploadCancelled
  | StorageErrorFileSizeExceedsLimit
  | StorageErrorUnsupportedMimeType
  | StorageErrorMaxBatchUploadCountExceeded

/**
 * Factory helper object for constructing {@link StorageError} plain objects.
 */
export const StorageError = {
  /**
   * Creates an S3 upload failure error.
   *
   * @param message - Diagnostic error message
   * @param throwable - Optional underlying cause
   * @returns {@link StorageErrorS3UploadFailed}
   */
  s3UploadFailed: (message?: string, throwable?: unknown): StorageErrorS3UploadFailed => ({
    id: generateErrorId(),
    code: ClientStorageErrorCodes.S3_UPLOAD_FAILED,
    args: message ? { [CommonErrorArgs.MESSAGE]: message } : null,
    isRetryable: true,
    throwable
  }),

  /**
   * Creates a direct upload cancelled error.
   *
   * @returns {@link StorageErrorDirectUploadCancelled}
   */
  directUploadCancelled: (): StorageErrorDirectUploadCancelled => ({
    id: generateErrorId(),
    code: ClientStorageErrorCodes.DIRECT_UPLOAD_CANCELLED,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates a file size exceeds limit error for client pre-flight validation.
   *
   * @param maxFileSizeBytes - Maximum permitted file size in bytes
   * @param fileSizeBytes - Actual file size provided in bytes
   * @param category - Storage category identifier
   * @param fileName - Target file name
   * @returns {@link StorageErrorFileSizeExceedsLimit}
   */
  fileSizeExceedsLimit: (
    maxFileSizeBytes?: number,
    fileSizeBytes?: number,
    category?: string,
    fileName?: string
  ): StorageErrorFileSizeExceedsLimit => {
    const args: Record<string, string> = {}
    if (maxFileSizeBytes != null) {
      args[StorageErrorArgs.MAX_FILE_SIZE_BYTES] = String(maxFileSizeBytes)
    }
    if (fileSizeBytes != null) {
      args[StorageErrorArgs.FILE_SIZE_BYTES] = String(fileSizeBytes)
    }
    if (category) {
      args[StorageErrorArgs.CATEGORY] = category
    }
    if (fileName) {
      args[StorageErrorArgs.FILE_NAME] = fileName
    }

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates an unsupported MIME type error for client pre-flight validation.
   *
   * @param mimeType - Rejected MIME type
   * @param category - Storage category identifier
   * @param fileName - Target file name
   * @returns {@link StorageErrorUnsupportedMimeType}
   */
  unsupportedMimeType: (
    mimeType?: string,
    category?: string,
    fileName?: string
  ): StorageErrorUnsupportedMimeType => {
    const args: Record<string, string> = {}
    if (mimeType) {
      args[StorageErrorArgs.MIME_TYPE] = mimeType
    }
    if (category) {
      args[StorageErrorArgs.CATEGORY] = category
    }
    if (fileName) {
      args[StorageErrorArgs.FILE_NAME] = fileName
    }

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.UNSUPPORTED_MIME_TYPE,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates a max batch upload count exceeded error for client pre-flight validation.
   *
   * @param maxBatchUploadCount - Maximum permitted files in a single batch
   * @returns {@link StorageErrorMaxBatchUploadCountExceeded}
   */
  maxBatchUploadCountExceeded: (maxBatchUploadCount?: number): StorageErrorMaxBatchUploadCountExceeded => ({
    id: generateErrorId(),
    code: StorageErrorCodes.MAX_BATCH_UPLOAD_COUNT_EXCEEDED,
    args: maxBatchUploadCount != null ? { [StorageErrorArgs.MAX_BATCH_UPLOAD_COUNT]: String(maxBatchUploadCount) } : null,
    isRetryable: false
  })
}

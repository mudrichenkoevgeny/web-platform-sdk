import { StorageErrorCodes, StorageErrorArgs, CommonErrorArgs, ClientStorageErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { generateErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { ErrorId } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Error indicating file size exceeds maximum permitted limit. */
export type StorageErrorFileSizeExceedsLimit = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating file size is below minimum permitted limit. */
export type StorageErrorFileSizeBelowMinimum = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_SIZE_BELOW_MINIMUM
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating file MIME type is unsupported. */
export type StorageErrorUnsupportedMimeType = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.UNSUPPORTED_MIME_TYPE
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating storage category is unsupported. */
export type StorageErrorUnsupportedStorageCategory = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.UNSUPPORTED_STORAGE_CATEGORY
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating storage quota is exceeded. */
export type StorageErrorStorageQuotaExceeded = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.STORAGE_QUOTA_EXCEEDED
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating too many active pending upload sessions exist. */
export type StorageErrorTooManyPendingUploads = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.TOO_MANY_PENDING_UPLOADS
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating presigned upload URL has expired. */
export type StorageErrorPresignedUrlExpired = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.PRESIGNED_URL_EXPIRED
  readonly args: null
  readonly isRetryable: true
}

/** Error indicating upload session token is invalid or malformed. */
export type StorageErrorInvalidUploadToken = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.INVALID_UPLOAD_TOKEN
  readonly args: null
  readonly isRetryable: false
}

/** Error indicating upload session was already completed. */
export type StorageErrorUploadAlreadyCompleted = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.UPLOAD_ALREADY_COMPLETED
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating file storage upload verification or transfer failed. */
export type StorageErrorStorageUploadFailed = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.STORAGE_UPLOAD_FAILED
  readonly args: Record<string, string> | null
  readonly isRetryable: true
}

/** Error indicating requested file was not found. */
export type StorageErrorFileNotFound = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_NOT_FOUND
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating requested file is processing and not ready yet. */
export type StorageErrorFileNotReady = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_NOT_READY
  readonly args: Record<string, string> | null
  readonly isRetryable: true
}

/** Error indicating file already exists. */
export type StorageErrorFileAlreadyExists = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_ALREADY_EXISTS
  readonly args: Record<string, string> | null
  readonly isRetryable: false
}

/** Error indicating file deletion failed. */
export type StorageErrorFileDeleteFailed = {
  readonly id: ErrorId
  readonly code: typeof StorageErrorCodes.FILE_DELETE_FAILED
  readonly args: Record<string, string> | null
  readonly isRetryable: true
}

/** Error indicating direct S3 upload failed. */
export type StorageErrorS3UploadFailed = {
  readonly id: ErrorId
  readonly code: typeof ClientStorageErrorCodes.S3_UPLOAD_FAILED
  readonly args: Record<string, string> | null
  readonly isRetryable: true
  readonly throwable?: unknown
}

/** Error indicating direct upload was cancelled. */
export type StorageErrorDirectUploadCancelled = {
  readonly id: ErrorId
  readonly code: typeof ClientStorageErrorCodes.DIRECT_UPLOAD_CANCELLED
  readonly args: null
  readonly isRetryable: false
}

/**
 * Discriminated union type representing storage domain errors.
 */
export type StorageError =
  | StorageErrorFileSizeExceedsLimit
  | StorageErrorFileSizeBelowMinimum
  | StorageErrorUnsupportedMimeType
  | StorageErrorUnsupportedStorageCategory
  | StorageErrorStorageQuotaExceeded
  | StorageErrorTooManyPendingUploads
  | StorageErrorPresignedUrlExpired
  | StorageErrorInvalidUploadToken
  | StorageErrorUploadAlreadyCompleted
  | StorageErrorStorageUploadFailed
  | StorageErrorFileNotFound
  | StorageErrorFileNotReady
  | StorageErrorFileAlreadyExists
  | StorageErrorFileDeleteFailed
  | StorageErrorS3UploadFailed
  | StorageErrorDirectUploadCancelled

/**
 * Factory helper object for constructing {@link StorageError} plain objects.
 */
export const StorageError = {
  /**
   * Creates a file size exceeds limit error.
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
    if (maxFileSizeBytes != null) args[StorageErrorArgs.MAX_FILE_SIZE_BYTES] = String(maxFileSizeBytes)
    if (fileSizeBytes != null) args[StorageErrorArgs.FILE_SIZE_BYTES] = String(fileSizeBytes)
    if (category) args[StorageErrorArgs.CATEGORY] = category
    if (fileName) args[StorageErrorArgs.FILE_NAME] = fileName

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates a file size below minimum error.
   *
   * @param minFileSizeBytes - Minimum required file size in bytes
   * @param fileSizeBytes - Actual file size provided in bytes
   * @param category - Storage category identifier
   * @param fileName - Target file name
   * @returns {@link StorageErrorFileSizeBelowMinimum}
   */
  fileSizeBelowMinimum: (
    minFileSizeBytes?: number,
    fileSizeBytes?: number,
    category?: string,
    fileName?: string
  ): StorageErrorFileSizeBelowMinimum => {
    const args: Record<string, string> = {}
    if (minFileSizeBytes != null) args[StorageErrorArgs.MIN_FILE_SIZE_BYTES] = String(minFileSizeBytes)
    if (fileSizeBytes != null) args[StorageErrorArgs.FILE_SIZE_BYTES] = String(fileSizeBytes)
    if (category) args[StorageErrorArgs.CATEGORY] = category
    if (fileName) args[StorageErrorArgs.FILE_NAME] = fileName

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.FILE_SIZE_BELOW_MINIMUM,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates an unsupported MIME type error.
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
    if (mimeType) args[StorageErrorArgs.MIME_TYPE] = mimeType
    if (category) args[StorageErrorArgs.CATEGORY] = category
    if (fileName) args[StorageErrorArgs.FILE_NAME] = fileName

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.UNSUPPORTED_MIME_TYPE,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates an unsupported storage category error.
   *
   * @param category - Rejected category name
   * @returns {@link StorageErrorUnsupportedStorageCategory}
   */
  unsupportedStorageCategory: (category?: string): StorageErrorUnsupportedStorageCategory => ({
    id: generateErrorId(),
    code: StorageErrorCodes.UNSUPPORTED_STORAGE_CATEGORY,
    args: category ? { [StorageErrorArgs.CATEGORY]: category } : null,
    isRetryable: false
  }),

  /**
   * Creates a storage quota exceeded error.
   *
   * @param quotaBytes - Total allocated storage quota in bytes
   * @param usedBytes - Current storage space used in bytes
   * @returns {@link StorageErrorStorageQuotaExceeded}
   */
  storageQuotaExceeded: (quotaBytes?: number, usedBytes?: number): StorageErrorStorageQuotaExceeded => {
    const args: Record<string, string> = {}
    if (quotaBytes != null) args[StorageErrorArgs.QUOTA_BYTES] = String(quotaBytes)
    if (usedBytes != null) args[StorageErrorArgs.USED_BYTES] = String(usedBytes)

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.STORAGE_QUOTA_EXCEEDED,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: false
    }
  },

  /**
   * Creates a too many pending uploads error.
   *
   * @param maxPendingUploads - Maximum permitted active upload sessions
   * @returns {@link StorageErrorTooManyPendingUploads}
   */
  tooManyPendingUploads: (maxPendingUploads?: number): StorageErrorTooManyPendingUploads => ({
    id: generateErrorId(),
    code: StorageErrorCodes.TOO_MANY_PENDING_UPLOADS,
    args: maxPendingUploads != null ? { [StorageErrorArgs.MAX_PENDING_UPLOADS]: String(maxPendingUploads) } : null,
    isRetryable: false
  }),

  /**
   * Creates a presigned URL expired error.
   *
   * @returns {@link StorageErrorPresignedUrlExpired}
   */
  presignedUrlExpired: (): StorageErrorPresignedUrlExpired => ({
    id: generateErrorId(),
    code: StorageErrorCodes.PRESIGNED_URL_EXPIRED,
    args: null,
    isRetryable: true
  }),

  /**
   * Creates an invalid upload token error.
   *
   * @returns {@link StorageErrorInvalidUploadToken}
   */
  invalidUploadToken: (): StorageErrorInvalidUploadToken => ({
    id: generateErrorId(),
    code: StorageErrorCodes.INVALID_UPLOAD_TOKEN,
    args: null,
    isRetryable: false
  }),

  /**
   * Creates an upload already completed error.
   *
   * @param fileId - Target file identifier
   * @returns {@link StorageErrorUploadAlreadyCompleted}
   */
  uploadAlreadyCompleted: (fileId?: string): StorageErrorUploadAlreadyCompleted => ({
    id: generateErrorId(),
    code: StorageErrorCodes.UPLOAD_ALREADY_COMPLETED,
    args: fileId ? { [StorageErrorArgs.FILE_ID]: fileId } : null,
    isRetryable: false
  }),

  /**
   * Creates a storage upload failed error.
   *
   * @param fileId - Target file identifier
   * @param message - Diagnostic details
   * @returns {@link StorageErrorStorageUploadFailed}
   */
  storageUploadFailed: (fileId?: string, message?: string): StorageErrorStorageUploadFailed => {
    const args: Record<string, string> = {}
    if (fileId) args[StorageErrorArgs.FILE_ID] = fileId
    if (message) args[CommonErrorArgs.MESSAGE] = message

    return {
      id: generateErrorId(),
      code: StorageErrorCodes.STORAGE_UPLOAD_FAILED,
      args: Object.keys(args).length > 0 ? args : null,
      isRetryable: true
    }
  },

  /**
   * Creates a file not found error.
   *
   * @param fileId - Requested file identifier
   * @returns {@link StorageErrorFileNotFound}
   */
  fileNotFound: (fileId?: string): StorageErrorFileNotFound => ({
    id: generateErrorId(),
    code: StorageErrorCodes.FILE_NOT_FOUND,
    args: fileId ? { [StorageErrorArgs.FILE_ID]: fileId } : null,
    isRetryable: false
  }),

  /**
   * Creates a file not ready error.
   *
   * @param fileId - Processing file identifier
   * @returns {@link StorageErrorFileNotReady}
   */
  fileNotReady: (fileId?: string): StorageErrorFileNotReady => ({
    id: generateErrorId(),
    code: StorageErrorCodes.FILE_NOT_READY,
    args: fileId ? { [StorageErrorArgs.FILE_ID]: fileId } : null,
    isRetryable: true
  }),

  /**
   * Creates a file already exists error.
   *
   * @param fileId - Existing file identifier
   * @returns {@link StorageErrorFileAlreadyExists}
   */
  fileAlreadyExists: (fileId?: string): StorageErrorFileAlreadyExists => ({
    id: generateErrorId(),
    code: StorageErrorCodes.FILE_ALREADY_EXISTS,
    args: fileId ? { [StorageErrorArgs.FILE_ID]: fileId } : null,
    isRetryable: false
  }),

  /**
   * Creates a file delete failed error.
   *
   * @param fileId - Target file identifier
   * @returns {@link StorageErrorFileDeleteFailed}
   */
  fileDeleteFailed: (fileId?: string): StorageErrorFileDeleteFailed => ({
    id: generateErrorId(),
    code: StorageErrorCodes.FILE_DELETE_FAILED,
    args: fileId ? { [StorageErrorArgs.FILE_ID]: fileId } : null,
    isRetryable: true
  }),

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
  })
}

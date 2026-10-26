import type { AppError, AppErrorParser } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { getAppErrorArgAsString } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageErrorCodes,
  StorageErrorArgs,
  ClientStorageErrorCodes,
  StorageModuleStrings,
  storageStrings,
  formatByteSize
} from '@mudrichenkoevgeny/shared-foundation'

/**
 * AppErrorParser implementation for storage-domain error codes.
 */
export class StorageErrorParser implements AppErrorParser {
  private readonly getStrings: () => StorageModuleStrings

  /**
   * Constructs a new {@link StorageErrorParser}.
   *
   * @param stringsOrGetter - Storage strings dictionary or dynamic getter function returning current strings
   */
  public constructor(
    stringsOrGetter: StorageModuleStrings | (() => StorageModuleStrings) = storageStrings
  ) {
    this.getStrings = typeof stringsOrGetter === 'function' ? stringsOrGetter : () => stringsOrGetter
  }

  /**
   * Parses storage domain errors into localized string messages.
   *
   * @param appError - Application error instance
   * @returns Localized string message or null if code is unhandled by this parser
   */
  public parse(appError: AppError): string | null {
    const args = appError.args ?? {}
    const strings = this.getStrings()

    switch (appError.code) {
      case StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT: {
        const maxBytes = getAppErrorArgAsString(args, StorageErrorArgs.MAX_FILE_SIZE_BYTES)
        if (maxBytes) {
          return strings.errors.fileSizeExceedsLimit(formatByteSize(maxBytes))
        }
        return strings.errors.fileSizeExceedsLimitWithoutArgs
      }

      case StorageErrorCodes.FILE_SIZE_BELOW_MINIMUM: {
        const minBytes = getAppErrorArgAsString(args, StorageErrorArgs.MIN_FILE_SIZE_BYTES)
        if (minBytes) {
          return strings.errors.fileSizeBelowMinimum(formatByteSize(minBytes))
        }
        return strings.errors.fileSizeBelowMinimumWithoutArgs
      }

      case StorageErrorCodes.UNSUPPORTED_MIME_TYPE:
        return strings.errors.unsupportedMimeType

      case StorageErrorCodes.UNSUPPORTED_STORAGE_CATEGORY:
        return strings.errors.unsupportedStorageCategory

      case StorageErrorCodes.STORAGE_QUOTA_EXCEEDED: {
        const used = getAppErrorArgAsString(args, StorageErrorArgs.USED_BYTES)
        const quota = getAppErrorArgAsString(args, StorageErrorArgs.QUOTA_BYTES)
        if (used && quota) {
          return strings.errors.storageQuotaExceeded(formatByteSize(used), formatByteSize(quota))
        }
        return strings.errors.storageQuotaExceededWithoutArgs
      }

      case StorageErrorCodes.TOO_MANY_PENDING_UPLOADS:
        return this.resolveLocalizedString(
          args,
          StorageErrorArgs.MAX_PENDING_UPLOADS,
          (maxPending) => strings.errors.tooManyPendingUploads(maxPending),
          strings.errors.tooManyPendingUploadsWithoutArgs
        )

      case StorageErrorCodes.PRESIGNED_URL_EXPIRED:
        return strings.errors.presignedUrlExpired

      case StorageErrorCodes.INVALID_UPLOAD_TOKEN:
        return strings.errors.storageError

      case StorageErrorCodes.UPLOAD_ALREADY_COMPLETED:
        return strings.errors.uploadAlreadyCompleted

      case StorageErrorCodes.STORAGE_UPLOAD_FAILED:
      case ClientStorageErrorCodes.S3_UPLOAD_FAILED:
        return strings.errors.storageUploadFailed

      case ClientStorageErrorCodes.DIRECT_UPLOAD_CANCELLED:
        return strings.errors.uploadCancelled

      case StorageErrorCodes.FILE_NOT_FOUND:
        return strings.errors.fileNotFound

      case StorageErrorCodes.FILE_NOT_READY:
        return strings.errors.fileNotReady

      case StorageErrorCodes.FILE_ALREADY_EXISTS:
        return strings.errors.fileAlreadyExists

      case StorageErrorCodes.FILE_DELETE_FAILED:
        return strings.errors.fileDeleteFailed

      default:
        return null
    }
  }

  private resolveLocalizedString(
    args: Record<string, unknown>,
    key: string,
    withArgsFormatter: (value: string) => string,
    fallback: string
  ): string {
    const value = getAppErrorArgAsString(args, key)
    if (value) {
      return withArgsFormatter(value)
    }
    return fallback
  }
}

import { describe, it, expect } from 'vitest'
import { StorageErrorCodes, StorageErrorArgs, CommonErrorArgs, ClientStorageErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { StorageError } from './storage-error'

describe('StorageError', () => {
  it('creates fileSizeExceedsLimit error with all arguments', () => {
    const error = StorageError.fileSizeExceedsLimit(1024, 2048, 'IMAGE', 'photo.jpg')
    expect(error.code).toBe(StorageErrorCodes.FILE_SIZE_EXCEEDS_LIMIT)
    expect(error.isRetryable).toBe(false)
    expect(error.args).toEqual({
      [StorageErrorArgs.MAX_FILE_SIZE_BYTES]: '1024',
      [StorageErrorArgs.FILE_SIZE_BYTES]: '2048',
      [StorageErrorArgs.CATEGORY]: 'IMAGE',
      [StorageErrorArgs.FILE_NAME]: 'photo.jpg'
    })
    expect(error.id).toBeDefined()
  })

  it('creates fileSizeBelowMinimum error', () => {
    const error = StorageError.fileSizeBelowMinimum(10, 0, 'DOCUMENT', 'doc.pdf')
    expect(error.code).toBe(StorageErrorCodes.FILE_SIZE_BELOW_MINIMUM)
    expect(error.isRetryable).toBe(false)
    expect(error.args).toEqual({
      [StorageErrorArgs.MIN_FILE_SIZE_BYTES]: '10',
      [StorageErrorArgs.FILE_SIZE_BYTES]: '0',
      [StorageErrorArgs.CATEGORY]: 'DOCUMENT',
      [StorageErrorArgs.FILE_NAME]: 'doc.pdf'
    })
  })

  it('creates unsupportedMimeType error', () => {
    const error = StorageError.unsupportedMimeType('application/exe', 'OTHER', 'app.exe')
    expect(error.code).toBe(StorageErrorCodes.UNSUPPORTED_MIME_TYPE)
    expect(error.args).toEqual({
      [StorageErrorArgs.MIME_TYPE]: 'application/exe',
      [StorageErrorArgs.CATEGORY]: 'OTHER',
      [StorageErrorArgs.FILE_NAME]: 'app.exe'
    })
  })

  it('creates unsupportedStorageCategory error', () => {
    const error = StorageError.unsupportedStorageCategory('invalid_cat')
    expect(error.code).toBe(StorageErrorCodes.UNSUPPORTED_STORAGE_CATEGORY)
    expect(error.args).toEqual({
      [StorageErrorArgs.CATEGORY]: 'invalid_cat'
    })
  })

  it('creates storageQuotaExceeded error', () => {
    const error = StorageError.storageQuotaExceeded(10000, 10500)
    expect(error.code).toBe(StorageErrorCodes.STORAGE_QUOTA_EXCEEDED)
    expect(error.args).toEqual({
      [StorageErrorArgs.QUOTA_BYTES]: '10000',
      [StorageErrorArgs.USED_BYTES]: '10500'
    })
    expect(error.isRetryable).toBe(false)
  })

  it('creates tooManyPendingUploads error', () => {
    const error = StorageError.tooManyPendingUploads(5)
    expect(error.code).toBe(StorageErrorCodes.TOO_MANY_PENDING_UPLOADS)
    expect(error.args).toEqual({
      [StorageErrorArgs.MAX_PENDING_UPLOADS]: '5'
    })
  })

  it('creates presignedUrlExpired error', () => {
    const error = StorageError.presignedUrlExpired()
    expect(error.code).toBe(StorageErrorCodes.PRESIGNED_URL_EXPIRED)
    expect(error.isRetryable).toBe(true)
  })

  it('creates invalidUploadToken error', () => {
    const error = StorageError.invalidUploadToken()
    expect(error.code).toBe(StorageErrorCodes.INVALID_UPLOAD_TOKEN)
    expect(error.isRetryable).toBe(false)
  })

  it('creates uploadAlreadyCompleted error', () => {
    const error = StorageError.uploadAlreadyCompleted('file-123')
    expect(error.code).toBe(StorageErrorCodes.UPLOAD_ALREADY_COMPLETED)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123'
    })
    expect(error.isRetryable).toBe(false)
  })

  it('creates storageUploadFailed error', () => {
    const error = StorageError.storageUploadFailed('file-123', 'Network timeout')
    expect(error.code).toBe(StorageErrorCodes.STORAGE_UPLOAD_FAILED)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123',
      [CommonErrorArgs.MESSAGE]: 'Network timeout'
    })
    expect(error.isRetryable).toBe(true)
  })

  it('creates fileNotFound error', () => {
    const error = StorageError.fileNotFound('file-123')
    expect(error.code).toBe(StorageErrorCodes.FILE_NOT_FOUND)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123'
    })
    expect(error.isRetryable).toBe(false)
  })

  it('creates fileNotReady error', () => {
    const error = StorageError.fileNotReady('file-123')
    expect(error.code).toBe(StorageErrorCodes.FILE_NOT_READY)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123'
    })
    expect(error.isRetryable).toBe(true)
  })

  it('creates fileAlreadyExists error', () => {
    const error = StorageError.fileAlreadyExists('file-123')
    expect(error.code).toBe(StorageErrorCodes.FILE_ALREADY_EXISTS)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123'
    })
    expect(error.isRetryable).toBe(false)
  })

  it('creates fileDeleteFailed error', () => {
    const error = StorageError.fileDeleteFailed('file-123')
    expect(error.code).toBe(StorageErrorCodes.FILE_DELETE_FAILED)
    expect(error.args).toEqual({
      [StorageErrorArgs.FILE_ID]: 'file-123'
    })
    expect(error.isRetryable).toBe(true)
  })

  it('creates s3UploadFailed error', () => {
    const cause = new Error('Connection reset')
    const error = StorageError.s3UploadFailed('Upload failed', cause)
    expect(error.code).toBe(ClientStorageErrorCodes.S3_UPLOAD_FAILED)
    expect(error.args).toEqual({
      [CommonErrorArgs.MESSAGE]: 'Upload failed'
    })
    expect(error.isRetryable).toBe(true)
    expect(error.throwable).toBe(cause)
  })

  it('creates directUploadCancelled error', () => {
    const error = StorageError.directUploadCancelled()
    expect(error.code).toBe(ClientStorageErrorCodes.DIRECT_UPLOAD_CANCELLED)
    expect(error.args).toBeNull()
    expect(error.isRetryable).toBe(false)
  })

  it('supports JSON serialization / deserialization', () => {
    const original = StorageError.fileSizeExceedsLimit(2048, 4096, 'DOCUMENT', 'report.pdf')
    const serialized = JSON.stringify(original)
    const deserialized = JSON.parse(serialized) as typeof original

    expect(deserialized).toEqual(original)
    expect(deserialized.code).toBe('FILE_SIZE_EXCEEDS_LIMIT')
    expect(deserialized.args).toEqual({
      maxFileSizeBytes: '2048',
      fileSizeBytes: '4096',
      category: 'DOCUMENT',
      fileName: 'report.pdf'
    })
  })
})

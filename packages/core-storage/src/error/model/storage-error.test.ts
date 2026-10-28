import { describe, it, expect } from 'vitest'
import { StorageErrorCodes, StorageErrorArgs, CommonErrorArgs, ClientStorageErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { StorageError } from './storage-error'

describe('StorageError', () => {
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

  it('creates unsupportedMimeType error', () => {
    const error = StorageError.unsupportedMimeType('application/exe', 'OTHER', 'app.exe')
    expect(error.code).toBe(StorageErrorCodes.UNSUPPORTED_MIME_TYPE)
    expect(error.args).toEqual({
      [StorageErrorArgs.MIME_TYPE]: 'application/exe',
      [StorageErrorArgs.CATEGORY]: 'OTHER',
      [StorageErrorArgs.FILE_NAME]: 'app.exe'
    })
  })

  it('creates maxBatchUploadCountExceeded error', () => {
    const error = StorageError.maxBatchUploadCountExceeded(5)
    expect(error.code).toBe(StorageErrorCodes.MAX_BATCH_UPLOAD_COUNT_EXCEEDED)
    expect(error.args).toEqual({
      [StorageErrorArgs.MAX_BATCH_UPLOAD_COUNT]: '5'
    })
  })
})

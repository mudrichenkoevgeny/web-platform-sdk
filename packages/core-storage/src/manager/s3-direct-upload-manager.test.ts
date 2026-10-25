import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ClientStorageErrorCodes } from '@mudrichenkoevgeny/shared-foundation'
import { S3DirectUploadManagerImpl, uploadFileToS3 } from './s3-direct-upload-manager'

describe('S3DirectUploadManagerImpl', () => {
  let mockXHR: any
  let manager: S3DirectUploadManagerImpl

  beforeEach(() => {
    manager = new S3DirectUploadManagerImpl()

    mockXHR = {
      open: vi.fn(),
      setRequestHeader: vi.fn(),
      send: vi.fn(),
      upload: {},
      status: 200,
      onload: null,
      onerror: null
    }

    vi.stubGlobal('XMLHttpRequest', vi.fn(() => mockXHR))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves success when XHR status is 200', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const promise = manager.uploadFile('https://s3.example.com/upload', file)

    mockXHR.status = 200
    if (mockXHR.onload) {
      mockXHR.onload()
    }

    const result = await promise
    expect(result.success).toBe(true)
    expect(mockXHR.open).toHaveBeenCalledWith('PUT', 'https://s3.example.com/upload', true)
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'text/plain')
  })

  it('tracks progress callbacks', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const onProgress = vi.fn()
    const promise = manager.uploadFile('https://s3.example.com/upload', file, onProgress)

    if (mockXHR.upload.onprogress) {
      mockXHR.upload.onprogress({ lengthComputable: true, loaded: 50, total: 100 })
    }

    mockXHR.status = 200
    if (mockXHR.onload) {
      mockXHR.onload()
    }

    await promise
    expect(onProgress).toHaveBeenCalledWith(50)
  })

  it('returns StorageError with S3_UPLOAD_FAILED code when XHR status is 500', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const promise = manager.uploadFile('https://s3.example.com/upload', file)

    mockXHR.status = 500
    if (mockXHR.onload) {
      mockXHR.onload()
    }

    const result = await promise
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(ClientStorageErrorCodes.S3_UPLOAD_FAILED)
    }
  })

  it('returns StorageError with S3_UPLOAD_FAILED code when XHR onerror triggers', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    const promise = uploadFileToS3('https://s3.example.com/upload', file)

    if (mockXHR.onerror) {
      mockXHR.onerror()
    }

    const result = await promise
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe(ClientStorageErrorCodes.S3_UPLOAD_FAILED)
    }
  })
})

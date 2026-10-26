import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { StorageWebSocketEventTypes } from '@mudrichenkoevgeny/shared-foundation'
import * as CoreStorageModule from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { StorageApi } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { OpenStorageRepositoryImpl } from './open-storage-repository-impl'

describe('OpenStorageRepositoryImpl', () => {
  let mockApi: StorageApi
  let mockWebSocketService: WebSocketService
  let wsCallback: ((frame: SocketFrame) => void) | null = null

  beforeEach(() => {
    wsCallback = null

    mockApi = {
      getFiles: vi.fn(),
      getFileDetail: vi.fn(),
      getPresignedUploadUrl: vi.fn(),
      confirmUpload: vi.fn(),
      deleteFile: vi.fn(),
      deleteFilesBatch: vi.fn()
    }

    mockWebSocketService = {
      observeEvents: vi.fn((cb) => {
        wsCallback = cb
        return () => {}
      })
    } as unknown as WebSocketService
  })

  it('maps paged result DTOs to domain models in getSelfFiles', async () => {
    const mockPagedPayload = {
      items: [
        {
          id: 'file-1',
          fileName: 'photo.jpg',
          fileSizeBytes: 1024,
          mimeType: 'image/jpeg',
          category: 'IMAGE',
          fileUrl: 'https://cdn.example.com/file-1'
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      totalElements: 1,
      totalCount: 1,
      totalPages: 1
    }
    vi.mocked(mockApi.getFiles).mockResolvedValue(appResultSuccess(mockPagedPayload as any))

    const repository = new OpenStorageRepositoryImpl(mockApi, mockWebSocketService)
    const result = await repository.getSelfFiles({ pageNumber: 1 })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.items[0]?.id).toBe('file-1')
      expect(result.data.items[0]?.fileName).toBe('photo.jpg')
    }
  })

  it('notifies observers when STORAGE_FILE_UPDATED WS event is received', async () => {
    const repository = new OpenStorageRepositoryImpl(mockApi, mockWebSocketService)
    const observer = vi.fn()
    repository.observeFileUpdates(observer)

    const filePayload = {
      file_id: 'file-ws-1',
      owner_user_id: 'user-1',
      target_scope: 'AVATAR',
      category: 'IMAGE',
      file_name: 'updated.jpg',
      file_size_bytes: 2048,
      mime_type: 'image/jpeg',
      visibility: 'PUBLIC',
      status: 'READY',
      file_url: 'https://cdn.example.com/file-ws-1',
      created_at: 1000,
      updated_at: 2000
    }

    if (wsCallback) {
      wsCallback({
        id: 'frame-ws-1',
        type: StorageWebSocketEventTypes.STORAGE_FILE_UPDATED,
        payload: filePayload,
        metadata: {},
        timestamp: Date.now()
      })
    }

    expect(observer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'file-ws-1',
        fileName: 'updated.jpg'
      })
    )
  })

  it('executes full upload flow in uploadFile', async () => {
    const repository = new OpenStorageRepositoryImpl(mockApi, mockWebSocketService)
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const presigned = {
      fileId: 'file-99',
      uploadUrl: 'https://s3.example.com/upload-99',
      fileUrl: 'https://cdn.example.com/file-99',
      expiresAtMillis: Date.now() + 60000
    }
    const confirmedPayload = {
      id: 'file-99',
      owner_user_id: 'user-1',
      target_scope: 'AVATAR',
      category: 'IMAGE',
      file_name: 'test.png',
      file_size_bytes: 7,
      mime_type: 'image/png',
      visibility: 'PUBLIC',
      status: 'READY',
      file_url: 'https://cdn.example.com/file-99',
      created_at_millis: Date.now(),
      updated_at_millis: Date.now()
    }

    vi.mocked(mockApi.getPresignedUploadUrl).mockResolvedValue(appResultSuccess(presigned as any))
    vi.spyOn(CoreStorageModule, 'uploadFileToS3').mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.confirmUpload).mockResolvedValue(appResultSuccess(confirmedPayload as any))

    const result = await repository.uploadFile(file, 'IMAGE', 'PUBLIC', 'AVATAR')
    expect(result.success).toBe(true)
    expect(mockApi.getPresignedUploadUrl).toHaveBeenCalledWith({
      fileName: 'test.png',
      fileSizeBytes: 7,
      mimeType: 'image/png',
      category: 'IMAGE',
      visibility: 'PUBLIC',
      targetScope: 'AVATAR'
    })
    expect(CoreStorageModule.uploadFileToS3).toHaveBeenCalledWith('https://s3.example.com/upload-99', file, undefined)
    expect(mockApi.confirmUpload).toHaveBeenCalledWith('file-99')
  })

  it('delegates deleteFile and deleteFilesBatch to api', async () => {
    const repository = new OpenStorageRepositoryImpl(mockApi, mockWebSocketService)
    vi.mocked(mockApi.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))

    await repository.deleteFile('file-123')
    expect(mockApi.deleteFile).toHaveBeenCalledWith('file-123')

    await repository.deleteFilesBatch(['file-1', 'file-2'])
    expect(mockApi.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: ['file-1', 'file-2'] })
  })
})

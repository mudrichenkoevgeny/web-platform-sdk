import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultFailure, appResultSuccess, CommonError, isFailure, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { WebSocketService, SocketFrame } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  StorageWebSocketEventTypes,
  UserStorageTargetScopes,
  StorageCategory,
  StorageFileVisibility,
  toFileIdOrThrow,
  createTestStorageFilePrivate,
  createTestPagedResult,
  createTestStorageFileSummaryList
} from '@mudrichenkoevgeny/shared-foundation'
import type { PresignedUrl, StorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import * as DirectUploaderModule from '../../uploader/direct-file-uploader'
import type { StorageApi } from '../../network/api/base/storage-api'
import { SelfManagementStorageRepositoryImpl } from './self-management-storage-repository-impl'

describe('SelfManagementStorageRepositoryImpl', () => {
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

  it('delegates getFiles to API and returns paged result', async () => {
    const expectedPaged = createTestPagedResult({ items: createTestStorageFileSummaryList(2) })
    vi.mocked(mockApi.getFiles).mockResolvedValue(appResultSuccess(expectedPaged))

    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const result = await repository.getFiles({ pageNumber: 1 })

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedPaged)
    }
    expect(mockApi.getFiles).toHaveBeenCalledWith({ pageNumber: 1 })
  })

  it('delegates getFileDetail to API and returns file detail on success', async () => {
    const fileId = toFileIdOrThrow('file-123')
    const expectedDetail = createTestStorageFilePrivate({ id: fileId })
    vi.mocked(mockApi.getFileDetail).mockResolvedValue(appResultSuccess(expectedDetail))

    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const result = await repository.getFileDetail(fileId)

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(expectedDetail)
    }
    expect(mockApi.getFileDetail).toHaveBeenCalledWith(fileId)
  })

  it('executes direct upload flow in uploadFile', async () => {
    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const fileId = toFileIdOrThrow('file-99')
    const presigned: PresignedUrl = {
      fileId,
      uploadUrl: 'https://s3.example.com/upload-99',
      fileUrl: 'https://cdn.example.com/file-99',
      expiresAt: Date.now() + 60000
    }
    const confirmedPayload: StorageFilePrivate = createTestStorageFilePrivate({
      id: fileId,
      fileName: 'test.png'
    })

    vi.mocked(mockApi.getPresignedUploadUrl).mockResolvedValue(appResultSuccess(presigned))
    vi.spyOn(DirectUploaderModule, 'uploadFileDirectly').mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.confirmUpload).mockResolvedValue(appResultSuccess(confirmedPayload))

    const result = await repository.uploadFile(file, StorageCategory.IMAGE, StorageFileVisibility.PUBLIC, UserStorageTargetScopes.AVATAR)
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data).toEqual(confirmedPayload)
    }
  })

  it('returns failure when presigned url request fails', async () => {
    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const file = new File(['content'], 'test.png', { type: 'image/png' })
    const expectedError = CommonError.unknown()
    vi.mocked(mockApi.getPresignedUploadUrl).mockResolvedValue(appResultFailure(expectedError))

    const result = await repository.uploadFile(file, StorageCategory.IMAGE, StorageFileVisibility.PUBLIC, UserStorageTargetScopes.AVATAR)
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error.code).toEqual(expectedError.code)
    }
  })

  it('delegates deleteFile and deleteFilesBatch to API', async () => {
    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const fileId = toFileIdOrThrow('file-123')
    vi.mocked(mockApi.deleteFile).mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.deleteFilesBatch).mockResolvedValue(appResultSuccess(undefined))

    await repository.deleteFile(fileId)
    expect(mockApi.deleteFile).toHaveBeenCalledWith(fileId)

    await repository.deleteFilesBatch([fileId])
    expect(mockApi.deleteFilesBatch).toHaveBeenCalledWith({ fileIds: [fileId] })
  })

  it('notifies observers when STORAGE_FILE_UPDATED WS event is received', async () => {
    const repository = new SelfManagementStorageRepositoryImpl(mockApi, mockWebSocketService)
    const observer = vi.fn()
    repository.observeFileUpdates(observer)

    const filePayload = {
      file_id: '00000000-0000-0000-0000-000000000002',
      owner_user_id: '00000000-0000-0000-0000-000000000001',
      target_scope: 'AVATAR',
      category: 'IMAGE',
      file_name: 'updated.jpg',
      file_size_bytes: 2048,
      mime_type: 'image/jpeg',
      visibility: 'PUBLIC',
      status: 'READY',
      file_urls: { original_url: 'https://cdn.example.com/file-ws-1' },
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
        id: '00000000-0000-0000-0000-000000000002',
        fileName: 'updated.jpg'
      })
    )
  })
})

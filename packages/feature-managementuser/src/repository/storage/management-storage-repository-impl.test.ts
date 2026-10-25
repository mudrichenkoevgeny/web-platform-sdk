import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import * as CoreStorageModule from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { ManagementStorageApi } from '../../network/api/storage/management-storage-api'
import { ManagementStorageRepositoryImpl } from './management-storage-repository-impl'

describe('ManagementStorageRepositoryImpl', () => {
  const mockApi: ManagementStorageApi = {
    getFiles: vi.fn(),
    getFileDetail: vi.fn(),
    getPresignedUploadUrl: vi.fn(),
    confirmUpload: vi.fn()
  }

  const repository = new ManagementStorageRepositoryImpl(mockApi)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps paged result DTOs to domain models in getFiles', async () => {
    const mockPagedPayload = {
      items: [
        {
          file_id: 'file-m-1',
          owner_user_id: 'user-m-1',
          target_scope: 'PROMOTION',
          category: 'IMAGE',
          file_name: 'banner.png',
          file_size_bytes: 2048,
          mime_type: 'image/png',
          visibility: 'PUBLIC',
          status: 'READY',
          file_url: 'https://cdn.example.com/file-m-1',
          created_at_millis: 1000,
          updated_at_millis: 2000
        }
      ],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1
    }
    vi.mocked(mockApi.getFiles).mockResolvedValue(appResultSuccess(mockPagedPayload as any))

    const result = await repository.getFiles({ page: 0 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.items[0].fileId).toBe('file-m-1')
      expect(result.data.items[0].fileName).toBe('banner.png')
    }
  })

  it('maps private file detail DTO to domain model in getFileDetail', async () => {
    const mockPrivatePayload = {
      file_id: 'file-m-1',
      owner_user_id: 'user-m-1',
      target_scope: 'PROMOTION',
      category: 'IMAGE',
      file_name: 'banner.png',
      file_size_bytes: 2048,
      mime_type: 'image/png',
      visibility: 'PUBLIC',
      status: 'READY',
      file_url: 'https://cdn.example.com/file-m-1',
      created_at_millis: 1000,
      updated_at_millis: 2000
    }
    vi.mocked(mockApi.getFileDetail).mockResolvedValue(appResultSuccess(mockPrivatePayload as any))

    const result = await repository.getFileDetail('file-m-1')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.fileId).toBe('file-m-1')
    }
  })

  it('executes full upload flow in uploadFile', async () => {
    const file = new File(['content'], 'admin-doc.pdf', { type: 'application/pdf' })
    const presigned = {
      file_id: 'file-m-99',
      upload_url: 'https://s3.example.com/upload-admin',
      file_url: 'https://cdn.example.com/file-m-99',
      expires_at: Date.now() + 60000
    }
    const confirmedPayload = {
      file_id: 'file-m-99',
      owner_user_id: 'user-m-1',
      target_scope: 'SYSTEM',
      category: 'DOCUMENT',
      file_name: 'admin-doc.pdf',
      file_size_bytes: 7,
      mime_type: 'application/pdf',
      visibility: 'PRIVATE',
      status: 'READY',
      file_url: 'https://cdn.example.com/file-m-99',
      created_at_millis: Date.now(),
      updated_at_millis: Date.now()
    }

    vi.mocked(mockApi.getPresignedUploadUrl).mockResolvedValue(appResultSuccess(presigned as any))
    vi.spyOn(CoreStorageModule, 'uploadFileToS3').mockResolvedValue(appResultSuccess(undefined))
    vi.mocked(mockApi.confirmUpload).mockResolvedValue(appResultSuccess(confirmedPayload as any))

    const result = await repository.uploadFile(file, 'DOCUMENT', 'PRIVATE', 'SYSTEM')
    expect(result.success).toBe(true)
    expect(mockApi.getPresignedUploadUrl).toHaveBeenCalledWith('admin-doc.pdf', 7, 'application/pdf', 'DOCUMENT', 'PRIVATE', 'SYSTEM')
    expect(CoreStorageModule.uploadFileToS3).toHaveBeenCalledWith('https://s3.example.com/upload-admin', file, undefined)
    expect(mockApi.confirmUpload).toHaveBeenCalledWith('file-m-99')
  })

  it('short-circuits on presigned url failure in uploadFile', async () => {
    const file = new File(['content'], 'admin-doc.pdf', { type: 'application/pdf' })
    vi.mocked(mockApi.getPresignedUploadUrl).mockResolvedValue(appResultFailure(CommonError.unknown()))

    const result = await repository.uploadFile(file, 'DOCUMENT', 'PRIVATE', 'SYSTEM')
    expect(result.success).toBe(false)
    expect(mockApi.confirmUpload).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { createStorageFileUploadStore, UploadQueueItemStatus } from './storage-file-upload-store'

describe('createStorageFileUploadStore', () => {
  const createMockDeps = () => ({
    uploadFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestStorageFilePrivate()))
    },
    onUploaded: vi.fn(),
    onBack: vi.fn()
  })

  it('adds files to items queue with deduplication', () => {
    const deps = createMockDeps()
    const store = createStorageFileUploadStore(deps, {})

    const file1 = new File(['content'], 'test1.jpg', { type: 'image/jpeg' })
    const file2 = new File(['content'], 'test1.jpg', { type: 'image/jpeg' })
    const file3 = new File(['content2'], 'test2.png', { type: 'image/png' })

    store.getState().addFiles([file1, file2, file3])

    const items = store.getState().items
    expect(items.length).toBe(2)
    expect(items[0]?.file.name).toBe('test1.jpg')
    expect(items[1]?.file.name).toBe('test2.png')
  })

  it('marks file as FAILED when exceeding maxFileSizeBytes', () => {
    const deps = createMockDeps()
    const store = createStorageFileUploadStore(deps, { maxFileSizeBytes: 100 })

    const smallFile = new File(['123'], 'small.txt', { type: 'text/plain' })
    const largeFile = new File(['a'.repeat(200)], 'large.txt', { type: 'text/plain' })

    store.getState().addFiles([smallFile, largeFile])

    const items = store.getState().items
    expect(items[0]?.status).toBe(UploadQueueItemStatus.IDLE)
    expect(items[1]?.status).toBe(UploadQueueItemStatus.FAILED)
    expect(items[1]?.error).toBeDefined()
  })

  it('removes item from queue', () => {
    const deps = createMockDeps()
    const store = createStorageFileUploadStore(deps, {})

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    store.getState().addFiles([file])

    const itemId = store.getState().items[0]!.id
    store.getState().removeItem(itemId)

    expect(store.getState().items.length).toBe(0)
  })

  it('uploads files concurrently and invokes onUploaded when complete', async () => {
    const deps = createMockDeps()
    const store = createStorageFileUploadStore(deps, {})

    const file1 = new File(['1'], 'file1.jpg', { type: 'image/jpeg' })
    const file2 = new File(['2'], 'file2.jpg', { type: 'image/jpeg' })

    store.getState().addFiles([file1, file2])
    await store.getState().upload()

    expect(deps.uploadFileUseCase.execute).toHaveBeenCalledTimes(2)
    expect(deps.onUploaded).toHaveBeenCalledTimes(1)
    expect(store.getState().items.every((i) => i.status === UploadQueueItemStatus.COMPLETED)).toBe(true)
  })
})

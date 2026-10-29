import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { createStorageFileDetailStore, StorageFileDetailStatus } from './storage-file-detail-store'

describe('createStorageFileDetailStore', () => {
  const createMockDeps = () => ({
    fileId: 'file-123',
    getFileDetailUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestStorageFilePrivate()))
    },
    deleteFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    onBack: vi.fn()
  })

  it('initializes screen and loads file detail', async () => {
    const deps = createMockDeps()
    const store = createStorageFileDetailStore(deps)

    await store.getState().initScreen()

    expect(deps.getFileDetailUseCase.execute).toHaveBeenCalledWith('file-123')
    expect(store.getState().screenState.status).toBe(StorageFileDetailStatus.CONTENT)
  })

  it('deletes file and triggers back navigation', async () => {
    const deps = createMockDeps()
    const store = createStorageFileDetailStore(deps)

    await store.getState().initScreen()
    store.getState().onDeleteClick()
    await store.getState().onConfirmDelete()

    expect(deps.deleteFileUseCase.execute).toHaveBeenCalledWith('file-123')
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestStorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { createStorageFileListStore, StorageFileListStatus } from './storage-file-list-store'
import { createSelfStorageFileListDataSource } from './storage-file-list-data-source'

describe('createStorageFileListStore', () => {
  const createMockDeps = () => {
    const getFilesSpy = vi.fn().mockResolvedValue(
      appResultSuccess(createTestPagedResult({ items: [createTestStorageFileSummary()] }))
    )
    return {
      getFilesSpy,
      dataSource: createSelfStorageFileListDataSource({
        getFilesUseCase: {
          execute: getFilesSpy
        },
        deleteFileUseCase: {
          execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
        },
        deleteFilesBatchUseCase: {
          execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
        }
      }),
      onBack: vi.fn()
    }
  }

  it('initializes screen and fetches file list', async () => {
    const deps = createMockDeps()
    const store = createStorageFileListStore(deps)

    await store.getState().initScreen()

    expect(deps.getFilesSpy).toHaveBeenCalled()
    expect(store.getState().screenState.status).toBe(StorageFileListStatus.CONTENT)
  })
})

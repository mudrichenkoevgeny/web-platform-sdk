import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestStorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileListScreen, StorageFileListTestTags } from './StorageFileListScreen'
import type { StorageFileListStoreDependencies } from './storage-file-list-store'
import { createSelfStorageFileListDataSource } from './storage-file-list-data-source'

describe('StorageFileListScreen', () => {
  const createMockDeps = (): StorageFileListStoreDependencies => ({
    dataSource: createSelfStorageFileListDataSource({
      getFilesUseCase: {
        execute: vi.fn().mockResolvedValue(
          appResultSuccess(createTestPagedResult({ items: [createTestStorageFileSummary()] }))
        )
      }
    }),
    onBack: vi.fn()
  })

  it('renders screen title and list content', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileListTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(StorageFileListTestTags.FILE_LIST)).toBeDefined()
  })
})

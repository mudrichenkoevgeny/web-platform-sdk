import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileDetailScreen, StorageFileDetailTestTags } from './StorageFileDetailScreen'
import type { StorageFileDetailStoreDependencies } from './storage-file-detail-store'

describe('StorageFileDetailScreen', () => {
  const createMockDeps = (): StorageFileDetailStoreDependencies => ({
    fileId: 'file-1',
    getFileDetailUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestStorageFilePrivate()))
    },
    deleteFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    onBack: vi.fn()
  })

  it('renders screen title and copy button when content loads', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileDetailTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(StorageFileDetailTestTags.COPY_URL_BUTTON)).toBeDefined()
  })
})

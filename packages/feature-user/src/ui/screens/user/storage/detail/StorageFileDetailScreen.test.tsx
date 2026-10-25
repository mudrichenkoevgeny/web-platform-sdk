import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultFailure, appResultSuccess, CommonError, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate, storageStrings, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileDetailScreen, StorageFileDetailTestTags } from './StorageFileDetailScreen'
import type { StorageFileDetailStoreDependencies } from './storage-file-detail-store'

describe('StorageFileDetailScreen', () => {
  const createMockDeps = (): StorageFileDetailStoreDependencies => ({
    fileId: 'file-123',
    getFileDetailUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess(
          createTestStorageFilePrivate({
            id: toFileIdOrThrow('file-123'),
            fileName: 'sample-image.png',
            fileUrl: 'https://example.com/sample-image.png',
            category: 'image'
          })
        )
      )
    },
    deleteFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    onBack: vi.fn()
  })

  it('renders file details and copies URL', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileDetailTestTags.TITLE)).toBeInTheDocument()
    expect(screen.getByText(storageStrings.ui.fileDetailTitle)).toBeInTheDocument()
    expect(screen.getByText('sample-image.png')).toBeInTheDocument()

    const copyBtn = screen.getByTestId(StorageFileDetailTestTags.COPY_URL_BUTTON)
    await user.click(copyBtn)

    expect(deps.getFileDetailUseCase.execute).toHaveBeenCalledWith('file-123')
  })

  it('navigates back when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backBtn = await screen.findByTestId(StorageFileDetailTestTags.BACK_BUTTON)
    await user.click(backBtn)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('deletes file and navigates back when delete button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const deleteBtn = await screen.findByTestId(StorageFileDetailTestTags.DELETE_BUTTON)
    await user.click(deleteBtn)

    expect(deps.deleteFileUseCase?.execute).toHaveBeenCalledWith('file-123')
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('renders error state when file loading fails', async () => {
    const deps = createMockDeps()
    deps.getFileDetailUseCase.execute = vi.fn().mockResolvedValue(appResultFailure(CommonError.networkError()))

    render(
      <ComponentTestHarness>
        <StorageFileDetailScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(storageStrings.ui.fileDetailTitle)).toBeInTheDocument()
  })
})

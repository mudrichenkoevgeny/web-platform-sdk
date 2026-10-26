import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList, storageStrings } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileListScreen, StorageFileListTestTags } from './StorageFileListScreen'
import type { StorageFileListStoreDependencies } from './storage-file-list-store'

describe('StorageFileListScreen', () => {
  const createMockDeps = (): StorageFileListStoreDependencies => ({
    getFilesUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: createTestStorageFileSummaryList(2),
          pageNumber: 1,
          pageSize: 10,
          totalElements: 2,
          totalCount: 2,
          totalPages: 1
        })
      )
    },
    deleteFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    deleteFilesBatchUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    },
    onNavigateToUpload: vi.fn(),
    onNavigateToFileDetail: vi.fn(),
    onBack: vi.fn()
  })

  it('renders title and storage file items list', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileListTestTags.TITLE)).toBeDefined()
    expect(screen.getByText(storageStrings.ui.storageFileListTitle)).toBeDefined()
    expect(screen.getByTestId(StorageFileListTestTags.FILE_LIST)).toBeDefined()
  })

  it('navigates to upload screen when upload button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const uploadBtn = await screen.findByTestId(StorageFileListTestTags.UPLOAD_BUTTON)
    await user.click(uploadBtn)

    expect(deps.onNavigateToUpload).toHaveBeenCalledTimes(1)
  })

  it('navigates back when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backBtn = await screen.findByTestId(StorageFileListTestTags.BACK_BUTTON)
    await user.click(backBtn)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })

  it('selects files and executes batch deletion', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByTestId(StorageFileListTestTags.FILE_LIST)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)

    const checkbox = checkboxes[0]
    if (checkbox) {
      await user.click(checkbox)
    }

    const batchBar = await screen.findByTestId(StorageFileListTestTags.BATCH_ACTION_BAR)
    expect(batchBar).toBeDefined()

    const batchDeleteBtn = screen.getByTestId(StorageFileListTestTags.BATCH_DELETE_BUTTON)
    await user.click(batchDeleteBtn)

    expect(deps.deleteFilesBatchUseCase?.execute).toHaveBeenCalledTimes(1)
  })
})

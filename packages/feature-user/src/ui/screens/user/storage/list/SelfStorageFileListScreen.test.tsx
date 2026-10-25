import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList, storageStrings } from '@mudrichenkoevgeny/shared-foundation'
import { SelfStorageFileListScreen, SelfStorageFileListTestTags } from './SelfStorageFileListScreen'
import type { SelfStorageFileListStoreDependencies } from './self-storage-file-list-store'

describe('SelfStorageFileListScreen', () => {
  const createMockDeps = (): SelfStorageFileListStoreDependencies => ({
    getFilesUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          items: createTestStorageFileSummaryList(2),
          pageNumber: 1,
          pageSize: 10,
          totalElements: 2,
          totalPages: 1
        })
      )
    },
    deleteFileUseCase: {
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
        <SelfStorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(SelfStorageFileListTestTags.TITLE)).toBeInTheDocument()
    expect(screen.getByText(storageStrings.ui.files)).toBeInTheDocument()
    expect(screen.getByTestId(SelfStorageFileListTestTags.FILE_LIST)).toBeInTheDocument()
  })

  it('navigates to upload screen when upload button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfStorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const uploadBtn = await screen.findByTestId(SelfStorageFileListTestTags.UPLOAD_BUTTON)
    await user.click(uploadBtn)

    expect(deps.onNavigateToUpload).toHaveBeenCalledTimes(1)
  })

  it('navigates back when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <SelfStorageFileListScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const backBtn = await screen.findByTestId(SelfStorageFileListTestTags.BACK_BUTTON)
    await user.click(backBtn)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

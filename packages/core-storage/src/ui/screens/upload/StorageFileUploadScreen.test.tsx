import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileUploadScreen, StorageFileUploadTestTags } from './StorageFileUploadScreen'
import { StorageFileUploadAreaTestTags } from '@/ui/components/upload/StorageFileUploadArea'
import type { StorageFileUploadStoreDependencies } from '@/ui/components/upload/storage-file-upload-store'

describe('StorageFileUploadScreen', () => {
  const createMockDeps = (): StorageFileUploadStoreDependencies => ({
    uploadFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestStorageFilePrivate()))
    },
    onUploaded: vi.fn(),
    onBack: vi.fn()
  })

  it('renders upload screen title and dropzone', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileUploadScreen dependencies={deps} config={{}} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileUploadTestTags.TITLE)).toBeDefined()
    expect(screen.getByTestId(StorageFileUploadAreaTestTags.DROPZONE)).toBeDefined()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <StorageFileUploadScreen dependencies={deps} config={{}} />
      </ComponentTestHarness>
    )

    const backBtn = screen.getByTestId(StorageFileUploadTestTags.BACK_BUTTON)
    await user.click(backBtn)

    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

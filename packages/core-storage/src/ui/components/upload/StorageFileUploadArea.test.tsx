import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileUploadArea, StorageFileUploadAreaTestTags } from './StorageFileUploadArea'
import type { StorageFileUploadStoreDependencies } from './storage-file-upload-store'

describe('StorageFileUploadArea', () => {
  const createMockDeps = (): StorageFileUploadStoreDependencies => ({
    uploadFileUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestStorageFilePrivate()))
    },
    onUploaded: vi.fn(),
    onBack: vi.fn()
  })

  it('renders dropzone element', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <StorageFileUploadArea dependencies={deps} config={{}} />
      </ComponentTestHarness>
    )

    expect(await screen.findByTestId(StorageFileUploadAreaTestTags.DROPZONE)).toBeDefined()
  })
})

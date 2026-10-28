import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileUploadStoreDependencies } from '@/ui/components/upload/storage-file-upload-store'

/**
 * Creates mock dependencies for {@link StorageFileUploadStore}.
 *
 * @param overrides - Optional property overrides for store dependencies
 * @returns Fully constructed {@link StorageFileUploadStoreDependencies} mock instance
 */
export const storageFileUploadDependenciesMock = (
  overrides?: Partial<StorageFileUploadStoreDependencies>
): StorageFileUploadStoreDependencies => {
  return {
    uploadFileUseCase: {
      execute: async () => appResultSuccess(createTestStorageFilePrivate({ id: toFileIdOrThrow('file-new-1') }))
    },
    onUploaded: () => {},
    onBack: () => {},
    ...overrides
  }
}

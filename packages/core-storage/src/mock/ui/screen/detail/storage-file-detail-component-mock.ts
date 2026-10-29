import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import type { StorageFileDetailStoreDependencies } from '@/ui/screens/file/detail/storage-file-detail-store'

/**
 * Creates mock dependencies for {@link StorageFileDetailStore}.
 *
 * @param overrides - Optional property overrides for store dependencies
 * @returns Fully constructed {@link StorageFileDetailStoreDependencies} mock instance
 */
export const storageFileDetailDependenciesMock = (
  overrides?: Partial<StorageFileDetailStoreDependencies>
): StorageFileDetailStoreDependencies => {
  return {
    fileId: 'file-123',
    getFileDetailUseCase: {
      execute: async (fileId: string) =>
        appResultSuccess(createTestStorageFilePrivate({ id: toFileIdOrThrow(fileId) }))
    },
    deleteFileUseCase: {
      execute: async () => appResultSuccess(undefined)
    },
    onBack: () => {},
    ...overrides
  }
}

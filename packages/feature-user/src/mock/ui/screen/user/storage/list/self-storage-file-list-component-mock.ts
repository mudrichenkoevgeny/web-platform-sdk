import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { SelfStorageFileListStoreDependencies } from '@/ui/screens/user/storage/list/self-storage-file-list-store'

/**
 * Creates mock dependencies for {@link SelfStorageFileListStore}.
 *
 * @param overrides - Optional property overrides for store dependencies
 * @returns Fully constructed {@link SelfStorageFileListStoreDependencies} mock instance
 */
export const selfStorageFileListDependenciesMock = (
  overrides?: Partial<SelfStorageFileListStoreDependencies>
): SelfStorageFileListStoreDependencies => {
  return {
    getFilesUseCase: {
      execute: async () =>
        appResultSuccess({
          items: createTestStorageFileSummaryList(2),
          pageNumber: 1,
          pageSize: 10,
          totalElements: 2,
          totalPages: 1
        })
    },
    deleteFileUseCase: {
      execute: async () => appResultSuccess(undefined)
    },
    onNavigateToUpload: () => {},
    onNavigateToFileDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}

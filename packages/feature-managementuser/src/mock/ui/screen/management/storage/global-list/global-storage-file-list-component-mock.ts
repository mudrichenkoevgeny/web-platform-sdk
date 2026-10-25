import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import type { GlobalStorageFileListStoreDependencies } from '@/ui/screens/management/storage/global-list/global-storage-file-list-store'

/**
 * Creates mock dependencies for {@link GlobalStorageFileListStore}.
 *
 * @param overrides - Optional property overrides for store dependencies
 * @returns Fully constructed {@link GlobalStorageFileListStoreDependencies} mock instance
 */
export const globalStorageFileListDependenciesMock = (
  overrides?: Partial<GlobalStorageFileListStoreDependencies>
): GlobalStorageFileListStoreDependencies => {
  return {
    managementGetFilesUseCase: {
      execute: async () => appResultSuccess({
        items: createTestStorageFileSummaryList(2),
        pageNumber: 1,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1
      })
    },
    managementDeleteFileUseCase: {
      execute: async () => appResultSuccess(undefined)
    },
    onNavigateToUpload: () => {},
    onNavigateToFileDetail: () => {},
    onBack: () => {},
    ...overrides
  }
}

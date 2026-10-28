import { createFileRoute } from '@tanstack/react-router'
import {
  StorageFileListScreen,
  storageFileListSearchSchema,
  DEFAULT_STORAGE_FILE_LIST_STATUSES
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ManagementSelfStorageNavigation, ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for staff member self-service storage file list screen. */
export const Route = createFileRoute('/self/storage/files/')({
  validateSearch: (rawSearch) => {
    const parsed = parseSearchParams(storageFileListSearchSchema, rawSearch)
    if (!parsed.status && (!parsed.statuses || parsed.statuses.length === 0)) {
      return { ...parsed, statuses: DEFAULT_STORAGE_FILE_LIST_STATUSES }
    }
    return parsed
  },
  component: function SelfStorageFileListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    const getFilesUseCase =
      managementDeps.selfManagementGetFilesUseCase ?? managementDeps.managementGetFilesUseCase

    const deleteFileUseCase =
      managementDeps.selfManagementDeleteFileUseCase ?? managementDeps.managementDeleteFileUseCase

    const deleteFilesBatchUseCase =
      managementDeps.selfManagementDeleteFilesBatchUseCase ?? managementDeps.managementDeleteFilesBatchUseCase

    return (
      <StorageFileListScreen
        searchParams={searchParams}
        testTagPrefix="SelfStorage"
        dependencies={{
          userId: managementDeps.currentUserId ?? undefined,
          getFilesUseCase,
          deleteFileUseCase,
          deleteFilesBatchUseCase,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: () =>
            void navigate({ to: ManagementSelfStorageNavigation.FileUpload.ROUTE }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: '/self/storage/files/$fileId', params: { fileId } }),
          onBack: () => navigateUp({ to: ManagementSelfUserNavigation.Main.route })
        }}
      />
    )
  }
})

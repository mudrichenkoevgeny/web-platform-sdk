import { createFileRoute } from '@tanstack/react-router'
import { StorageFileListScreen, storageFileListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementMainNavigation, ManagementStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global storage file list screen. */
export const Route = createFileRoute('/storage/files')({
  validateSearch: (rawSearch) => parseSearchParams(storageFileListSearchSchema, rawSearch),
  component: function StorageFileListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <StorageFileListScreen
        includeOwnerFilter
        searchParams={searchParams}
        testTagPrefix="GlobalStorage"
        dependencies={{
          getFilesUseCase: managementDeps.managementGetFilesUseCase,
          deleteFileUseCase: managementDeps.managementDeleteFileUseCase,
          deleteFilesBatchUseCase: managementDeps.managementDeleteFilesBatchUseCase,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: () => void navigate({ to: ManagementStorageNavigation.FileUpload.route }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: ManagementStorageNavigation.FileList.ROUTE, search: { fileId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})

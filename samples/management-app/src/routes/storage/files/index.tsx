import { createFileRoute } from '@tanstack/react-router'
import { StorageFileListScreen, storageFileListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ManagementMainNavigation, ManagementSelfStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for storage file list screen. */
export const Route = createFileRoute('/storage/files/')({
  validateSearch: (rawSearch) => parseSearchParams(storageFileListSearchSchema, rawSearch),
  component: function StorageFileListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    const isSelfView = Boolean(
      searchParams.ownerUserId &&
        managementDeps?.currentUserId &&
        searchParams.ownerUserId === managementDeps.currentUserId
    )

    const getFilesUseCase = isSelfView
      ? (managementDeps.selfManagementGetFilesUseCase ?? managementDeps.managementGetFilesUseCase)
      : managementDeps.managementGetFilesUseCase

    const deleteFileUseCase = isSelfView
      ? (managementDeps.selfManagementDeleteFileUseCase ?? managementDeps.managementDeleteFileUseCase)
      : managementDeps.managementDeleteFileUseCase

    const deleteFilesBatchUseCase = isSelfView
      ? (managementDeps.selfManagementDeleteFilesBatchUseCase ?? managementDeps.managementDeleteFilesBatchUseCase)
      : managementDeps.managementDeleteFilesBatchUseCase

    return (
      <StorageFileListScreen
        includeOwnerFilter
        searchParams={searchParams}
        testTagPrefix={isSelfView ? "SelfStorage" : "GlobalStorage"}
        dependencies={{
          userId: searchParams.ownerUserId,
          getFilesUseCase,
          deleteFileUseCase,
          deleteFilesBatchUseCase,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: isSelfView
            ? () => void navigate({ to: ManagementSelfStorageNavigation.FileUpload.ROUTE })
            : undefined,
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: '/storage/files/$fileId', params: { fileId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})

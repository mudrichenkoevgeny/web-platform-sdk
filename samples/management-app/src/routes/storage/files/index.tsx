import { createFileRoute } from '@tanstack/react-router'
import {
  StorageFileListScreen,
  storageFileListSearchSchema,
  createSelfStorageFileListDataSource,
  createManagementStorageFileListDataSource
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
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

    const dataSource = isSelfView
      ? createSelfStorageFileListDataSource({
          getFilesUseCase: managementDeps.selfManagementGetFilesUseCase ?? managementDeps.managementGetFilesUseCase,
          deleteFileUseCase: managementDeps.selfManagementDeleteFileUseCase ?? managementDeps.managementDeleteFileUseCase,
          deleteFilesBatchUseCase: managementDeps.selfManagementDeleteFilesBatchUseCase ?? managementDeps.managementDeleteFilesBatchUseCase
        })
      : createManagementStorageFileListDataSource({
          managementGetFilesUseCase: managementDeps.managementGetFilesUseCase,
          managementDeleteFileUseCase: managementDeps.managementDeleteFileUseCase,
          managementDeleteFilesBatchUseCase: managementDeps.managementDeleteFilesBatchUseCase
        })

    const isOwnerFiltered = Boolean(searchParams.ownerUserId)

    return (
      <StorageFileListScreen
        includeOwnerFilter={!isOwnerFiltered}
        searchParams={searchParams}
        testTagPrefix={isSelfView ? "SelfStorage" : "GlobalStorage"}
        dependencies={{
          userId: searchParams.ownerUserId,
          dataSource,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: newParams as Record<string, unknown>, replace: true }),
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

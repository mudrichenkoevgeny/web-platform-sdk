import { createFileRoute } from '@tanstack/react-router'
import { StorageFileListScreen, storageFileListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, OpenStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self storage file list screen. */
export const Route = createFileRoute('/storage/files')({
  validateSearch: (rawSearch) => parseSearchParams(storageFileListSearchSchema, rawSearch),
  component: function StorageFileListRoute() {
    const { appComponent } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <StorageFileListScreen
        searchParams={searchParams}
        dependencies={{
          getFilesUseCase: appComponent.clientUserComponent.getFilesUseCase,
          deleteFileUseCase: appComponent.clientUserComponent.deleteFileUseCase,
          deleteFilesBatchUseCase: appComponent.clientUserComponent.deleteFilesBatchUseCase,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: () =>
            void navigate({ to: OpenStorageNavigation.FileUpload.route }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: OpenStorageNavigation.FileList.ROUTE, search: (prev) => ({ ...prev, fileId }) }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})

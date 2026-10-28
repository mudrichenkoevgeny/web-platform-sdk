import { createFileRoute } from '@tanstack/react-router'
import {
  StorageFileListScreen,
  storageFileListSearchSchema,
  DEFAULT_STORAGE_FILE_LIST_STATUSES
} from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ClientUserNavigation, OpenStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for self storage file list screen. */
export const Route = createFileRoute('/storage/files/')({
  validateSearch: (rawSearch) => {
    const parsed = parseSearchParams(storageFileListSearchSchema, rawSearch)
    if (!parsed.status && (!parsed.statuses || parsed.statuses.length === 0)) {
      return { ...parsed, statuses: DEFAULT_STORAGE_FILE_LIST_STATUSES }
    }
    return parsed
  },
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
            void navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: () =>
            void navigate({ to: OpenStorageNavigation.FileUpload.ROUTE }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: '/storage/files/$fileId', params: { fileId } }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})

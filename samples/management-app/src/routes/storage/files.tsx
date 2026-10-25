import { createFileRoute } from '@tanstack/react-router'
import { GlobalStorageFileListScreen, globalStorageFileListSearchSchema } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementMainNavigation, ManagementStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { parseSearchParams } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for global storage file list screen. */
export const Route = createFileRoute('/storage/files')({
  validateSearch: (rawSearch) => parseSearchParams(globalStorageFileListSearchSchema, rawSearch),
  component: function GlobalStorageFileListRoute() {
    const { managementDeps } = Route.useRouteContext()
    const searchParams = Route.useSearch()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    return (
      <GlobalStorageFileListScreen
        dependencies={{
          managementGetFilesUseCase: managementDeps.managementGetFilesUseCase,
          managementDeleteFileUseCase: managementDeps.managementDeleteFileUseCase,
          searchParams,
          onSearchParamsChanged: (newParams) =>
            void navigate({ search: (prev) => ({ ...prev, ...newParams }), replace: true }),
          onNavigateToUpload: () => void navigate({ to: ManagementStorageNavigation.FileUpload.route }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: ManagementStorageNavigation.FileDetail.ROUTE, params: { fileId } }),
          onBack: () => navigateUp({ to: ManagementMainNavigation.Main.route })
        }}
      />
    )
  }
})

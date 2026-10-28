import { createFileRoute } from '@tanstack/react-router'
import { StorageFileDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ManagementSelfStorageNavigation, ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for storage file detail screen in management app. */
export const Route = createFileRoute('/storage/files/$fileId')({
  component: function StorageFileDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { fileId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    const getDetailUseCase =
      managementDeps.managementGetFileDetailUseCase ?? managementDeps.selfManagementGetFileDetailUseCase
    const deleteUseCase =
      managementDeps.managementDeleteFileUseCase ?? managementDeps.selfManagementDeleteFileUseCase

    if (!getDetailUseCase) {
      return null
    }

    return (
      <StorageFileDetailScreen
        dependencies={{
          fileId,
          currentUserId: managementDeps.currentUserId ?? undefined,
          getFileDetailUseCase: getDetailUseCase,
          deleteFileUseCase: deleteUseCase,
          onNavigateToUserMain: () => void navigate({ to: ManagementSelfUserNavigation.Main.route }),
          onNavigateToUserDetail: (userId) => {
            if (managementDeps.currentUserId != null && userId === managementDeps.currentUserId) {
              void navigate({ to: ManagementSelfUserNavigation.Main.route })
            } else {
              void navigate({ to: '/users/$userId', params: { userId } })
            }
          },
          onBack: () => navigateUp({ to: ManagementSelfStorageNavigation.FileList.ROUTE })
        }}
      />
    )
  }
})

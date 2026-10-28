import { createFileRoute } from '@tanstack/react-router'
import { StorageFileDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ManagementSelfStorageNavigation, ManagementSelfUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for staff member self-service storage file detail screen. */
export const Route = createFileRoute('/self/storage/files/$fileId')({
  component: function SelfStorageFileDetailRoute() {
    const { managementDeps } = Route.useRouteContext()
    const { fileId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    const getDetailUseCase =
      managementDeps.selfManagementGetFileDetailUseCase ?? managementDeps.managementGetFileDetailUseCase
    const deleteUseCase =
      managementDeps.selfManagementDeleteFileUseCase ?? managementDeps.managementDeleteFileUseCase

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

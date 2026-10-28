import { createFileRoute } from '@tanstack/react-router'
import { StorageFileDetailScreen } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for storage file detail screen in client app. */
export const Route = createFileRoute('/storage/files/$fileId')({
  beforeLoad: async ({ context }) => {
    const user = await context.appComponent.clientUserComponent.userStorage.getCurrentUser()
    return { currentUserId: user?.id ?? undefined }
  },
  component: function StorageFileDetailRoute() {
    const { appComponent, currentUserId } = Route.useRouteContext()
    const { fileId } = Route.useParams()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <StorageFileDetailScreen
        dependencies={{
          fileId,
          currentUserId,
          getFileDetailUseCase: appComponent.clientUserComponent.getFileDetailUseCase,
          deleteFileUseCase: appComponent.clientUserComponent.deleteFileUseCase,
          onNavigateToUserMain: () => void navigate({ to: ClientUserNavigation.Main.route }),
          onNavigateToUserDetail: () => void navigate({ to: ClientUserNavigation.Main.route }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})

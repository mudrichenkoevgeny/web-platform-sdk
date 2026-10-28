import { createFileRoute } from '@tanstack/react-router'
import { StorageFileUploadScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for storage file upload screen. */
export const Route = createFileRoute('/storage/upload')({
  component: function StorageFileUploadRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    if (!appComponent) {
      return null
    }

    return (
      <StorageFileUploadScreen
        dependencies={{
          uploadFileUseCase: appComponent.clientUserComponent.uploadFileUseCase,
          onUploaded: () => navigateUp({ to: ClientUserNavigation.Main.route }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
        config={{}}
      />
    )
  }
})

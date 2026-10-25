import { createFileRoute } from '@tanstack/react-router'
import { SelfStorageFileListScreen } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserNavigation, OpenStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

export const Route = createFileRoute('/storage/files')({
  component: function SelfStorageFileListRoute() {
    const { appComponent } = Route.useRouteContext()
    const navigate = Route.useNavigate()
    const navigateUp = useNavigateUp()

    if (!appComponent) return null

    return (
      <SelfStorageFileListScreen
        dependencies={{
          getFilesUseCase: appComponent.clientUserComponent.getFilesUseCase,
          deleteFileUseCase: appComponent.clientUserComponent.deleteFileUseCase,
          onNavigateToUpload: () => void navigate({ to: OpenStorageNavigation.FileUpload.route, }),
          onNavigateToFileDetail: (fileId) =>
            void navigate({ to: OpenStorageNavigation.FileDetail.ROUTE, params: { fileId }, }),
          onBack: () => navigateUp({ to: ClientUserNavigation.Main.route })
        }}
      />
    )
  }
})

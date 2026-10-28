import { createFileRoute } from '@tanstack/react-router'
import { StorageFileUploadScreen } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { ManagementSelfStorageNavigation } from '@mudrichenkoevgeny/shared-foundation'
import { useNavigateUp } from '@/ui/navigation/use-navigate-up'

/** Route configuration for staff member self-service storage file upload screen. */
export const Route = createFileRoute('/self/storage/upload')({
  component: function SelfStorageFileUploadRoute() {
    const { appComponent, managementDeps } = Route.useRouteContext()
    const navigateUp = useNavigateUp()

    const uploadUseCase =
      managementDeps?.selfManagementUploadFileUseCase ??
      appComponent?.managementUserComponent?.selfManagementUploadFileUseCase

    if (!uploadUseCase) {
      return null
    }

    return (
      <StorageFileUploadScreen
        dependencies={{
          uploadFileUseCase: uploadUseCase,
          onUploaded: () => navigateUp({ to: ManagementSelfStorageNavigation.FileList.ROUTE }),
          onBack: () => navigateUp({ to: ManagementSelfStorageNavigation.FileList.ROUTE })
        }}
        config={{}}
      />
    )
  }
})

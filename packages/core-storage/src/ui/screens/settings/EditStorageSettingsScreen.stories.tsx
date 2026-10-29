import type { Meta, StoryObj } from '@storybook/react'
import { EditStorageSettingsScreen } from './EditStorageSettingsScreen'

const meta: Meta<typeof EditStorageSettingsScreen> = {
  title: 'Screens/Settings/EditStorageSettingsScreen',
  component: EditStorageSettingsScreen,
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof EditStorageSettingsScreen>

export const Default: Story = {
  args: {
    dependencies: {
      getSettingsUseCase: {
        execute: async () => ({
          success: true,
          data: {
            minUploadSizeBytes: 1024,
            maxUploadSizeBytes: 104857600,
            totalStorageQuotaForOpenUserBytes: 1073741824,
            totalStorageQuotaForManagementUserBytes: 10737418240,
            presignedUrlExpirationSeconds: 3600,
            maxPendingUploadsForOpenUser: 10,
            maxPendingUploadsForManagementUser: 100,
            isDeduplicationEnabled: true,
            deletedFilesCleanupIntervalSeconds: 86400
          }
        })
      } as any,
      updateSettingsUseCase: { execute: async () => ({ success: true, data: {} as any }) } as any,
      resetSettingsUseCase: { execute: async () => ({ success: true, data: {} as any }) } as any,
      onBack: () => {}
    }
  }
}

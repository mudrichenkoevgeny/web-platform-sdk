import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileListScreen } from './StorageFileListScreen'

const meta: Meta<typeof StorageFileListScreen> = {
  title: 'Feature/User/StorageFileListScreen',
  component: StorageFileListScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: {
      getFilesUseCase: {
        execute: async () =>
          appResultSuccess({
            items: createTestStorageFileSummaryList(3),
            pageNumber: 1,
            pageSize: 10,
            totalElements: 3,
            totalCount: 3,
            totalPages: 1
          })
      },
      deleteFileUseCase: {
        execute: async () => appResultSuccess(undefined)
      },
      deleteFilesBatchUseCase: {
        execute: async () => appResultSuccess(undefined)
      },
      onNavigateToUpload: () => {},
      onNavigateToFileDetail: () => {},
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof StorageFileListScreen>

/** Default single-user state for the storage file list screen. */
export const Default: Story = {}

/** Management mode state displaying files across all users. */
export const ManagementMode: Story = {
  args: {
    includeOwnerFilter: true,
    testTagPrefix: 'GlobalStorage'
  }
}

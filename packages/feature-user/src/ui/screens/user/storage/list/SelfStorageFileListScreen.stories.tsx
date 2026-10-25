import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFileSummaryList } from '@mudrichenkoevgeny/shared-foundation'
import { SelfStorageFileListScreen } from './SelfStorageFileListScreen'

const meta: Meta<typeof SelfStorageFileListScreen> = {
  title: 'Feature/User/SelfStorageFileListScreen',
  component: SelfStorageFileListScreen,
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
            totalPages: 1
          })
      },
      deleteFileUseCase: {
        execute: async () => appResultSuccess(undefined)
      },
      onNavigateToUpload: () => {},
      onNavigateToFileDetail: () => {},
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof SelfStorageFileListScreen>

export const Default: Story = {}

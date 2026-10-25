import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileDetailScreen } from './StorageFileDetailScreen'

const meta: Meta<typeof StorageFileDetailScreen> = {
  title: 'Feature/User/StorageFileDetailScreen',
  component: StorageFileDetailScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: {
      fileId: 'file-123',
      getFileDetailUseCase: {
        execute: async () =>
          appResultSuccess(
            createTestStorageFilePrivate({
              id: toFileIdOrThrow('file-123'),
              fileName: 'sample-document.pdf',
              category: 'document'
            })
          )
      },
      deleteFileUseCase: {
        execute: async () => appResultSuccess(undefined)
      },
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof StorageFileDetailScreen>

export const Default: Story = {}

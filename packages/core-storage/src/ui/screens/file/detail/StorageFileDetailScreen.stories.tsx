import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileDetailScreen } from './StorageFileDetailScreen'

const meta: Meta<typeof StorageFileDetailScreen> = {
  title: 'Core/Storage/StorageFileDetailScreen',
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
      fileId: 'file-1',
      getFileDetailUseCase: {
        execute: async () => appResultSuccess(createTestStorageFilePrivate())
      },
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof StorageFileDetailScreen>

export const Default: Story = {}

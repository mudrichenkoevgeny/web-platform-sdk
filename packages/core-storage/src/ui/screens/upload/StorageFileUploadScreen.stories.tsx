import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileUploadScreen } from './StorageFileUploadScreen'

const meta: Meta<typeof StorageFileUploadScreen> = {
  title: 'Core/Storage/StorageFileUploadScreen',
  component: StorageFileUploadScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: {
      uploadFileUseCase: {
        execute: async () => appResultSuccess(createTestStorageFilePrivate())
      },
      onUploaded: () => {},
      onBack: () => {}
    },
    config: {}
  }
}

export default meta
type Story = StoryObj<typeof StorageFileUploadScreen>

export const Default: Story = {}

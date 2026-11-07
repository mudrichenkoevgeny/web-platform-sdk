import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestStorageFilePrivate } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileUploadArea } from './StorageFileUploadArea'

const meta: Meta<typeof StorageFileUploadArea> = {
  title: 'Core/Storage/StorageFileUploadArea',
  component: StorageFileUploadArea,
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
type Story = StoryObj<typeof StorageFileUploadArea>

export const Default: Story = {}

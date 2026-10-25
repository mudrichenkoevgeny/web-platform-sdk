import type { Meta, StoryObj } from '@storybook/react'
import { createTestStorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileItem } from './StorageFileItem'

const meta: Meta<typeof StorageFileItem> = {
  title: 'Feature/User/Storage/StorageFileItem',
  component: StorageFileItem
}

export default meta
type Story = StoryObj<typeof StorageFileItem>

export const Default: Story = {
  args: {
    file: createTestStorageFileSummary({
      fileId: 'file-1',
      fileName: 'avatar.jpg',
      category: 'IMAGE',
      fileSizeBytes: 2048576
    })
  }
}

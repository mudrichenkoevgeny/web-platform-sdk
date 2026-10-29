import type { Meta, StoryObj } from '@storybook/react'
import { createTestStorageFileSummary, StorageCategory, toFileIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileItem } from './StorageFileItem'

const meta: Meta<typeof StorageFileItem> = {
  title: 'Core/Storage/StorageFileItem',
  component: StorageFileItem
}

export default meta
type Story = StoryObj<typeof StorageFileItem>

/** Default preview of storage file summary item card. */
export const Default: Story = {
  args: {
    file: createTestStorageFileSummary({
      id: toFileIdOrThrow('file-1'),
      fileName: 'avatar.jpg',
      category: StorageCategory.IMAGE,
      fileSizeBytes: 2048576
    })
  }
}

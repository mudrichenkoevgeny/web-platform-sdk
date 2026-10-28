import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestPagedResult, createTestStorageFileSummary } from '@mudrichenkoevgeny/shared-foundation'
import { StorageFileListScreen } from './StorageFileListScreen'

const meta: Meta<typeof StorageFileListScreen> = {
  title: 'Core/Storage/StorageFileListScreen',
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
          appResultSuccess(createTestPagedResult({ items: [createTestStorageFileSummary()] }))
      },
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof StorageFileListScreen>

export const Default: Story = {}

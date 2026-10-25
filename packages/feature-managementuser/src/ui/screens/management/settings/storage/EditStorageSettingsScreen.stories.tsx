import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestManagementStorageSettings } from '@mudrichenkoevgeny/shared-foundation'
import { EditStorageSettingsScreen } from './EditStorageSettingsScreen'

const meta: Meta<typeof EditStorageSettingsScreen> = {
  title: 'Feature/Management/EditStorageSettingsScreen',
  component: EditStorageSettingsScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: {
      getManagementStorageSettingsUseCase: {
        execute: async () => appResultSuccess(createTestManagementStorageSettings())
      },
      updateManagementStorageSettingsUseCase: {
        execute: async () => appResultSuccess(createTestManagementStorageSettings())
      },
      resetManagementStorageSettingsUseCase: {
        execute: async () => appResultSuccess(createTestManagementStorageSettings())
      },
      onBack: () => {}
    }
  }
}

export default meta
type Story = StoryObj<typeof EditStorageSettingsScreen>

export const Default: Story = {}

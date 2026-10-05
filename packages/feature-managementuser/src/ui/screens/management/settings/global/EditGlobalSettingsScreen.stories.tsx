import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditGlobalSettingsScreen } from '@/ui/screens/management/settings/global/EditGlobalSettingsScreen'
import type { EditGlobalSettingsStoreDependencies } from '@/ui/screens/management/settings/global/EditGlobalSettingsStore'

const createMockDeps = (): EditGlobalSettingsStoreDependencies => ({
  getManagementGlobalSettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        privacyPolicyUrl: 'https://example.com/privacy',
        termsOfServiceUrl: 'https://example.com/terms',
        contactSupportEmail: 'support@example.com',
        minSupportedAppVersions: {
          ANDROID: '1.0.0'
        },
        isTracingEnabled: true,
        isMetricsEnabled: true,
        isVerboseLoggingEnabled: false
      })
  } as any,
  saveRemoteGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  resetRemoteGlobalSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onBack: () => {}
})

const meta: Meta<typeof EditGlobalSettingsScreen> = {
  title: 'Feature/ManagementUser/Settings/Global/EditGlobalSettingsScreen',
  component: EditGlobalSettingsScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <Story />
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof EditGlobalSettingsScreen>

export const Default: Story = {}

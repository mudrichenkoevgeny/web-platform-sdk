import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { EditAuthSettingsScreen } from '@/ui/screens/management/settings/auth/EditAuthSettingsScreen'
import type { EditAuthSettingsStoreDependencies } from '@/ui/screens/management/settings/auth/EditAuthSettingsStore'

const createMockDeps = (): EditAuthSettingsStoreDependencies => ({
  getManagementAuthSettingsUseCase: {
    execute: async () =>
      appResultSuccess({
        availableAuthProviders: {
          primary: ['EMAIL'],
          secondary: ['GOOGLE']
        },
        maxTotalIdentifiers: 10,
        maxEmailIdentifiers: 5,
        maxPhoneIdentifiers: 5,
        maxIdentifiersPerExternalProvider: 2,
        maxActiveSessionsForOpenUser: 3,
        maxActiveSessionsForManagementUser: 5,
        accessTokenExpirationSeconds: 3600,
        refreshTokenExpirationSeconds: 86400,
        accountDeletionGracePeriodSeconds: 604800,
        accountDeletionCheckIntervalSeconds: 86400,
        isRegistrationEnabled: true,
        openEmailRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        },
        managementEmailRestrictionPolicy: {
          isBlacklistEnabled: false,
          blacklist: [],
          isWhitelistEnabled: false,
          whitelist: []
        }
      })
  } as any,
  saveRemoteAuthSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  resetRemoteAuthSettingsUseCase: {
    execute: async () => appResultSuccess({})
  } as any,
  onBack: () => {}
})

const meta: Meta<typeof EditAuthSettingsScreen> = {
  title: 'Feature/ManagementUser/Settings/Auth/EditAuthSettingsScreen',
  component: EditAuthSettingsScreen,
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
type Story = StoryObj<typeof EditAuthSettingsScreen>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ManagementRootScreen } from '@/ui/screens/management/root/ManagementRootScreen'
import type { ManagementRootStoreDependencies } from '@/ui/screens/management/root/ManagementRootStore'

const createMockDeps = (): ManagementRootStoreDependencies => ({
  getManagementAuthSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  saveRemoteAuthSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  resetRemoteAuthSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  getManagementGlobalSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  saveRemoteGlobalSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  resetRemoteGlobalSettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  getManagementSecuritySettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  saveRemoteSecuritySettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  resetRemoteSecuritySettingsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  getUsersUseCase: { execute: async () => ({ isSuccess: true, data: { items: [] } } as any) } as any,
  getUserUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  createUserUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  updateUserUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  deleteUserUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  managementGetSessionsUseCase: { execute: async () => ({ isSuccess: true, data: { items: [] } } as any) } as any,
  managementGetIdentifiersUseCase: { execute: async () => ({ isSuccess: true, data: { items: [] } } as any) } as any,
  managementDisableTotpUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  managementDeleteSessionUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  managementDeleteAllUserSessionsUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  managementDeleteIdentifierUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  managementDeleteIdentifierPasswordUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any,
  getAuditEventsUseCase: { execute: async () => ({ isSuccess: true, data: { items: [] } } as any) } as any,
  getAuditEventUseCase: { execute: async () => ({ isSuccess: true, data: {} } as any) } as any
})

const meta: Meta<typeof ManagementRootScreen> = {
  title: 'Feature/ManagementUser/ManagementRootScreen',
  component: ManagementRootScreen,
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
type Story = StoryObj<typeof ManagementRootScreen>

export const Default: Story = {}

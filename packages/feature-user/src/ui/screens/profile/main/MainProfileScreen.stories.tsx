import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { MainProfileScreen } from '@/ui/screens/profile/main/MainProfileScreen'
import type { MainProfileStoreDependencies } from '@/ui/screens/profile/main/main-profile-store'

const createMockDeps = (user = {
  id: 'usr_12345',
  accountStatus: UserAccountStatus.ACTIVE,
  authorityLevel: 1,
  permissionCodes: []
}): MainProfileStoreDependencies => ({
  appType: AppType.CLIENT,
  userRepository: {
    getCurrentUser: () => user as any,
    refreshCurrentUser: async () => appResultSuccess(user),
    clearSession: async () => undefined
  } as any,
  logoutUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  scheduleUserDeletionUseCase: {
    execute: async () => appResultSuccess(undefined)
  } as any,
  onNavigateToLogin: () => {},
  onNavigateToTotp: () => {},
  onNavigateToSessions: () => {},
  onNavigateToIdentifiers: () => {}
})

const meta: Meta<typeof MainProfileScreen> = {
  title: 'Feature/User/Profile/Main/MainProfileScreen',
  component: MainProfileScreen,
  decorators: [
    (Story) => (
      <ComponentTestHarness>
        <div className="w-full max-w-md h-[36rem] border rounded-xl overflow-hidden bg-background">
          <Story />
        </div>
      </ComponentTestHarness>
    )
  ],
  args: {
    dependencies: createMockDeps()
  }
}

export default meta
type Story = StoryObj<typeof MainProfileScreen>

export const Default: Story = {}

export const ManagementApp: Story = {
  args: {
    dependencies: createMockDeps({
      id: 'usr_admin999',
      accountStatus: UserAccountStatus.ACTIVE,
      authorityLevel: 10,
      permissionCodes: ['USER_WRITE', 'USER_DELETE']
    } as any)
  }
}

export const Unauthorized: Story = {
  args: {
    dependencies: createMockDeps(null as any)
  }
}

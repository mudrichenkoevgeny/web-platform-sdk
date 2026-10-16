import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, toUserIdOrThrow } from '@mudrichenkoevgeny/shared-foundation'
import { userPrivateMock } from '@/mock/index'
import { MainUserScreen } from '@/ui/screens/user/main/MainUserScreen'
import type { MainUserStoreDependencies } from '@/ui/screens/user/main/main-user-store'

const mockUser = userPrivateMock({
  id: toUserIdOrThrow('usr_12345')
})

const createDummyDependencies = (
  overrides?: Partial<MainUserStoreDependencies>
): MainUserStoreDependencies => ({
  appType: AppType.CLIENT,
  userRepository: {
    getCurrentUser: () => mockUser,
    observeCurrentUser: (cb: (user: any) => void) => {
      cb(mockUser)
      return () => {}
    },
    refreshCurrentUser: async () => appResultSuccess(mockUser),
    clearSession: async () => {}
  } as any,
  logoutUseCase: { execute: async () => appResultSuccess(undefined) } as any,
  scheduleUserDeletionUseCase: { execute: async () => appResultSuccess(undefined) } as any,
  onNavigateToLogin: () => alert('Navigate to login'),
  onNavigateToTotp: () => alert('Navigate to TOTP'),
  onNavigateToSessions: () => alert('Navigate to sessions'),
  onNavigateToIdentifiers: () => alert('Navigate to identifiers'),
  ...overrides
})

const meta: Meta<typeof MainUserScreen> = {
  title: 'Feature/User/Main/MainUserScreen',
  component: MainUserScreen,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    dependencies: createDummyDependencies()
  }
}

export default meta
type Story = StoryObj<typeof MainUserScreen>

export const Default: Story = {}

export const ManagementContext: Story = {
  args: {
    dependencies: createDummyDependencies({ appType: AppType.MANAGEMENT })
  }
}

export const Unauthorized: Story = {
  args: {
    dependencies: createDummyDependencies({
      userRepository: {
        getCurrentUser: () => null,
        observeCurrentUser: (cb: (user: any) => void) => {
          cb(null)
          return () => {}
        },
        refreshCurrentUser: async () => appResultSuccess(null),
        clearSession: async () => {}
      } as any
    })
  }
}

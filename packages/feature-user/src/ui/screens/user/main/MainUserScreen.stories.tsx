import type { Meta, StoryObj } from '@storybook/react'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, createTestUserPrivate } from '@mudrichenkoevgeny/shared-foundation'
import { MainUserScreen } from '@/ui/screens/user/main/MainUserScreen'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { LogoutUseCaseMock } from '@/mock/usecase/session/logout-use-case-mock'
import { ScheduleUserDeletionUseCaseMock } from '@/mock/usecase/user/schedule-user-deletion-use-case-mock'
import type { MainUserStoreDependencies } from '@/ui/screens/user/main/main-user-store'

const mockUser = createTestUserPrivate()

const createMockDependencies = (
  overrides?: Partial<MainUserStoreDependencies>
): MainUserStoreDependencies => {
  const userRepository = new UserRepositoryMock()
  userRepository.emit(mockUser)

  const logoutUseCase = new LogoutUseCaseMock()
  logoutUseCase.resultProvider = async () => appResultSuccess(undefined)

  const scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCaseMock()
  scheduleUserDeletionUseCase.resultProvider = async () => appResultSuccess(mockUser)

  return {
    appType: AppType.CLIENT,
    userRepository,
    logoutUseCase,
    scheduleUserDeletionUseCase,
    onNavigateToLogin: () => alert('Navigate to login'),
    onNavigateToTotp: () => alert('Navigate to TOTP'),
    onNavigateToSessions: () => alert('Navigate to sessions'),
    onNavigateToIdentifiers: () => alert('Navigate to identifiers'),
    ...overrides
  }
}

const meta: Meta<typeof MainUserScreen> = {
  title: 'Feature/User/Main/MainUserScreen',
  component: MainUserScreen,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    dependencies: createMockDependencies()
  }
}

export default meta
type Story = StoryObj<typeof MainUserScreen>

export const Default: Story = {}

export const ManagementContext: Story = {
  args: {
    dependencies: createMockDependencies({ appType: AppType.MANAGEMENT })
  }
}

export const Unauthorized: Story = {
  args: {
    dependencies: (() => {
      const userRepository = new UserRepositoryMock()
      userRepository.emit(null)
      const logoutUseCase = new LogoutUseCaseMock()
      const scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCaseMock()
      return {
        appType: AppType.CLIENT,
        userRepository,
        logoutUseCase,
        scheduleUserDeletionUseCase,
        onNavigateToLogin: () => {},
        onNavigateToTotp: () => {},
        onNavigateToSessions: () => {},
        onNavigateToIdentifiers: () => {}
      }
    })()
  }
}

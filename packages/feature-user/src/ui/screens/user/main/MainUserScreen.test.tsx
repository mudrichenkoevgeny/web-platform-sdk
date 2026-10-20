import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, createTestUserPrivatePayload, TEST_USER_ID, toUserIdOrThrow, toUserPrivate, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { MainUserScreen, MainUserTestTags } from '@/ui/screens/user/main/MainUserScreen'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'
import { LogoutUseCaseMock } from '@/mock/usecase/session/logout-use-case-mock'
import { ScheduleUserDeletionUseCaseMock } from '@/mock/usecase/user/schedule-user-deletion-use-case-mock'
import type { MainUserStoreDependencies } from '@/ui/screens/user/main/main-user-store'

describe('MainUserScreen', () => {
  const mockUser = toUserPrivate(createTestUserPrivatePayload({
    id: toUserIdOrThrow(TEST_USER_ID)
  }))

  const createMockDependencies = (
    overrides?: Partial<MainUserStoreDependencies>
  ): MainUserStoreDependencies => {
    const userRepository = new UserRepositoryMock()
    userRepository.emit(mockUser)
    vi.spyOn(userRepository, 'observeCurrentUser').mockImplementation(userRepository.observeCurrentUser.bind(userRepository))
    vi.spyOn(userRepository, 'refreshCurrentUser').mockImplementation(userRepository.refreshCurrentUser.bind(userRepository))
    vi.spyOn(userRepository, 'clearSession').mockImplementation(userRepository.clearSession.bind(userRepository))

    const logoutUseCase = new LogoutUseCaseMock()
    logoutUseCase.resultProvider = async () => appResultSuccess(undefined)
    vi.spyOn(logoutUseCase, 'execute').mockImplementation(logoutUseCase.execute.bind(logoutUseCase))

    const scheduleUserDeletionUseCase = new ScheduleUserDeletionUseCaseMock()
    scheduleUserDeletionUseCase.resultProvider = async () => appResultSuccess(mockUser)
    vi.spyOn(scheduleUserDeletionUseCase, 'execute').mockImplementation(scheduleUserDeletionUseCase.execute.bind(scheduleUserDeletionUseCase))

    return {
      appType: AppType.CLIENT,
      userRepository,
      logoutUseCase,
      scheduleUserDeletionUseCase,
      onNavigateToLogin: vi.fn(),
      onNavigateToTotp: vi.fn(),
      onNavigateToSessions: vi.fn(),
      onNavigateToIdentifiers: vi.fn(),
      ...overrides
    }
  }

  it('renders user details when authorized', () => {
    const deps = createMockDependencies()
    render(<MainUserScreen dependencies={deps} />)

    expect(screen.getByTestId(MainUserTestTags.USER_ID_TEXT).textContent).toContain(TEST_USER_ID)
    expect(screen.getByTestId(MainUserTestTags.ACCOUNT_STATUS_TEXT).textContent).toContain(userStrings.ui.accountStatusActive)
    expect(screen.getByTestId(MainUserTestTags.TOTP_MAIN_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.SESSIONS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.IDENTIFIERS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.LOGOUT_BUTTON)).not.toBeNull()
  })

  it('navigates to sessions when sessions button clicked', async () => {
    const user = userEvent.setup()
    const deps = createMockDependencies()
    render(<MainUserScreen dependencies={deps} />)

    await user.click(screen.getByTestId(MainUserTestTags.SESSIONS_BUTTON))
    expect(deps.onNavigateToSessions).toHaveBeenCalledTimes(1)
  })

  it('triggers logout use case on logout confirm', async () => {
    const user = userEvent.setup()
    const deps = createMockDependencies()
    render(<MainUserScreen dependencies={deps} />)

    await user.click(screen.getByTestId(MainUserTestTags.LOGOUT_BUTTON))
    const confirmButton = screen.getByRole('button', { name: userStrings.ui.dialogConfirm })
    await user.click(confirmButton)

    expect(deps.logoutUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('renders unauthorized state when user is null', () => {
    const userRepository = new UserRepositoryMock()
    userRepository.emit(null)
    vi.spyOn(userRepository, 'observeCurrentUser').mockImplementation(userRepository.observeCurrentUser.bind(userRepository))

    const deps = createMockDependencies({
      userRepository
    })
    render(<MainUserScreen dependencies={deps} />)

    expect(screen.getByTestId(MainUserTestTags.LOGIN_BUTTON)).not.toBeNull()
  })
})

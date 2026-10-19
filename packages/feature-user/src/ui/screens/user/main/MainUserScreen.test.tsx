import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { userPrivateMock } from '@/mock/index'
import { MainUserScreen, MainUserTestTags } from '@/ui/screens/user/main/MainUserScreen'
import type { MainUserStoreDependencies } from '@/ui/screens/user/main/main-user-store'

describe('MainUserScreen', () => {
  const mockUser = userPrivateMock({
    id: toUserIdOrThrow('usr_12345')
  })

  const createDummyDependencies = (
    overrides?: Partial<MainUserStoreDependencies>
  ): MainUserStoreDependencies => ({
    appType: AppType.CLIENT,
    userRepository: {
      getCurrentUser: vi.fn().mockReturnValue(mockUser),
      observeCurrentUser: vi.fn().mockImplementation((cb) => {
        cb(mockUser)
        return () => {}
      }),
      refreshCurrentUser: vi.fn().mockResolvedValue(appResultSuccess(mockUser)),
      clearSession: vi.fn().mockResolvedValue(undefined)
    } as any,
    logoutUseCase: { execute: vi.fn().mockResolvedValue(appResultSuccess(undefined)) } as any,
    scheduleUserDeletionUseCase: { execute: vi.fn().mockResolvedValue(appResultSuccess(undefined)) } as any,
    onNavigateToLogin: vi.fn(),
    onNavigateToTotp: vi.fn(),
    onNavigateToSessions: vi.fn(),
    onNavigateToIdentifiers: vi.fn(),
    ...overrides
  })

  it('renders user details when authorized', () => {
    const deps = createDummyDependencies()
    render(<MainUserScreen dependencies={deps} />)

    expect(screen.getByTestId(MainUserTestTags.USER_ID_TEXT).textContent).toContain('usr_12345')
    expect(screen.getByTestId(MainUserTestTags.ACCOUNT_STATUS_TEXT).textContent).toContain(userStrings.ui.accountStatusActive)
    expect(screen.getByTestId(MainUserTestTags.TOTP_MAIN_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.SESSIONS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.IDENTIFIERS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainUserTestTags.LOGOUT_BUTTON)).not.toBeNull()
  })

  it('navigates to sessions when sessions button clicked', async () => {
    const user = userEvent.setup()
    const deps = createDummyDependencies()
    render(<MainUserScreen dependencies={deps} />)

    await user.click(screen.getByTestId(MainUserTestTags.SESSIONS_BUTTON))
    expect(deps.onNavigateToSessions).toHaveBeenCalledTimes(1)
  })

  it('triggers logout use case on logout confirm', async () => {
    const user = userEvent.setup()
    const deps = createDummyDependencies()
    render(<MainUserScreen dependencies={deps} />)

    await user.click(screen.getByTestId(MainUserTestTags.LOGOUT_BUTTON))
    const confirmButton = screen.getByRole('button', { name: userStrings.ui.dialogConfirm })
    await user.click(confirmButton)

    expect(deps.logoutUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('renders unauthorized state when user is null', () => {
    const deps = createDummyDependencies({
      userRepository: {
        getCurrentUser: vi.fn().mockReturnValue(null),
        observeCurrentUser: vi.fn().mockImplementation((cb) => {
          cb(null)
          return () => {}
        }),
        refreshCurrentUser: vi.fn().mockResolvedValue(appResultSuccess(null)),
        clearSession: vi.fn().mockResolvedValue(undefined)
      } as any
    })
    render(<MainUserScreen dependencies={deps} />)

    expect(screen.getByTestId(MainUserTestTags.LOGIN_BUTTON)).not.toBeNull()
  })
})

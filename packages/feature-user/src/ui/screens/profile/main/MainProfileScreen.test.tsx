import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAccountStatus } from '@mudrichenkoevgeny/shared-foundation'
import { MainProfileScreen, MainProfileTestTags } from '@/ui/screens/profile/main/MainProfileScreen'
import type { MainProfileStoreDependencies } from '@/ui/screens/profile/main/MainProfileStore'
import { enUserStrings } from '@/locales/index'

describe('MainProfileScreen', () => {
  const createMockDeps = (user = {
    id: 'usr_12345',
    accountStatus: UserAccountStatus.ACTIVE,
    authorityLevel: 1,
    permissionCodes: []
  }): MainProfileStoreDependencies => ({
    appType: AppType.CLIENT,
    userRepository: {
      getCurrentUser: () => user as any,
      refreshCurrentUser: vi.fn().mockResolvedValue(appResultSuccess(user)),
      clearSession: vi.fn().mockResolvedValue(undefined)
    } as any,
    logoutUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    scheduleUserDeletionUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    onNavigateToLogin: vi.fn(),
    onNavigateToTotp: vi.fn(),
    onNavigateToSessions: vi.fn(),
    onNavigateToIdentifiers: vi.fn()
  })

  it('renders profile details and navigation buttons for authenticated user', () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <MainProfileScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(MainProfileTestTags.USER_ID_TEXT).textContent).toContain('usr_12345')
    expect(screen.getByTestId(MainProfileTestTags.ACCOUNT_STATUS_TEXT).textContent).toContain(enUserStrings.account_status_active)
    expect(screen.getByTestId(MainProfileTestTags.TOTP_MAIN_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainProfileTestTags.SESSIONS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainProfileTestTags.IDENTIFIERS_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(MainProfileTestTags.LOGOUT_BUTTON)).not.toBeNull()
  })

  it('navigates to sessions when sessions button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <MainProfileScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(MainProfileTestTags.SESSIONS_BUTTON))
    expect(deps.onNavigateToSessions).toHaveBeenCalledTimes(1)
  })

  it('shows logout confirmation dialog and executes logout', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <MainProfileScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(MainProfileTestTags.LOGOUT_BUTTON))

    expect(screen.getByText(enUserStrings.logout_confirm_msg)).not.toBeNull()

    const confirmBtn = screen.getByRole('button', { name: enUserStrings.dialog_confirm })
    await user.click(confirmBtn)

    expect(deps.logoutUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('renders sign in button when user is unauthorized', () => {
    const deps = createMockDeps(null as any)

    render(
      <ComponentTestHarness>
        <MainProfileScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(MainProfileTestTags.LOGIN_BUTTON)).not.toBeNull()
  })
})

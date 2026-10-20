import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserPrivate, TEST_USER_ID, toUserIdOrThrow, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { TotpMainScreen, TotpMainTestTags } from '@/ui/screens/user/totp/main/TotpMainScreen'
import { totpMainDependenciesMock } from '@/mock/ui/screen/user/totp/main/totp-main-component-mock'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'

describe('TotpMainScreen', () => {
  it('renders disabled state and starts setup when setup button is clicked', async () => {
    const deps = totpMainDependenciesMock()
    vi.spyOn(deps.setupTotpUseCase, 'execute')
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <TotpMainScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(TotpMainTestTags.DISABLED_DESC_TEXT)).not.toBeNull()

    const setupBtn = screen.getByTestId(TotpMainTestTags.SETUP_TOTP_BUTTON)
    await user.click(setupBtn)

    expect(deps.setupTotpUseCase.execute).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId(TotpMainTestTags.SECRET_KEY_TEXT).textContent).toBe('JBSWY3DPEHPK3PXP')
  })

  it('renders enabled state when TOTP is active on user account', () => {
    const deps = totpMainDependenciesMock()
    const userRepository = new UserRepositoryMock()
    userRepository.emit(createTestUserPrivate({
      id: toUserIdOrThrow(TEST_USER_ID),
      isTotpEnabled: true
    }))
    deps.userRepository = userRepository

    render(
      <ComponentTestHarness>
        <TotpMainScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(TotpMainTestTags.ENABLED_TITLE).textContent).toBe(userStrings.ui.totpEnabledTitle)
    expect(screen.getByTestId(TotpMainTestTags.RECOVERY_CODES_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(TotpMainTestTags.DISABLE_TOTP_BUTTON)).not.toBeNull()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = totpMainDependenciesMock()
    vi.spyOn(deps, 'onBack')
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <TotpMainScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await user.click(screen.getByTestId(TotpMainTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

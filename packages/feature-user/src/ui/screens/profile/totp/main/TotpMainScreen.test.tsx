import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TotpMainScreen, TotpMainTestTags } from '@/ui/screens/profile/totp/main/TotpMainScreen'
import type { TotpMainStoreDependencies } from '@/ui/screens/profile/totp/main/TotpMainStore'
import { enUserStrings } from '@/locales/index'

describe('TotpMainScreen', () => {
  const createMockDeps = (user = {
    id: 'usr_123',
    isTotpEnabled: false
  }): TotpMainStoreDependencies => ({
    userRepository: {
      getCurrentUser: () => user as any,
      refreshCurrentUser: vi.fn().mockResolvedValue(appResultSuccess(user))
    } as any,
    setupTotpUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          totpSecretKey: 'JBSWY3DPEHPK3PXP',
          totpOtpAuthUrl: 'otpauth://totp/Test?secret=JBSWY3DPEHPK3PXP',
          mfaToken: 'mfa_123'
        })
      )
    } as any,
    enableTotpUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          totpRecoveryCodes: ['1111-2222', '3333-4444']
        })
      )
    } as any,
    disableTotpUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    onNavigateToRecoveryCodes: vi.fn(),
    onBack: vi.fn()
  })

  it('renders disabled state and starts setup when setup button is clicked', async () => {
    const deps = createMockDeps()
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
    const deps = createMockDeps({ id: 'usr_123', isTotpEnabled: true })

    render(
      <ComponentTestHarness>
        <TotpMainScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByTestId(TotpMainTestTags.ENABLED_TITLE).textContent).toBe(enUserStrings.totp_enabled_title)
    expect(screen.getByTestId(TotpMainTestTags.RECOVERY_CODES_BUTTON)).not.toBeNull()
    expect(screen.getByTestId(TotpMainTestTags.DISABLE_TOTP_BUTTON)).not.toBeNull()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
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

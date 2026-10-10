import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LoginByTotpScreen } from '@/ui/screens/auth/login/totp/LoginByTotpScreen'
import type { LoginByTotpStoreDependencies } from '@/ui/screens/auth/login/totp/login-by-totp-store'
import { enUserStrings } from '@/locales/index'

describe('LoginByTotpScreen', () => {
  const createMockDeps = (): LoginByTotpStoreDependencies => ({
    mfaToken: 'mock_mfa_token',
    loginByTotpUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userPrivate: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as any,
    loginByTotpRecoveryCodeUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          userPrivate: {
            id: 'usr_123',
            accountStatus: 'ACTIVE'
          }
        })
      )
    } as any,
    onNavigateToPendingDeletion: vi.fn(),
    onBack: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders TOTP mode by default and enables submit when 6 digits are typed', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByTotpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.login_by_totp)).toBeDefined()

    const submitBtn = screen.getByRole('button', { name: enUserStrings.login })
    expect(submitBtn.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, '123456')

    expect(submitBtn.getAttribute('disabled')).toBeNull()

    await user.click(submitBtn)

    expect(deps.loginByTotpUseCase.execute).toHaveBeenCalledWith('mock_mfa_token', '123456')
    expect(deps.onFinished).toHaveBeenCalledTimes(1)
  })

  it('toggles mode to recovery code when toggle button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginByTotpScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const toggleBtn = screen.getByRole('button', { name: enUserStrings.use_recovery_code })
    await user.click(toggleBtn)

    expect(screen.getByText(enUserStrings.login_by_recovery_code)).toBeDefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { LoginWelcomeScreen } from '@/ui/screens/auth/login/welcome/LoginWelcomeScreen'
import type { LoginWelcomeStoreDependencies } from '@/ui/screens/auth/login/welcome/login-welcome-store'

describe('LoginWelcomeScreen', () => {
  const createMockDeps = (): LoginWelcomeStoreDependencies => ({
    externalLauncher: { openUrl: vi.fn(), openMail: vi.fn(), openFile: vi.fn() },
    getOpenGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          privacyPolicyUrl: 'https://example.com/privacy',
          termsOfServiceUrl: 'https://example.com/terms'
        })
      )
    } as any,
    getAvailableUserAuthProvidersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          primary: [UserAuthProvider.EMAIL, UserAuthProvider.PHONE],
          secondary: [UserAuthProvider.GOOGLE, UserAuthProvider.APPLE]
        })
      )
    } as any,
    onNavigateToLoginByEmail: vi.fn(),
    onNavigateToLoginByPhone: vi.fn(),
    onNavigateToTotp: vi.fn(),
    onNavigateToPendingDeletion: vi.fn(),
    onNavigateToAccountUnlock: vi.fn(),
    onFinished: vi.fn()
  })

  it('loads auth providers and renders sign in options', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <LoginWelcomeScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByRole('button', { name: userStrings.ui.signInWithEmail })).toBeDefined()
    expect(screen.getByRole('button', { name: userStrings.ui.signInWithPhone })).toBeDefined()
    expect(screen.getByRole('button', { name: userStrings.ui.signInWithGoogle })).toBeDefined()
  })

  it('triggers onNavigateToLoginByEmail when Email button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginWelcomeScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const emailBtn = await screen.findByRole('button', { name: userStrings.ui.signInWithEmail })
    await user.click(emailBtn)

    expect(deps.onNavigateToLoginByEmail).toHaveBeenCalledTimes(1)
  })

  it('opens privacy policy URL when clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginWelcomeScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const privacyBtn = await screen.findByRole('button', { name: userStrings.ui.privacyPolicy })
    await user.click(privacyBtn)

    expect(deps.externalLauncher.openUrl).toHaveBeenCalledWith('https://example.com/privacy')
  })
})

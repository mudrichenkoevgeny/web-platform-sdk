import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { LoginWelcomeScreen } from './LoginWelcomeScreen'
import { LoginWelcomeStoreDependencies } from './LoginWelcomeStore'
import { enUserStrings } from '@/locales/index'

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

    expect(await screen.findByRole('button', { name: enUserStrings.sign_in_with_email })).toBeDefined()
    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_phone })).toBeDefined()
    expect(screen.getByRole('button', { name: enUserStrings.sign_in_with_google })).toBeDefined()
  })

  it('triggers onNavigateToLoginByEmail when Email button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <LoginWelcomeScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const emailBtn = await screen.findByRole('button', { name: enUserStrings.sign_in_with_email })
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

    const privacyBtn = await screen.findByRole('button', { name: enUserStrings.privacy_policy })
    await user.click(privacyBtn)

    expect(deps.externalLauncher.openUrl).toHaveBeenCalledWith('https://example.com/privacy')
  })
})

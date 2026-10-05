import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { ClientLoginRootScreen } from '@/ui/screens/auth/login/root/ClientLoginRootScreen'
import type { ClientLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ClientLoginRootStore'

describe('ClientLoginRootScreen', () => {
  const createMockDeps = (): ClientLoginRootStoreDependencies => ({
    appType: AppType.CLIENT,
    getOpenGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    getAvailableUserAuthProvidersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          primary: ['EMAIL'],
          secondary: ['PHONE']
        })
      )
    } as any,
    loginByGoogleUseCase: {} as any,
    loginByEmailUseCase: {} as any,
    loginRepository: {} as any,
    sendLoginConfirmationToPhoneUseCase: {} as any,
    loginByPhoneUseCase: {} as any,
    registrationRepository: {} as any,
    sendRegistrationConfirmationToEmailUseCase: {} as any,
    registrationByEmailUseCase: {} as any,
    resetPasswordRepository: {} as any,
    sendResetPasswordConfirmationToEmailUseCase: {} as any,
    resetEmailPasswordUseCase: {} as any,
    validatePasswordUseCase: {} as any,
    loginByTotpUseCase: {} as any,
    loginByTotpRecoveryCodeUseCase: {} as any,
    restoreUserUseCase: {} as any,
    logoutUseCase: {} as any,
    getUserIdentifiersUseCase: {} as any,
    unlockByGoogleUseCase: {} as any,
    sendUnlockEmailConfirmationUseCase: {} as any,
    sendUnlockPhoneConfirmationUseCase: {} as any,
    unlockByEmailUseCase: {} as any,
    unlockByPhoneUseCase: {} as any,
    externalLauncher: {} as any,
    onDismiss: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders the initial welcome screen inside the login container', () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <ClientLoginRootScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('dialog')).not.toBeNull()
  })
})

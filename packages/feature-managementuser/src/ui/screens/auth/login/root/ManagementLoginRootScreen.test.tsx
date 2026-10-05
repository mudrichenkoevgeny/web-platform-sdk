import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementLoginRootScreen } from '@/ui/screens/auth/login/root/ManagementLoginRootScreen'
import type { ManagementLoginRootStoreDependencies } from '@/ui/screens/auth/login/root/ManagementLoginRootStore'

describe('ManagementLoginRootScreen', () => {
  const createMockDeps = (): ManagementLoginRootStoreDependencies => ({
    appType: AppType.MANAGEMENT,
    getOpenGlobalSettingsUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({}))
    } as any,
    getAvailableUserAuthProvidersUseCase: {
      execute: vi.fn().mockResolvedValue(
        appResultSuccess({
          primary: ['EMAIL'],
          secondary: []
        })
      )
    } as any,
    loginByEmailUseCase: {} as any,
    resetPasswordRepository: {} as any,
    sendResetPasswordConfirmationToEmailUseCase: {} as any,
    resetEmailPasswordUseCase: {} as any,
    validatePasswordUseCase: {} as any,
    loginByTotpUseCase: {} as any,
    loginByTotpRecoveryCodeUseCase: {} as any,
    restoreUserUseCase: {} as any,
    logoutUseCase: {} as any,
    getUserIdentifiersUseCase: {} as any,
    sendUnlockEmailConfirmationUseCase: {} as any,
    sendUnlockPhoneConfirmationUseCase: {} as any,
    unlockByEmailUseCase: {} as any,
    unlockByPhoneUseCase: {} as any,
    externalLauncher: {} as any,
    onDismiss: vi.fn(),
    onFinished: vi.fn()
  })

  it('renders the initial welcome screen inside the login container for management user', () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <ManagementLoginRootScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByRole('dialog')).not.toBeNull()
  })
})

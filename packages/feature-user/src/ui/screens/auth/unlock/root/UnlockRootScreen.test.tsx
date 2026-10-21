import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userStrings, createTestOtpConfirmation } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockRootScreen } from '@/ui/screens/auth/unlock/root/UnlockRootScreen'
import type { UnlockRootStoreDependencies } from '@/ui/screens/auth/unlock/root/unlock-root-store'

describe('UnlockRootScreen', () => {
  const createMockDeps = (): UnlockRootStoreDependencies => ({
    getUserIdentifiersUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ items: [] }))
    } as unknown as UnlockRootStoreDependencies['getUserIdentifiersUseCase'],
    sendUnlockEmailConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestOtpConfirmation()))
    } as unknown as UnlockRootStoreDependencies['sendUnlockEmailConfirmationUseCase'],
    sendUnlockPhoneConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(createTestOtpConfirmation()))
    } as unknown as UnlockRootStoreDependencies['sendUnlockPhoneConfirmationUseCase'],
    unlockByEmailUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as UnlockRootStoreDependencies['unlockByEmailUseCase'],
    unlockByPhoneUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as unknown as UnlockRootStoreDependencies['unlockByPhoneUseCase'],
    onUnlockSuccess: vi.fn(),
    onBack: vi.fn()
  })

  it('renders initial selection step', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <UnlockRootScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText(userStrings.ui.unlockChooseMethod)).toBeDefined()
  })
})

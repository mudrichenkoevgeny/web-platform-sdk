import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockRootScreen } from '@/ui/screens/auth/unlock/root/UnlockRootScreen'
import type { UnlockRootStoreDependencies } from '@/ui/screens/auth/unlock/root/unlock-root-store'
import { enUserStrings } from '@/locales/index'

describe('UnlockRootScreen', () => {
  const createMockDeps = (): UnlockRootStoreDependencies => ({
    getUserIdentifiersUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ items: [] }))
    } as unknown as UnlockRootStoreDependencies['getUserIdentifiersUseCase'],
    sendUnlockEmailConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 60 }))
    } as unknown as UnlockRootStoreDependencies['sendUnlockEmailConfirmationUseCase'],
    sendUnlockPhoneConfirmationUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess({ retryAfterSeconds: 60 }))
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

    expect(await screen.findByText(enUserStrings.unlock_choose_method)).toBeDefined()
  })
})

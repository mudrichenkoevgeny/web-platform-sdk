import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { PendingDeletionScreen } from '@/ui/screens/auth/login/pending-deletion/PendingDeletionScreen'
import type { PendingDeletionStoreDependencies } from '@/ui/screens/auth/login/pending-deletion/pending-deletion-store'

const userStrings = new UserModuleStrings()

describe('PendingDeletionScreen', () => {
  const createMockDeps = (): PendingDeletionStoreDependencies => ({
    restoreUserUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    logoutUseCase: {
      execute: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    onRestoreSuccess: vi.fn(),
    onSignOut: vi.fn()
  })

  it('renders pending deletion warning card and triggers restore action', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <PendingDeletionScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.accountPendingDeletionDesc)).toBeDefined()

    const restoreButton = screen.getByRole('button', { name: userStrings.ui.restoreAccount })
    await user.click(restoreButton)

    expect(deps.restoreUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onRestoreSuccess).toHaveBeenCalledTimes(1)
  })

  it('triggers logout action when sign out button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <PendingDeletionScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    const logoutButton = screen.getByRole('button', { name: userStrings.ui.logout })
    await user.click(logoutButton)

    expect(deps.logoutUseCase.execute).toHaveBeenCalledTimes(1)
    expect(deps.onSignOut).toHaveBeenCalledTimes(1)
  })
})

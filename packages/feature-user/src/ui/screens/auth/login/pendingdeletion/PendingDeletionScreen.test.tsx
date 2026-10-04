import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { PendingDeletionScreen } from '@/ui/screens/auth/login/pendingdeletion/PendingDeletionScreen'
import type { PendingDeletionStoreDependencies } from '@/ui/screens/auth/login/pendingdeletion/PendingDeletionStore'
import { enUserStrings } from '@/locales/index'

describe('PendingDeletionScreen', () => {
  const createMockDeps = (): PendingDeletionStoreDependencies => ({
    restoreUserUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
    } as any,
    logoutUseCase: {
      invoke: vi.fn().mockResolvedValue(appResultSuccess(undefined))
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

    expect(screen.getByText(enUserStrings.account_pending_deletion_desc)).toBeDefined()

    const restoreButton = screen.getByRole('button', { name: enUserStrings.restore_account })
    await user.click(restoreButton)

    expect(deps.restoreUserUseCase.invoke).toHaveBeenCalledTimes(1)
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

    const logoutButton = screen.getByRole('button', { name: enUserStrings.logout })
    await user.click(logoutButton)

    expect(deps.logoutUseCase.invoke).toHaveBeenCalledTimes(1)
    expect(deps.onSignOut).toHaveBeenCalledTimes(1)
  })
})

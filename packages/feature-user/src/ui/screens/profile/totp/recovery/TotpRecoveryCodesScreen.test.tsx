import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { appResultSuccess, ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { TotpRecoveryCodesScreen, TotpRecoveryCodesTestTags } from '@/ui/screens/profile/totp/recovery/TotpRecoveryCodesScreen'
import type { TotpRecoveryCodesStoreDependencies } from '@/ui/screens/profile/totp/recovery/TotpRecoveryCodesStore'
import { enUserStrings } from '@/locales/index'

describe('TotpRecoveryCodesScreen', () => {
  const createMockDeps = (): TotpRecoveryCodesStoreDependencies => ({
    getRecoveryCodesUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          totpRecoveryCodes: ['1111-2222', '3333-4444', '5555-6666', '7777-8888']
        })
      )
    } as any,
    regenerateRecoveryCodesUseCase: {
      invoke: vi.fn().mockResolvedValue(
        appResultSuccess({
          totpRecoveryCodes: ['AAAA-BBBB', 'CCCC-DDDD']
        })
      )
    } as any,
    onBack: vi.fn()
  })

  it('renders recovery codes list from getRecoveryCodesUseCase', async () => {
    const deps = createMockDeps()

    render(
      <ComponentTestHarness>
        <TotpRecoveryCodesScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    expect(await screen.findByText('1111-2222')).not.toBeNull()
    expect(screen.getByText('3333-4444')).not.toBeNull()
    expect(deps.getRecoveryCodesUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('shows regenerate confirmation dialog and calls regenerateRecoveryCodesUseCase', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <TotpRecoveryCodesScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('1111-2222')

    const regenerateBtn = screen.getByTestId(TotpRecoveryCodesTestTags.REGENERATE_RECOVERY_CODES_BUTTON)
    await user.click(regenerateBtn)

    expect(screen.getByText(enUserStrings.regenerate_codes_confirm_msg)).not.toBeNull()

    const confirmBtn = screen.getByRole('button', { name: enUserStrings.dialog_confirm })
    await user.click(confirmBtn)

    expect(deps.regenerateRecoveryCodesUseCase.execute).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('AAAA-BBBB')).not.toBeNull()
  })

  it('triggers onBack when back button is clicked', async () => {
    const deps = createMockDeps()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <TotpRecoveryCodesScreen dependencies={deps} />
      </ComponentTestHarness>
    )

    await screen.findByText('1111-2222')

    await user.click(screen.getByTestId(TotpRecoveryCodesTestTags.BACK_BUTTON))
    expect(deps.onBack).toHaveBeenCalledTimes(1)
  })
})

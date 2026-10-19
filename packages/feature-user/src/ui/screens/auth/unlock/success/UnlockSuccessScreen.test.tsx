import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UnlockSuccessScreen } from '@/ui/screens/auth/unlock/success/UnlockSuccessScreen'

describe('UnlockSuccessScreen', () => {
  it('renders success title, description and handles finish button click', async () => {
    const onFinished = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockSuccessScreen onFinished={onFinished} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(userStrings.ui.unlockSuccessTitle)).toBeDefined()
    expect(screen.getByText(userStrings.ui.unlockSuccessDesc)).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: userStrings.ui.dialogConfirm })
    await user.click(confirmBtn)

    expect(onFinished).toHaveBeenCalledTimes(1)
  })
})

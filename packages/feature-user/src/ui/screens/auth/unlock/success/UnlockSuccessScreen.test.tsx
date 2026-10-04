import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockSuccessScreen } from '@/ui/screens/auth/unlock/success/UnlockSuccessScreen'
import { enUserStrings } from '@/locales/index'

describe('UnlockSuccessScreen', () => {
  it('renders success title, description and handles finish button click', async () => {
    const onFinished = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <UnlockSuccessScreen onFinished={onFinished} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.unlock_success_title)).toBeDefined()
    expect(screen.getByText(enUserStrings.unlock_success_desc)).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: enUserStrings.dialog_confirm })
    await user.click(confirmBtn)

    expect(onFinished).toHaveBeenCalledTimes(1)
  })
})

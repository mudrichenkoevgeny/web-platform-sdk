import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { MfaChallengeDialog } from '@/ui/components/mfa/dialog/MfaChallengeDialog'
import { enUserStrings } from '@/locales/index'
import type { MfaChallengeRequest } from '@/network/httpclient/mfa/mfa-challenge-request'

describe('MfaChallengeDialog', () => {
  const mockRequest: MfaChallengeRequest = {
    mfaToken: 'mock_mfa_token',
    confirm: vi.fn(),
    cancel: vi.fn()
  }

  it('renders title, description and enables confirm button when code is typed', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <MfaChallengeDialog
          request={mockRequest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText(enUserStrings.mfa_step_up_title)).toBeDefined()
    expect(screen.getByText(enUserStrings.mfa_step_up_desc)).toBeDefined()

    const confirmButton = screen.getByRole('button', { name: enUserStrings.confirm })
    expect(confirmButton.getAttribute('disabled')).not.toBeNull()

    const input = screen.getByRole('textbox')
    await user.type(input, '123456')

    expect(confirmButton.getAttribute('disabled')).toBeNull()

    await user.click(confirmButton)
    expect(onConfirm).toHaveBeenCalledWith('123456')
  })

  it('triggers onCancel when cancel button is clicked', async () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <MfaChallengeDialog
          request={mockRequest}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </ComponentTestHarness>
    )

    const cancelButton = screen.getByRole('button', { name: enUserStrings.cancel })
    await user.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})

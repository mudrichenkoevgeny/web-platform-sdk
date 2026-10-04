import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoreBackButton } from './CoreBackButton'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('CoreBackButton', () => {
  it('triggers onClick callback when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreBackButton onClick={onClick} ariaLabel="Go Back" />
      </ComponentTestHarness>
    )

    const button = screen.getByLabelText('Go Back')
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not trigger onClick when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreBackButton onClick={onClick} disabled ariaLabel="Go Back" />
      </ComponentTestHarness>
    )

    const button = screen.getByLabelText('Go Back')
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })
})

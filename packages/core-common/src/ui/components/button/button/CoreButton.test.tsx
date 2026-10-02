import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoreButton } from './CoreButton'
import { ComponentTestHarness } from '../../../../testing/ComponentTestHarness'

describe('CoreButton', () => {
  it('renders label and handles click event', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreButton label="Click Me" onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: 'Click Me' })
    expect(button).toBeDefined()

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading spinner when isLoading is true and disables button', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreButton label="Click Me" isLoading onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button')
    expect(button.getAttribute('disabled')).not.toBeNull()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})

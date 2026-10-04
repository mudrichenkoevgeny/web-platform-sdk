import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoreTextButton } from './CoreTextButton'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('CoreTextButton', () => {
  it('renders label and handles click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreTextButton label="Cancel" onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByRole('button', { name: 'Cancel' })
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CorePasswordTextField } from './CorePasswordTextField'
import { ComponentTestHarness } from '../../../../testing/ComponentTestHarness'

describe('CorePasswordTextField', () => {
  it('toggles password visibility when toggle button is clicked', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CorePasswordTextField
          placeholder="Password"
          isPasswordVisible={false}
          onTogglePasswordVisibility={onToggle}
        />
      </ComponentTestHarness>
    )

    const toggleButton = screen.getByRole('button', { name: 'Show password' })
    await user.click(toggleButton)

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})

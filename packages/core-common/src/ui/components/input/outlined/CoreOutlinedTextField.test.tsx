import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoreOutlinedTextField } from './CoreOutlinedTextField'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('CoreOutlinedTextField', () => {
  it('renders label and handles text input', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreOutlinedTextField
          label="Username"
          placeholder="Enter username"
          onChange={onChange}
        />
      </ComponentTestHarness>
    )

    const input = screen.getByLabelText('Username')
    await user.type(input, 'john')

    expect(onChange).toHaveBeenCalled()
  })

  it('displays error text when isError is true', () => {
    render(
      <ComponentTestHarness>
        <CoreOutlinedTextField
          label="Email"
          isError
          errorText="Invalid email address"
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Invalid email address')).toBeDefined()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { CoreButton } from '@/ui/components/button/button/CoreButton'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

const TEST_BUTTON_TAG = 'core-button-submit'

describe('CoreButton', () => {
  it('renders label and handles click event', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    const { container } = render(
      <ComponentTestHarness>
        <CoreButton label="Click Me" data-testid={TEST_BUTTON_TAG} onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByTestId(TEST_BUTTON_TAG)
    expect(button).toBeDefined()

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('shows loading spinner when isLoading is true and disables button', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <CoreButton label="Click Me" isLoading data-testid={TEST_BUTTON_TAG} onClick={onClick} />
      </ComponentTestHarness>
    )

    const button = screen.getByTestId(TEST_BUTTON_TAG)
    expect(button.getAttribute('disabled')).not.toBeNull()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})

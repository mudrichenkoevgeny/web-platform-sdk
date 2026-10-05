import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FullscreenError } from '@/ui/components/error/fullscreen/FullscreenError'
import { CommonError } from '@/error/model/common-error'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('FullscreenError', () => {
  it('renders error message and shows retry button for retryable error', async () => {
    const error = CommonError.network(new Error('Connection failed'), true)
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <FullscreenError error={error} onRetry={onRetry} />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Network error.')).toBeDefined()
    const retryButton = screen.getByText('Retry')
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('does not show retry button for non-retryable error', () => {
    const error = CommonError.unknown(false)

    render(
      <ComponentTestHarness>
        <FullscreenError error={error} onRetry={() => undefined} />
      </ComponentTestHarness>
    )

    expect(screen.getByText('An error has occurred.')).toBeDefined()
    expect(screen.queryByText('Retry')).toBeNull()
  })
})

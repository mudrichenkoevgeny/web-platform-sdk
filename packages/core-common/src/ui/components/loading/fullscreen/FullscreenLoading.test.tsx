import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FullscreenLoading } from '@/ui/components/loading/fullscreen/FullscreenLoading'

describe('FullscreenLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows immediately when delayMillis is 0', () => {
    render(<FullscreenLoading delayMillis={0} />)
    expect(screen.getByRole('status')).toBeDefined()
  })

  it('delays visibility when delayMillis is set', () => {
    const { container } = render(<FullscreenLoading delayMillis={250} />)
    expect(container.firstChild).toBeNull()

    vi.advanceTimersByTime(250)
    expect(screen.getByRole('status')).toBeDefined()
  })
})

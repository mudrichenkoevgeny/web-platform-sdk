import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FullscreenOverlayLoading } from './FullscreenOverlayLoading'

describe('FullscreenOverlayLoading', () => {
  it('renders overlay spinner with role status', () => {
    const { container } = render(<FullscreenOverlayLoading />)
    expect(screen.getByRole('status')).toBeDefined()
    expect(container.firstElementChild?.classList.contains('absolute')).toBe(true)
  })

  it('renders fixed overlay when isFixed is true', () => {
    const { container } = render(<FullscreenOverlayLoading isFixed />)
    expect(container.firstElementChild?.classList.contains('fixed')).toBe(true)
  })
})

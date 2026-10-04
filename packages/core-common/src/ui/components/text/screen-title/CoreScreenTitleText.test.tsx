import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreScreenTitleText } from '@/ui/components/text/screen-title/CoreScreenTitleText'

describe('CoreScreenTitleText', () => {
  it('renders screen title text as h1', () => {
    render(<CoreScreenTitleText text="Dashboard" />)

    const titleElement = screen.getByRole('heading', { level: 1 })
    expect(titleElement.textContent).toBe('Dashboard')
  })
})

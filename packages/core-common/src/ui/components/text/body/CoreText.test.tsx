import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreBodyText, CoreSmallText, CoreTitleText } from '@/ui/components/text/body/CoreText'

describe('CoreText components', () => {
  it('renders CoreBodyText correctly', () => {
    render(<CoreBodyText text="Body paragraph" />)
    expect(screen.getByText('Body paragraph')).toBeDefined()
  })

  it('renders CoreSmallText correctly', () => {
    render(<CoreSmallText text="Small hint text" />)
    expect(screen.getByText('Small hint text')).toBeDefined()
  })

  it('renders CoreTitleText as h2', () => {
    render(<CoreTitleText text="Section Header" />)
    const title = screen.getByRole('heading', { level: 2 })
    expect(title.textContent).toBe('Section Header')
  })
})

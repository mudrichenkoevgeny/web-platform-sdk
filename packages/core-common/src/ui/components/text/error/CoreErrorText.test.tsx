import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreErrorText } from './CoreErrorText'

describe('CoreErrorText', () => {
  it('renders error message text with error styling', () => {
    render(<CoreErrorText text="Invalid credentials" />)

    const textElement = screen.getByText('Invalid credentials')
    expect(textElement).toBeDefined()
    expect(textElement.classList.contains('text-error')).toBe(true)
  })
})

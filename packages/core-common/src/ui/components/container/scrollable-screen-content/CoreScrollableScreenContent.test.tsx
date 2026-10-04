import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoreScrollableScreenContent } from '@/ui/components/container/scrollable-screen-content/CoreScrollableScreenContent'

describe('CoreScrollableScreenContent', () => {
  it('renders children within container', () => {
    render(
      <CoreScrollableScreenContent>
        <p>Screen Content</p>
      </CoreScrollableScreenContent>
    )

    expect(screen.getByText('Screen Content')).toBeDefined()
  })
})

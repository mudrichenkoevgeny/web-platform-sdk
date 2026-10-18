import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocalizationProvider, useLocalization } from '@/context/LocalizationContext'

const TestComponent = () => {
  const localization = useLocalization()
  return <div data-testid="retry-label">{localization.common.ui.retry}</div>
}

describe('LocalizationContext', () => {
  it('provides SharedFoundationLocalization context to child components', () => {
    render(
      <LocalizationProvider locale="en">
        <TestComponent />
      </LocalizationProvider>
    )

    expect(screen.getByTestId('retry-label').textContent).toBe('Retry')
  })

  it('throws error when used outside LocalizationProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useLocalization must be used within a LocalizationProvider'
    )
  })
})

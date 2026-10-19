import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CommonLocales } from '@mudrichenkoevgeny/shared-foundation'
import { LocalizationProvider, useLocalization } from '@/context/LocalizationContext'

const TestComponent = () => {
  const { localization, setLocale } = useLocalization()
  return (
    <div>
      <div data-testid="retry-label">{localization.common.ui.retry}</div>
      <button data-testid="switch-ru" onClick={() => setLocale(CommonLocales.RUSSIAN)}>
        Switch to RU
      </button>
    </div>
  )
}

describe('LocalizationContext', () => {
  it('provides SharedFoundationLocalization context to child components', () => {
    render(
      <LocalizationProvider locale={CommonLocales.ENGLISH}>
        <TestComponent />
      </LocalizationProvider>
    )

    expect(screen.getByTestId('retry-label').textContent).toBe('Retry')
  })

  it('supports hot locale switching via setLocale', () => {
    render(
      <LocalizationProvider locale={CommonLocales.ENGLISH}>
        <TestComponent />
      </LocalizationProvider>
    )

    expect(screen.getByTestId('retry-label').textContent).toBe('Retry')

    act(() => {
      screen.getByTestId('switch-ru').click()
    })

    expect(screen.getByTestId('retry-label').textContent).toBe('Повторить')
  })

  it('throws error when used outside LocalizationProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useLocalization must be used within a LocalizationProvider'
    )
  })
})

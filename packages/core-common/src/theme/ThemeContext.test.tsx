import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, vi } from 'vitest'
import { ThemeMode, ThemeProvider, useTheme } from '@/theme/ThemeContext.js'

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    vi.restoreAllMocks()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('dark') ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  it('throws error when useTheme is used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    )
  })

  it('initializes with default system mode and applies theme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
    })

    expect(result.current.mode).toBe(ThemeMode.SYSTEM)
    expect(result.current.resolvedTheme).toBe(ThemeMode.LIGHT)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('changes mode to dark and applies dark class', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>
    })

    act(() => {
      result.current.setMode(ThemeMode.DARK)
    })

    expect(result.current.mode).toBe(ThemeMode.DARK)
    expect(result.current.resolvedTheme).toBe(ThemeMode.DARK)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('web-platform-sdk-theme')).toBe('dark')
  })

  it('changes mode to light and removes dark class', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider defaultMode={ThemeMode.DARK}>{children}</ThemeProvider>
    })

    act(() => {
      result.current.setMode(ThemeMode.LIGHT)
    })

    expect(result.current.mode).toBe(ThemeMode.LIGHT)
    expect(result.current.resolvedTheme).toBe(ThemeMode.LIGHT)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

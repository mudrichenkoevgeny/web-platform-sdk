import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { ThemeMode } from '@mudrichenkoevgeny/shared-foundation'

export { ThemeMode }

/** Context value contract exposed by {@link ThemeProvider}. */
export interface ThemeContextValue {
  /** Active theme mode setting. */
  mode: ThemeMode
  /** Function to update active theme mode. */
  setMode: (mode: ThemeMode) => void
  /** Resolved active theme ({@link ThemeMode.LIGHT} or {@link ThemeMode.DARK}). */
  resolvedTheme: typeof ThemeMode.LIGHT | typeof ThemeMode.DARK
}

/** Props for {@link ThemeProvider}. */
export interface ThemeProviderProps {
  /** React component children subtree. */
  children: ReactNode
  /** Default theme mode. Defaults to {@link ThemeMode.SYSTEM}. */
  defaultMode?: ThemeMode
  /** LocalStorage key for persisting theme setting. Defaults to `'web-platform-sdk-theme'`. */
  storageKey?: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Type guard validating whether an unknown value is a valid {@link ThemeMode}.
 *
 * @param value - Value to test
 * @returns True if value is a valid {@link ThemeMode}
 */
function isValidThemeMode(value: unknown): value is ThemeMode {
  return (
    value === ThemeMode.LIGHT ||
    value === ThemeMode.DARK ||
    value === ThemeMode.SYSTEM
  )
}

/**
 * Helper function detecting system prefers-color-scheme setting.
 *
 * @returns {@link ThemeMode.DARK} if dark mode preference is detected, else {@link ThemeMode.LIGHT}
 */
function getSystemTheme(): typeof ThemeMode.LIGHT | typeof ThemeMode.DARK {
  if (typeof window === 'undefined') {
    return ThemeMode.LIGHT
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ThemeMode.DARK
    : ThemeMode.LIGHT
}

/**
 * Context provider managing application theme state, document class updates, and localStorage persistence.
 *
 * @param props - Provider properties
 * @returns JSX Element wrapping children with theme context
 */
export function ThemeProvider({
  children,
  defaultMode = ThemeMode.SYSTEM,
  storageKey = 'web-platform-sdk-theme'
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return defaultMode
    }
    const savedValue = localStorage.getItem(storageKey)
    return isValidThemeMode(savedValue) ? savedValue : defaultMode
  })

  const [resolvedTheme, setResolvedTheme] = useState<typeof ThemeMode.LIGHT | typeof ThemeMode.DARK>(() => {
    if (mode === ThemeMode.SYSTEM) {
      return getSystemTheme()
    }
    return mode
  })

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (currentMode: ThemeMode) => {
      const activeTheme = currentMode === ThemeMode.SYSTEM ? getSystemTheme() : currentMode
      setResolvedTheme(activeTheme)

      if (activeTheme === ThemeMode.DARK) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    applyTheme(mode)

    if (mode === ThemeMode.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        applyTheme(ThemeMode.SYSTEM)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
    return undefined
  }, [mode])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newMode)
    }
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook retrieving active {@link ThemeContextValue} from context.
 *
 * @returns Resolved {@link ThemeContextValue} context value
 * @throws Error if called outside of {@link ThemeProvider}
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

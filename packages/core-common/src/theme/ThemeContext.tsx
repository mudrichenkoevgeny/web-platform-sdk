import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  resolvedTheme: 'light' | 'dark'
}

export interface ThemeProviderProps {
  children: ReactNode
  defaultMode?: ThemeMode
  storageKey?: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({
  children,
  defaultMode = 'system',
  storageKey = 'web-platform-sdk-theme'
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return defaultMode
    }
    const savedMode = localStorage.getItem(storageKey) as ThemeMode | null
    return savedMode ?? defaultMode
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (mode === 'system') {
      return getSystemTheme()
    }
    return mode
  })

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (currentMode: ThemeMode) => {
      const activeTheme = currentMode === 'system' ? getSystemTheme() : currentMode
      setResolvedTheme(activeTheme)

      if (activeTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    applyTheme(mode)

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        applyTheme('system')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
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

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

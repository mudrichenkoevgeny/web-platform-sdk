import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'

const VIRTUAL_REDIRECT_PREFIXES = new Set(['/audit', '/auth'])

export function getParentRoutePath(pathname: string): string | null {
  const cleanPath = pathname.replace(/\/+$/, '')
  if (!cleanPath || cleanPath === '/') return null

  const lastSlashIndex = cleanPath.lastIndexOf('/')
  if (lastSlashIndex <= 0) return '/'

  const candidate = cleanPath.substring(0, lastSlashIndex)
  if (VIRTUAL_REDIRECT_PREFIXES.has(candidate)) {
    return '/'
  }
  return candidate
}

/**
 * Ensures that deep-linked page visits (where browser history index is 0)
 * synthesize a parent route in browser history so that pressing the browser's
 * Back button or gesture navigates to the parent route instead of closing the tab.
 */
export function useEnsureHistoryStack(): void {
  const router = useRouter()
  const isChecked = useRef(false)

  useEffect(() => {
    if (isChecked.current) return
    isChecked.current = true

    const location = router.state.location
    const pathname = location.pathname
    const parentPath = getParentRoutePath(pathname)

    if (!parentPath) return

    const historyState = location.state as { __TSR_index?: number; __synthesized?: boolean } | undefined
    if (historyState?.__synthesized || (historyState?.__TSR_index ?? 0) > 0) {
      return
    }

    const currentHref = location.href
    const parentState = { __TSR_index: 0, __synthesized: true }
    const currentState = { ...location.state, __TSR_index: 1, __synthesized: true }

    window.history.replaceState(parentState, '', parentPath)
    window.history.pushState(currentState, '', currentHref)
  }, [router])
}

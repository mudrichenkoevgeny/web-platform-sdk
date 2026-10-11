import { useRouter, type NavigateOptions, type RegisteredRouter } from '@tanstack/react-router'
import { router } from '@/router'

const STORAGE_KEY = 'app_navigation_history_map'

function saveHistoryMap(map: Map<number, string>): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(map.entries()))
    )
  } catch {
    return
  }
}

function loadHistoryMap(): Map<number, string> {
  if (typeof window === 'undefined') {
    return new Map()
  }
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as [number, string][]
      return new Map(parsed)
    }
  } catch {
    return new Map()
  }
  return new Map()
}

let appHistoryMap = loadHistoryMap()

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

export function initRouterNavigationTracker(): void {
  router.subscribe('onResolved', () => {
    const historyState = router.state.location.state as { __TSR_index?: number } | undefined
    const index = historyState?.__TSR_index ?? 0

    appHistoryMap.set(index, normalizePath(router.state.location.pathname))

    for (let i = index + 1; appHistoryMap.has(i); i++) {
      appHistoryMap.delete(i)
    }

    saveHistoryMap(appHistoryMap)
  })
}

export function useNavigateUp() {
  const routerInstance = useRouter()

  return <
    TFrom extends string = string,
    TTo extends string = string,
    TMaskFrom extends string = TFrom,
    TMaskTo extends string = ''
  >(
    opts: NavigateOptions<RegisteredRouter, TFrom, TTo, TMaskFrom, TMaskTo>
  ) => {
    const resolvedLocation = routerInstance.buildLocation(
      opts as Parameters<typeof routerInstance.buildLocation>[0]
    )
    const parentPath = normalizePath(resolvedLocation.pathname)

    const historyState = routerInstance.state.location.state as { __TSR_index?: number } | undefined
    const currentIndex = historyState?.__TSR_index ?? 0

    if (appHistoryMap.size === 0) {
      appHistoryMap = loadHistoryMap()
    }

    const currentPath = normalizePath(routerInstance.state.location.pathname)
    const immediatePreviousPath = currentIndex > 0 ? appHistoryMap.get(currentIndex - 1) : undefined

    if (immediatePreviousPath === currentPath) {
      routerInstance.history.back()
      return
    }

    let delta = 0
    for (let i = currentIndex - 1; i >= 0; i--) {
      const pathAtIndex = appHistoryMap.get(i)
      if (pathAtIndex === parentPath) {
        delta = currentIndex - i
        break
      }
    }

    if (delta > 0) {
      routerInstance.history.go(-delta)
    } else {
      void routerInstance.navigate({
        ...(opts as Parameters<typeof routerInstance.navigate>[0]),
        replace: true
      })
    }
  }
}

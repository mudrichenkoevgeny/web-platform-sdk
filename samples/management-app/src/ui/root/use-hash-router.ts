import { useEffect } from 'react'
import type { MainTabKey } from '@/ui/screen/main/main-screen-destination'

/**
 * Custom React hook for syncing browser URL hash location with active tab state in management app.
 */
export function useHashRouter(
  activeTab: MainTabKey,
  onTabChange: (tab: MainTabKey) => void
): void {
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as MainTabKey
      if (hash === 'profile' || hash === 'settings') {
        onTabChange(hash)
      } else {
        onTabChange('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [onTabChange])

  useEffect(() => {
    const hash = `#${activeTab}`
    if (window.location.hash !== hash) {
      window.history.pushState({ tab: activeTab }, '', hash)
    }
  }, [activeTab])
}

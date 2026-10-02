import { useEffect, useRef } from 'react'

export interface UseInfiniteScrollOptions {
  onLoadMore: () => void
  hasMore?: boolean
  isLoading?: boolean
  rootMarginPx?: number
  rootRef?: React.RefObject<Element | null>
}

export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>({
  onLoadMore,
  hasMore = true,
  isLoading = false,
  rootMarginPx = 200,
  rootRef
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<T | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) {
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry?.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      {
        root: rootRef?.current ?? null,
        rootMargin: `${rootMarginPx}px`
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, hasMore, isLoading, rootMarginPx, rootRef])

  return sentinelRef
}

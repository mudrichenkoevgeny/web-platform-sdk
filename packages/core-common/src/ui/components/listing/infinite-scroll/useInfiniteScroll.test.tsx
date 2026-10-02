import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useInfiniteScroll } from './useInfiniteScroll'

describe('useInfiniteScroll', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let observerCallback: IntersectionObserverCallback

  beforeEach(() => {
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    globalThis.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn()
      }
    }) as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('observes sentinel element and triggers onLoadMore on intersection', () => {
    const onLoadMore = vi.fn()

    const Component = () => {
      const sentinelRef = useInfiniteScroll({ onLoadMore })
      return <div ref={sentinelRef} />
    }

    render(<Component />)

    expect(mockObserve).toHaveBeenCalledTimes(1)

    observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('does not observe when hasMore is false', () => {
    const onLoadMore = vi.fn()

    const Component = () => {
      const sentinelRef = useInfiniteScroll({ onLoadMore, hasMore: false })
      return <div ref={sentinelRef} />
    }

    render(<Component />)

    expect(mockObserve).not.toHaveBeenCalled()
  })
})
